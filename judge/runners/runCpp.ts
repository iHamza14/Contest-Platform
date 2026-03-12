import { exec } from "child_process"

export function runCpp(
  executable: string,
  inputFile: string,
  timeLimit: number
): Promise<string> {

  return new Promise((resolve, reject) => {

    const command = `timeout ${timeLimit / 1000} ${executable} < ${inputFile}`

    exec(command, (error, stdout, stderr) => {

      if (error) {
        reject(stderr)
      } else {
        resolve(stdout)
      }

    })

  })
}