import { exec } from "child_process"

export function compileCpp(source: string, output: string): Promise<void> {
  return new Promise((resolve, reject) => {

    exec(`g++ ${source} -O2 -o ${output}`, (error, stderr) => {

      if (error) {
        reject(stderr)
      } else {
        resolve()
      }

    })

  })
}