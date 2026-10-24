import { Pool } from 'pg';
import { logger } from '../utils/logger';

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export async function initializeDatabase() {
  const client = await pool.connect();
  
  try {
    // Create tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS documents (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        file_path VARCHAR(500),
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        metadata JSONB
      );

      CREATE TABLE IF NOT EXISTS queries (
        id SERIAL PRIMARY KEY,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        confidence_score DECIMAL(5,2) NOT NULL,
        user_id VARCHAR(100),
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        metadata JSONB
      );

      CREATE TABLE IF NOT EXISTS question_clusters (
        id SERIAL PRIMARY KEY,
        week_start DATE NOT NULL,
        cluster_label VARCHAR(255),
        question_ids INTEGER[],
        avg_confidence DECIMAL(5,2),
        question_count INTEGER,
        summary TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS sop_updates (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        cluster_id INTEGER REFERENCES question_clusters(id),
        priority VARCHAR(20) DEFAULT 'medium',
        status VARCHAR(20) DEFAULT 'to_update',
        assignee VARCHAR(100),
        question_count INTEGER DEFAULT 0,
        avg_confidence DECIMAL(5,2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_queries_timestamp ON queries(timestamp);
      CREATE INDEX IF NOT EXISTS idx_queries_confidence ON queries(confidence_score);
      CREATE INDEX IF NOT EXISTS idx_clusters_week ON question_clusters(week_start);
      CREATE INDEX IF NOT EXISTS idx_sop_status ON sop_updates(status);
    `);

    logger.info('Database tables created successfully');
  } catch (error) {
    logger.error('Database initialization error:', error);
    throw error;
  } finally {
    client.release();
  }
}
