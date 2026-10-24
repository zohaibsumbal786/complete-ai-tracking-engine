import { QdrantClient } from '@qdrant/js-client-rest';
import { logger } from '../utils/logger';

export const qdrantClient = new QdrantClient({
  url: process.env.QDRANT_URL || 'http://localhost:6333',
});

const COLLECTION_NAME = 'documents';
const VECTOR_SIZE = 768; // For m2-bert-80M-8k-retrieval

export async function initializeQdrant() {
  try {
    // Check if collection exists
    const collections = await qdrantClient.getCollections();
    const exists = collections.collections.some(c => c.name === COLLECTION_NAME);

    if (!exists) {
      // Create collection
      await qdrantClient.createCollection(COLLECTION_NAME, {
        vectors: {
          size: VECTOR_SIZE,
          distance: 'Cosine',
        },
      });
      logger.info(`Qdrant collection '${COLLECTION_NAME}' created`);
    } else {
      logger.info(`Qdrant collection '${COLLECTION_NAME}' already exists`);
    }
  } catch (error) {
    logger.error('Qdrant initialization error:', error);
    throw error;
  }
}

export { COLLECTION_NAME };
