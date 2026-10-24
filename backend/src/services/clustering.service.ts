import { pool } from '../config/database';
import { AIService } from './ai.service';
import { logger } from '../utils/logger';

interface QuestionCluster {
  id: number;
  questions: Array<{ id: number; question: string; confidence: number }>;
  avgConfidence: number;
  summary: string;
}

export class ClusteringService {
  /**
   * Calculate cosine similarity between two vectors
   */
  private static cosineSimilarity(a: number[], b: number[]): number {
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (magnitudeA * magnitudeB);
  }

  /**
   * Simple clustering using similarity threshold
   */
  private static clusterBySimilarity(
    questions: Array<{ id: number; question: string; embedding: number[]; confidence: number }>,
    threshold: number = 0.75
  ): number[][] {
    const clusters: number[][] = [];
    const assigned = new Set<number>();

    for (let i = 0; i < questions.length; i++) {
      if (assigned.has(i)) continue;

      const cluster = [i];
      assigned.add(i);

      for (let j = i + 1; j < questions.length; j++) {
        if (assigned.has(j)) continue;

        const similarity = this.cosineSimilarity(
          questions[i].embedding,
          questions[j].embedding
        );

        if (similarity >= threshold) {
          cluster.push(j);
          assigned.add(j);
        }
      }

      clusters.push(cluster);
    }

    return clusters;
  }

  /**
   * Generate cluster summary using LLM
   */
  private static async generateClusterSummary(questions: string[]): Promise<string> {
    const prompt = `Summarize the common theme of these questions in one concise sentence:\n\n${questions.map((q, i) => `${i + 1}. ${q}`).join('\n')}`;
    
    const { content } = await AIService.generateCompletion(
      prompt,
      'You are a helpful assistant that identifies common themes in questions.'
    );

    return content.trim();
  }

  /**
   * Perform weekly clustering
   */
  static async performWeeklyClustering(weekStart: Date): Promise<QuestionCluster[]> {
    try {
      // Get questions from the past week
      const result = await pool.query(
        `SELECT id, question, confidence_score
         FROM queries
         WHERE timestamp >= $1 AND timestamp < $1 + INTERVAL '7 days'
         ORDER BY timestamp DESC`,
        [weekStart]
      );

      if (result.rows.length === 0) {
        logger.info('No questions to cluster for this week');
        return [];
      }

      logger.info(`Clustering ${result.rows.length} questions`);

      // Generate embeddings for all questions
      const questions = result.rows;
      const embeddings = await AIService.generateBatchEmbeddings(
        questions.map(q => q.question)
      );

      const questionsWithEmbeddings = questions.map((q, i) => ({
        id: q.id,
        question: q.question,
        confidence: parseFloat(q.confidence_score),
        embedding: embeddings[i],
      }));

      // Cluster questions
      const clusterIndices = this.clusterBySimilarity(questionsWithEmbeddings);

      // Process each cluster
      const clusters: QuestionCluster[] = [];

      for (const indices of clusterIndices) {
        if (indices.length === 0) continue;

        const clusterQuestions = indices.map(i => questionsWithEmbeddings[i]);
        const avgConfidence =
          clusterQuestions.reduce((sum, q) => sum + q.confidence, 0) / clusterQuestions.length;

        // Generate summary
        const summary = await this.generateClusterSummary(
          clusterQuestions.map(q => q.question)
        );

        // Save to database
        const dbResult = await pool.query(
          `INSERT INTO question_clusters (week_start, cluster_label, question_ids, avg_confidence, question_count, summary)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING id`,
          [
            weekStart,
            summary.substring(0, 255),
            clusterQuestions.map(q => q.id),
            avgConfidence,
            clusterQuestions.length,
            summary,
          ]
        );

        clusters.push({
          id: dbResult.rows[0].id,
          questions: clusterQuestions.map(q => ({
            id: q.id,
            question: q.question,
            confidence: q.confidence,
          })),
          avgConfidence,
          summary,
        });
      }

      logger.info(`Created ${clusters.length} clusters`);
      return clusters;
    } catch (error) {
      logger.error('Clustering error:', error);
      throw error;
    }
  }

  /**
   * Get clusters for a specific week
   */
  static async getClustersForWeek(weekStart: Date) {
    const result = await pool.query(
      `SELECT * FROM question_clusters
       WHERE week_start = $1
       ORDER BY question_count DESC, avg_confidence ASC`,
      [weekStart]
    );

    return result.rows;
  }

  /**
   * Identify SOP updates needed based on clusters
   */
  static async identifySOPUpdates(weekStart: Date) {
    const clusters = await this.getClustersForWeek(weekStart);

    for (const cluster of clusters) {
      // Priority score: high frequency + low confidence = high priority
      const priorityScore =
        cluster.question_count * 0.4 +
        (100 - parseFloat(cluster.avg_confidence)) * 0.4 +
        50 * 0.2; // Base business impact

      let priority = 'low';
      if (priorityScore > 70) priority = 'high';
      else if (priorityScore > 40) priority = 'medium';

      // Check if SOP update already exists
      const existing = await pool.query(
        'SELECT id FROM sop_updates WHERE cluster_id = $1',
        [cluster.id]
      );

      if (existing.rows.length === 0) {
        await pool.query(
          `INSERT INTO sop_updates (title, description, cluster_id, priority, question_count, avg_confidence)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            cluster.cluster_label,
            cluster.summary,
            cluster.id,
            priority,
            cluster.question_count,
            cluster.avg_confidence,
          ]
        );
      }
    }

    logger.info(`Identified SOP updates for ${clusters.length} clusters`);
  }
}
