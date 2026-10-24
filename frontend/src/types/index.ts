export interface QueryResult {
  answer: string;
  confidence: number;
  sources: Array<{
    id: number;
    title: string;
    snippet: string;
  }>;
}

export interface SOPUpdate {
  id: number;
  title: string;
  description: string;
  cluster_id: number;
  priority: 'low' | 'medium' | 'high';
  status: 'to_update' | 'in_progress' | 'in_review' | 'done';
  assignee?: string;
  question_count: number;
  avg_confidence: number;
  created_at: string;
  updated_at: string;
  cluster_summary?: string;
}

export interface QuestionCluster {
  id: number;
  week_start: string;
  cluster_label: string;
  question_ids: number[];
  avg_confidence: number;
  question_count: number;
  summary: string;
  created_at: string;
}

export interface Stats {
  overall: {
    total_queries: number;
    avg_confidence: number;
    low_confidence_count: number;
  };
  weekly: Array<{
    week: string;
    query_count: number;
    avg_confidence: number;
  }>;
}
