import { qdrantClient, COLLECTION_NAME } from '../config/qdrant';
import { pool } from '../config/database';
import { AIService } from './ai.service';
import { logger } from '../utils/logger';

interface RAGResult {
  answer: string;
  confidence: number;
  sources: Array<{ id: number; title: string; snippet: string }>;
}

export class RAGService {
  /**
   * Calculate confidence score based on retrieval and LLM confidence
   */
  private static calculateConfidence(
    similarities: number[],
    llmConfidence: number
  ): number {
    if (similarities.length === 0) return 0;

    const maxSimilarity = Math.max(...similarities);
    const top3Avg = similarities
      .slice(0, 3)
      .reduce((a, b) => a + b, 0) / Math.min(3, similarities.length);

    // Confidence formula from requirements
    const confidence = (
      0.4 * maxSimilarity +
      0.3 * top3Avg +
      0.3 * llmConfidence
    ) * 100;

    return Math.round(confidence * 100) / 100;
  }

  /**
   * Query the RAG system
   */
  static async query(question: string, userId?: string): Promise<RAGResult> {
    try {
      // Generate embedding for the question
      const questionEmbedding = await AIService.generateEmbedding(question);

      // Search in Qdrant
      const searchResults = await qdrantClient.search(COLLECTION_NAME, {
        vector: questionEmbedding,
        limit: 5,
        with_payload: true,
      });

      if (searchResults.length === 0) {
        return {
          answer: "I couldn't find relevant information in the documentation to answer this question.",
          confidence: 0,
          sources: [],
        };
      }

      // Extract similarities and context
      const similarities = searchResults.map(r => r.score);
      const context = searchResults
        .map(r => r.payload?.text || '')
        .join('\n\n');

      // Generate answer using LLM
      const systemPrompt = `You are a helpful assistant that answers questions based on company documentation. 
Use the provided context to answer the question. If you're not confident, say so.
At the end of your response, include your confidence level as "Confidence: X%" where X is 0-100.`;

      const prompt = `Context:\n${context}\n\nQuestion: ${question}\n\nAnswer:`;

      const { content, confidence: llmConfidence } = await AIService.generateCompletion(
        prompt,
        systemPrompt
      );

      // Calculate final confidence
      const finalConfidence = this.calculateConfidence(similarities, llmConfidence);

      // Extract sources
      const sources = searchResults.slice(0, 3).map(r => ({
        id: r.payload?.doc_id as number,
        title: r.payload?.title as string,
        snippet: (r.payload?.text as string).substring(0, 200) + '...',
      }));

      // Log the query
      await pool.query(
        `INSERT INTO queries (question, answer, confidence_score, user_id, metadata)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          question,
          content,
          finalConfidence,
          userId,
          JSON.stringify({ sources, similarities }),
        ]
      );

      logger.info(`Query processed: confidence=${finalConfidence}%`);

      return {
        answer: content,
        confidence: finalConfidence,
        sources,
      };
    } catch (error) {
      logger.error('RAG query error:', error);
      throw error;
    }
  }

  /**
   * Get low confidence queries for review
   */
  static async getLowConfidenceQueries(threshold: number = 70) {
    const result = await pool.query(
      `SELECT id, question, answer, confidence_score, timestamp
       FROM queries
       WHERE confidence_score < $1
       ORDER BY timestamp DESC
       LIMIT 50`,
      [threshold]
    );

    return result.rows;
  }
}
