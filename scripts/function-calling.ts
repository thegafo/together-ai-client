import { ask } from "./ask";
import Together from "../app/together";
import { config, tools } from "./tools";

const apiKey = process.env.TOGETHERAI_API_KEY;
if (!apiKey) {
  console.error('Please set the TOGETHERAI_API_KEY environment variable.');
  process.exit(1);
}

(async () => {

  const together = new Together(apiKey);

  let template = `[INST]You must respond in only JSON ([{function: {name, parameters}}]) required to call the desired functions from QUERY, or respond with {} if no functions available. You have these functions available:\n${JSON.stringify(config, null, 2)}\n\n`;

  while (true) {
    const input = await ask('>>> ');
    if (input === 'q') {
      console.log(together.usage);
      process.exit();
    }
    const prompt = template + `QUERY: ${input}\n[/INST]`;
    console.log('---');
    console.log(prompt);
    console.log('---');
    try {
      const { completion } = await together.inference({
        prompt,
        max_tokens: 512,
        model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
        stop: ['User:', '</s>'],
      });
      try {

        const result = JSON.parse(completion);
        if ('function' in result) {
          const { name, parameters } = result.function;
          console.log('Should call function:', result.function.name);
          const response = await tools[name](parameters);
          console.log({ response })
        }
        console.log();
        console.log();
      } catch (err) {
        console.log('Error parsing JSON:', err);
      }
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  }
})();