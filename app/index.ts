import Together from "./together";
import express from 'express';
import path from 'path';
import { default as ngrok } from "ngrok";

const apiKey = process.env.TOGETHERAI_API_KEY;
if (!apiKey) {
  console.error('Please set the TOGETHERAI_API_KEY environment variable.');
  process.exit(1);
}

const together = new Together(apiKey);

const app = express();

// Serve static directory
app.use(express.static(path.join(__dirname, 'static')));

// Read JSON
app.use(express.json());

app.post('/prompt', async (req: express.Request, res: express.Response) => {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');

  req.on('close', () => {
    console.log('Connection closed.');
  })

  console.log('Generating...');
  console.log(req.body);

  try {
    const stream = await together.stream({
      model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
      prompt: req.body.prompt,
      max_tokens: req.body.max_tokens,
      temperature: req.body.temperature,
      top_p: req.body.top_p,
      repetition_penalty: req.body.repetition_penalty,
      stop: req.body.stop,
      log: false,
    });
    stream.on('data', (data: string) => {
      res.write(data);
    });

    stream.on('done', (data) => {
      console.log('Generation complete.');
      console.log(data);
      res.end()
    });
  } catch (err) {
    console.error(err);
    return res.status((err as any).status || 500).json(err);
  }
});

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  const token = process.argv[2];
  if (token) {
    try {
      await ngrok.authtoken(token);
      const url = await ngrok.connect(PORT);
      console.log(`External URL: ${url}`);
    } catch (err) {
      console.log(`Error: invalid ngrok token`);
      process.exit();
    }
  }
});
