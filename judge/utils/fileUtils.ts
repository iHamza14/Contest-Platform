import fs from "fs"

export function readFile(path: string): string {
  return fs.readFileSync(path, "utf8")
}

export function getTestcases(problemDir: string) {

  const files = fs.readdirSync(problemDir)

  const inputs = files.filter(f => f.startsWith("input"))

  return inputs.map(file => ({
    input: `${problemDir}/${file}`,
    output: `${problemDir}/${file.replace("input","output")}`
  }))
}