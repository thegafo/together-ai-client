export type CompletionRequest = {
  model?: string;
  max_tokens?: number;
  prompt: string;
  request_type?: string;
  temperature?: number;
  top_p?: number;
  top_k?: number;
  repetition_penalty?: number;
  stream_tokens?: boolean;
  stop?: string[];
  negative_prompt?: string;
  sessionKey?: string;
  stream?: boolean;
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
