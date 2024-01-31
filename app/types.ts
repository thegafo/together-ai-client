export type CompletionRequest = {
  model?: string;
  max_tokens?: number;
  prompt: string;
  request_type?: string;
  temperature?: number;
  top_p?: number;
  top_k?: number;
  repetition_penalty?: number;
  stop?: string[];
  negative_prompt?: string;
  session_key?: string;
  log?: boolean;
}

export type UsageData = {
  prompt_tokens: number;
  completed_tokens: number;
  total_tokens: number;
}

export type CompletionResponse = {
  completion: string;
  usage: UsageData;
}
