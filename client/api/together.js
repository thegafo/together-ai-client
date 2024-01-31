

const { EventEmitter } = require('events');

function submitPrompt(prompt) {
  const eventEmitter = new EventEmitter();

  fetch("http://localhost:3000/prompt", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt, stop: ['User:', 'User 1:', 'User 0:', 'User 2:', '</s>'] }),
  }).then(async (response) => {
    try {
      if (response.status !== 200) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const reader = response.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          eventEmitter.emit('end');
          break;
        }
        const decoder = new TextDecoder("utf8");
        const str = decoder.decode(value);
        eventEmitter.emit('data', str);
      }
    } catch (err) {
      eventEmitter.emit('error', err);
    }
  });

  return eventEmitter;
}

module.exports = {
  submitPrompt,
};

// (async () => {
//   const emitter = submitPrompt("[INST]Yo talk like a homie[/INST]");
// 
//   emitter.on('data', (str) => {
//     process.stdout.write(str);
//   });
// 
//   emitter.on('end', () => {
//     console.log("Prompt processing completed.");
//   });
// 
//   emitter.on('error', (err) => {
//     console.error("Error occurred:", err);
//   });
// })();