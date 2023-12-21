import { ask } from "./ask";
import Together from ".";

const apiKey = process.env.TOGETHERAI_API_KEY;
if (!apiKey) {
  console.error('Please set the TOGETHERAI_API_KEY environment variable.');
  process.exit(1);
}

(async () => {

  const together = new Together(apiKey);

  let prompt = '[INST]\nYou are a helpful assistant talking to only User.\n\n';
  while (true) {
    const input = await ask('>>> ');
    if (input === 'q') {
      console.log(together.usage);
      process.exit();
    }
    prompt += `User: ${input}\nAssistant: `;
    try {
      const { completion } = await together.inference({
        prompt: `${prompt}\n[/INST]`,
        max_tokens: 512,
        model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
        stop: ['User:', '</s>'],
      });
      prompt += `${completion}\n`
      console.log();
      console.log();
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  }
})();