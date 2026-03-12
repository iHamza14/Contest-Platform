import { compileCpp } from "../compilers/cppCompiler"
import { runCpp } from "../runners/runCpp"
import { compareOutput } from "../comparators/exactMatch"
import { readFile, getTestcases } from "../utils/fileUtils"
import { judgeConfig } from "../config/judgeConfig"
import { Verdict } from "./verdict"

export async function judgeSubmission(
  sourceFile: string,
  problemId: string
) {

  const executable = `${judgeConfig.submissionDir}/program`

  try {

    await compileCpp(sourceFile, executable)

  } catch {
    return Verdict.CE
  }

  const testcases = getTestcases(`${judgeConfig.testcaseDir}/${problemId}`)

  for (const tc of testcases) {

    let output

    try {

      output = await runCpp(
        executable,
        tc.input,
        judgeConfig.timeLimit
      )

    } catch {
      return Verdict.RE
    }

    const expected = readFile(tc.output)

    const correct = compareOutput(output, expected)

    if (!correct) {
      return Verdict.WA
    }

  }

  return Verdict.AC
}