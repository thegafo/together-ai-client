# Together AI LLM Integration

## Overview
This npm package provides an API integration for Large Language Model (LLM) completions using Together AI. It's designed to facilitate efficient and customizable interactions with language models.

## Main Features
- **API Integration with Together AI:** Facilitates communication with Together AI's LLM completion service.
- **Customizable Completion Requests:** Supports various parameters like model, max tokens, prompt, temperature, etc.
- **Dynamic Streaming:** Capable of handling streaming tokens for real-time interactions.
- **Usage Data Tracking:** Keeps track of prompt and completed tokens, along with total usage.

## Usage Instructions
1. **Install the Package:**
   - Run `npm install together-api-client` or `yarn add together-api-client` to add the package to your project.
2. **Initialize Together AI Integration:**
   - Import the `Together` class from `together-api-client`.
   - Instantiate the `Together` class with your Together AI API key.
3. **Execute Inference Requests:**
   - Use the `inference` method of the `Together` class instance to make completion requests.
   - The method accepts a `CompletionRequest` object and returns the completion result along with usage data.

## Example
Here's a basic example of how to use the Together AI LLM integration:

```javascript
import Together from 'together-api-client';

const togetherAI = new Together('your_api_key');

const request = {
  model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
  max_tokens: 512,
  prompt: '[INST] Hello world [/INST]',
  temperature: 0.7
};

togetherAI.inference(request).then(response => {
  console.log(response.completion);
});
```

