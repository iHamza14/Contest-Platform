export const judgeCode = (code: string, language: string, testCases: any[]): string => {
    // In a real system, you'd run code in a sandbox.
    // For demo, we return random verdicts.
    const verdicts = ['Accepted', 'Wrong Answer', 'Runtime Error', 'Time Limit Exceeded'];
    return verdicts[Math.floor(Math.random() * verdicts.length)];
  };