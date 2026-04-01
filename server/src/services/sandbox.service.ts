import { spawn } from 'child_process';
import fs from 'fs/promises';
import path from 'path';

export interface ExecutionResult {
  output: string;
  error?: string;
  status: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Runtime Error' | 'Compilation Error';
  executionTimeMs?: number;
}

export const executeCode = async (
  language: 'cpp' | 'python',
  code: string,
  input: string,
  timeLimitMs: number = 2000
): Promise<ExecutionResult> => {
  const tempDir = path.join(__dirname, '../../tmp');
  await fs.mkdir(tempDir, { recursive: true });

  const fileName = `code_${Date.now()}`;
  const codePath = path.join(tempDir, `${fileName}.${language === 'cpp' ? 'cpp' : 'py'}`);
  await fs.writeFile(codePath, code);

  let compileCommand: string | null = null;
  let compileArgs: string[] = [];
  let executeCommand: string;
  let executeArgs: string[];

  if (language === 'cpp') {
    const execPath = path.join(tempDir, fileName);
    compileCommand = 'g++';
    compileArgs = [codePath, '-o', execPath];
    executeCommand = execPath;
    executeArgs = [];
  } else {
    executeCommand = 'python3';
    executeArgs = [codePath];
  }

  return new Promise(async (resolve) => {
    // Compilation Step (C++)
    if (compileCommand) {
      const compileProcess = spawn(compileCommand, compileArgs);
      let compileError = '';
      compileProcess.stderr.on('data', (data) => {
        compileError += data.toString();
      });

      await new Promise((compResolve) => {
        compileProcess.on('close', (code) => {
          if (code !== 0) {
            resolve({
              output: '',
              error: compileError,
              status: 'Compilation Error',
            });
          }
          compResolve(true);
        });
      });
    }

    // Execution Step
    const startTime = Date.now();
    const executeProcess = spawn(executeCommand, executeArgs);

    let output = '';
    let error = '';
    let isFinished = false;

    // Write input to stdin
    if (input) {
      executeProcess.stdin.write(input);
      executeProcess.stdin.end();
    }

    executeProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    executeProcess.stderr.on('data', (data) => {
      error += data.toString();
    });

    const timeout = setTimeout(() => {
      if (!isFinished) {
        executeProcess.kill('SIGKILL');
        resolve({
          output: '',
          error: 'Execution timed out',
          status: 'Time Limit Exceeded',
          executionTimeMs: timeLimitMs,
        });
      }
    }, timeLimitMs);

    executeProcess.on('close', (code) => {
      clearTimeout(timeout);
      isFinished = true;
      const executionTimeMs = Date.now() - startTime;
      
      // Cleanup files (fire and forget for skeleton)
      fs.unlink(codePath).catch(() => {});
      if (language === 'cpp') fs.unlink(executeCommand).catch(() => {});

      if (code !== 0) {
        resolve({
          output,
          error,
          status: 'Runtime Error',
          executionTimeMs,
        });
      } else {
        resolve({
          output,
          status: 'Accepted', // Usually needs to be compared against expected output
          executionTimeMs,
        });
      }
    });
  });
};
