import { judgeSubmission } from "./core/judge.ts"

async function main() {

  const result = await judgeSubmission(
    "./judge/submissions/test.cpp",
    "sum"
  )

  console.log("Verdict:", result)

}

main()