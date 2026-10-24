import pdf from 'pdf-parse';
import { pool } from '../config/database';
import { qdrantClient, COLLECTION_NAME } from '../config/qdrant';
import { AIService } from './ai.service';
import { logger } from '../utils/logger';
import fs from 'fs/promises';

export class DocumentService {
  /**
   * Chunk text into smaller pieces with overlap
   */
  private static chunkText(text: string, chunkSize: number = 500, overlap: number = 50): string[] {
    const chunks: string[] = [];
    const words = text.split(/\s+/);
    
    for (let i = 0; i < words.length; i += chunkSize - overlap) {
      const chunk = words.slice(i, i + chunkSize).join(' ');
      if (chunk.trim()) {
        chunks.push(chunk);
      }
    }
    
    return chunks;
  }

  /**
   * Process and upload a document
   */
  static async uploadDocument(
    filePath: string,
    title: string,
    fileType: 'pdf' | 'markdown'
  ): Promise<number> {
    try {
      // Read file content
      const buffer = await fs.readFile(filePath);
      let content: string;

      if (fileType === 'pdf') {
        const pdfData = await pdf(buffer);
        content = pdfData.text;
      } else {
        content = buffer.toString('utf-8');
      }

      // Store document in database
      const result = await pool.query(
        `INSERT INTO documents (title, content, file_path, metadata)
         VALUES ($1, $2, $3, $4)
         RETURNING id`,
        [title, content, filePath, JSON.stringify({ fileType })]
      );

      const docId = result.rows[0].id;

      // Chunk the content
      const chunks = this.chunkText(content);
      logger.info(`Document chunked into ${chunks.length} pieces`);

      // Generate embeddings for chunks
      const embeddings = await AIService.generateBatchEmbeddings(chunks);

      // Upload to Qdrant
      const points = chunks.map((chunk, idx) => ({
        id: `${docId}_${idx}`,
        vector: embeddings[idx],
        payload: {
          doc_id: docId,
          title,
          text: chunk,
          chunk_index: idx,
        },
      }));

      await qdrantClient.upsert(COLLECTION_NAME, {
        wait: true,
        points,
      });

      logger.info(`Document ${docId} uploaded with ${chunks.length} chunks`);
      return docId;
    } catch (error) {
      logger.error('Document upload error:', error);
      throw error;
    }
  }

  /**
   * Get all documents
   */
  static async getAllDocuments() {
    const result = await pool.query(
      `SELECT id, title, uploaded_at, metadata
       FROM documents
       ORDER BY uploaded_at DESC`
    );

    return result.rows;
  }

  /**
   * Delete a document
   */
  static async deleteDocument(docId: number) {
    // Delete from database
    await pool.query('DELETE FROM documents WHERE id = $1', [docId]);

    // Delete from Qdrant (delete all chunks)
    // Note: Qdrant doesn't have a direct "delete by payload" in this version
    // In production, you'd want to track chunk IDs or use a newer Qdrant version
    logger.info(`Document ${docId} deleted`);
  }
}
