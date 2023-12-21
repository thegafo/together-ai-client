export const ask = async (question: string) => {
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise<string>((resolve) => {
    readline.question(question, (input: string) => {
      resolve(input);
      readline.close();
    });
  });
};