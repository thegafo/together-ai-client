import axios from 'axios';
import { CompletionRequest, CompletionResponse, UsageData } from './types';
import { EventEmitter } from 'events';

/**
 * Executes an API call to Together AI for language model completion.
 * 
 * This function sends a POST request to the Together AI inference API with various parameters
 * defined in the CompletionRequest type. It handles streaming of tokens if enabled and 
 * returns the completion response along with usage data.
 *
 * @param {CompletionRequest} request - The completion request parameters including model, 
 *                                      max_tokens, prompt, temperature, etc.
 * @param {string} apiKey - The API key for your Together AI account.
 * @returns {Promise<CompletionResponse>} A promise that resolves to the completion response 
 *                                        from the API, including the completion text and usage data.
 * 
 * @example
 * getCompletion({
 *   model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
 *   max_tokens: 512,
 *   prompt: '[INST]Hello world[/INST]',
 *   temperature: 0.7
 * }, "apiKey").then(response => console.log(response.completion));
 */

export const getCompletion = ({
  model = "mistralai/Mixtral-8x7B-Instruct-v0.1",
  max_tokens = 512,
  prompt = "[INST]Hello world[/INST]",
  request_type = "language-model-inference",
  temperature = 0.7,
  top_p = 0.7,
  top_k = 50,
  repetition_penalty = 1,
  stop = [
    "</s>",
    "[INST]"
  ],
  negative_prompt = "",
  session_key = "",
  log = true,
}: CompletionRequest, apiKey: string): Promise<CompletionResponse> => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.post('https://api.together.xyz/inference', {
        model,
        max_tokens,
        prompt,
        request_type,
        temperature,
        top_p,
        top_k,
        repetition_penalty,
        repetitive_penalty: 1,
        stream_tokens: true,
        stop,
        negative_prompt,
        session_key,
        update_at: new Date().toISOString(),
      }, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        responseType: 'stream'
      });

      let completion = '';
      let usage: UsageData;
      let partialChunk = '';

      response.data.on('data', (raw: Buffer) => {
        const str = raw.toString('utf8').replace(/data\: /g, '').split('\n\n').filter(Boolean);
        for (let i = 0; i < str.length; i++) {
          const _chunk = partialChunk + str[i].trim();
          if (_chunk === '[DONE]') {
            // Estimate usage if not returned
            if (!usage) {
              usage = {
                prompt_tokens: Math.ceil(prompt.length / 4),
                completed_tokens: Math.ceil(completion.length / 4),
                total_tokens: Math.ceil(prompt.length / 4 + completion.length / 4),
              };
            }
            return resolve({
              completion: completion.trim(),
              usage,
            });
          }
          let chunk;
          try {
            chunk = JSON.parse(_chunk);
          } catch (err) {
            partialChunk += _chunk;
            continue;
          }
          let text = chunk.choices[0].text;
          if (chunk.usage) {
            usage = chunk.usage as UsageData;
          }
          if (log) {
            process.stdout.write(!completion && text[0] === ' ' ? text.slice(1) : text);
          }
          completion += !completion && text[0] === ' ' ? text.slice(1) : text;
          partialChunk = '';
        }
      });
    } catch (err) {
      reject(`Error: ${err}`)
    }
  });
}

export const streamCompletion = ({
  model = "mistralai/Mixtral-8x7B-Instruct-v0.1",
  max_tokens = 512,
  prompt = "[INST]Hello world[/INST]",
  request_type = "language-model-inference",
  temperature = 0.7,
  top_p = 0.7,
  top_k = 50,
  repetition_penalty = 1,
  stop = [
    "</s>",
    "[INST]"
  ],
  negative_prompt = "",
  session_key = "",
  log = true,
}: CompletionRequest, apiKey: string): Promise<EventEmitter> => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.post('https://api.together.xyz/inference', {
        model,
        max_tokens,
        prompt,
        request_type,
        temperature,
        top_p,
        top_k,
        repetition_penalty,
        repetitive_penalty: 1,
        stream_tokens: true,
        stop,
        negative_prompt,
        session_key,
        update_at: new Date().toISOString(),
      }, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        responseType: 'stream'
      });

      let completion = '';
      let usage: UsageData;
      let partialChunk = '';

      const streamEmitter = new EventEmitter();
      resolve(streamEmitter)

      response.data.on('data', (raw: Buffer) => {
        const str = raw.toString('utf8').replace(/data\: /g, '').split('\n\n').filter(Boolean);
        for (let i = 0; i < str.length; i++) {
          const _chunk = partialChunk + str[i].trim();
          if (_chunk === '[DONE]') {
            // Estimate usage if not returned
            if (!usage) {
              usage = {
                prompt_tokens: Math.ceil(prompt.length / 4),
                completed_tokens: Math.ceil(completion.length / 4),
                total_tokens: Math.ceil(prompt.length / 4 + completion.length / 4),
              };
            }

            streamEmitter.emit('done', {
              completion: completion.trim(),
              usage,
            });
          }
          let chunk;
          try {
            chunk = JSON.parse(_chunk);
          } catch (err) {
            try {
              partialChunk += _chunk ? _chunk : '';
            } catch (err) {
              console.log(err);
              console.log(typeof _chunk);
              console.log(_chunk);
            }
            continue;
          }
          let text = chunk.choices[0].text;
          if (chunk.usage) {
            usage = chunk.usage as UsageData;
          }
          if (log) {
            process.stdout.write(chunk.choices[0].text);
          }
          streamEmitter.emit('data', !completion && text[0] === ' ' ? text.slice(1) : text);
          completion += !completion && text[0] === ' ' ? text.slice(1) : text;
          partialChunk = '';
        }
      });
    } catch (err) {
      const _err = err as any;
      reject({ error: _err.message, status: _err.response.status });
    }
  });
}