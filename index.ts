import EventEmitter from "events";
import { getCompletion, streamCompletion } from "./api";
import { CompletionRequest, UsageData } from "./types";

export default class Together {
  private apiKey: string;
  public usage: UsageData;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.usage = {
      prompt_tokens: 0,
      completed_tokens: 0,
      total_tokens: 0,
    }
  }

  async inference(request: CompletionRequest) {
    console.log()
    const { completion, usage } = await getCompletion(request, this.apiKey);
    this.usage = {
      prompt_tokens: this.usage.prompt_tokens + usage.prompt_tokens,
      completed_tokens: this.usage.completed_tokens + usage.completed_tokens,
      total_tokens: this.usage.total_tokens + usage.total_tokens,
    };
    return { completion, usage };
  }

  async stream(request: CompletionRequest): Promise<EventEmitter> {
    const stream = await streamCompletion(request, this.apiKey);
    return stream;
  }
}