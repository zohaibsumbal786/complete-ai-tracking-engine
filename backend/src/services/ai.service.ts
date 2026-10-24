import axios from 'axios';
import { logger } from '../utils/logger';

const TOGETHER_API_URL = 'https://api.together.xyz/v1';
const API_KEY = process.env.TOGETHER_API_KEY;

export class AIService {
  /**
   * Generate embeddings for text using Together AI
   */
  static async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await axios.post(
        `${TOGETHER_API_URL}/embeddings`,
        {
          model: process.env.EMBEDDING_MODEL || 'togethercomputer/m2-bert-80M-8k-retrieval',
          input: text,
        },
        {
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.data[0].embedding;
    } catch (error: any) {
      logger.error('Embedding generation error:', error.response?.data || error.message);
      throw new Error('Failed to generate embedding');
    }
  }

  /**
   * Generate chat completion using Together AI
   */
  static async generateCompletion(
    prompt: string,
    systemPrompt?: string
  ): Promise<{ content: string; confidence: number }> {
    try {
      const messages = [];
      
      if (systemPrompt) {
        messages.push({ role: 'system', content: systemPrompt });
      }
      
      messages.push({ role: 'user', content: prompt });

      const response = await axios.post(
        `${TOGETHER_API_URL}/chat/completions`,
        {
          model: process.env.LLM_MODEL || 'meta-llama/Llama-3-8b-chat-hf',
          messages,
          max_tokens: 512,
          temperature: 0.7,
        },
        {
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const content = response.data.choices[0].message.content;
      
      // Extract confidence if LLM provides it
      const confidenceMatch = content.match(/confidence[:\s]+(\d+)%?/i);
      const confidence = confidenceMatch ? parseInt(confidenceMatch[1]) / 100 : 0.8;

      return { content, confidence };
    } catch (error: any) {
      logger.error('Completion generation error:', error.response?.data || error.message);
      throw new Error('Failed to generate completion');
    }
  }

  /**
   * Generate batch embeddings for multiple texts
   */
  static async generateBatchEmbeddings(texts: string[]): Promise<number[][]> {
    const embeddings: number[][] = [];
    
    // Process in batches of 10 to avoid rate limits
    for (let i = 0; i < texts.length; i += 10) {
      const batch = texts.slice(i, i + 10);
      const batchEmbeddings = await Promise.all(
        batch.map(text => this.generateEmbedding(text))
      );
      embeddings.push(...batchEmbeddings);
    }
    
    return embeddings;
  }
}
