import { exec } from 'child_process';
import * as fs from 'fs';

interface FunctionConfig {
  type: string;
  function: {
    name: string;
    description: string;
    parameters: {
      type: string;
      properties: {
        [path: string]: {
          type: string;
          description: string;
        };
      };
      required: string[];
    };
  };
}

const config: FunctionConfig[] = [
  {
    type: 'function',
    function: {
      name: "writeFile",
      description: "Writes content to a specified path.",
      parameters: {
        type: 'object',
        properties: {
          path: {
            type: 'string',
            description: 'The path to write to'
          },
          content: {
            type: 'string',
            description: 'The content to write'
          }
        },
        required: ['path', 'content']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: "readFile",
      description: "Reads content from a specified path.",
      parameters: {
        type: 'object',
        properties: {
          path: {
            type: 'string',
            description: 'The path to read from'
          }
        },
        required: ['path']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: "executeCommand",
      description: "Executes a bash command.",
      parameters: {
        type: 'object',
        properties: {
          command: {
            type: 'string',
            description: 'The command to execute'
          }
        },
        required: ['command']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: "respondToUser",
      description: "Responds to the user with a message.",
      parameters: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            description: 'The message to reply to the user with'
          }
        },
        required: ['message']
      }
    }
  }
];

interface FileOperationResult {
  error?: string;
  result?: string;
}

const tools: { [key: string]: (parameters: any) => Promise<FileOperationResult> } = {
  writeFile: ({ path, content }: { path: string; content: string }): Promise<FileOperationResult> => {
    return new Promise((resolve) => {
      fs.writeFile(path, content, (err) => {
        if (err) {
          resolve({ error: `Error writing to file: ${err.message}` });
        } else {
          resolve({ result: 'File written successfully.' });
        }
      });
    });
  },
  readFile: ({ path }: { path: string }): Promise<FileOperationResult> => {
    return new Promise((resolve) => {
      fs.readFile(path, 'utf8', (err, data) => {
        if (err) {
          resolve({ error: `Error reading from file: ${err.message}` });
        } else {
          resolve({ result: data });
        }
      });
    });
  },
  executeCommand: ({ command }: { command: string }): Promise<FileOperationResult> => {
    return new Promise((resolve) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          resolve({ error: `Error executing command: ${error.message}` });
        } else if (stderr) {
          resolve({ error: `Command stderr: ${stderr}` });
        } else {
          resolve({ result: stdout });
        }
      });
    });
  },
  respondToUser: ({ message }: { message: string }): Promise<FileOperationResult> => {
    return new Promise((resolve) => {
      resolve({ result: message });
    });
  }
};

export { config, tools };
