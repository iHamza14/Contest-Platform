import React from 'react';

interface Submission {
  id: number;
  problemTitle: string;
  language: string;
  verdict: string;
  submittedAt: string;
}

const SubmissionsTable = ({ submissions }: { submissions: Submission[] }) => {
  const getVerdictClass = (verdict: string) => {
    const v = verdict.toLowerCase().replace(' ', '-');
    return `verdict-${v}`;
  };

  return (
    <div className="submissions-table card">
      <h3>Your Submissions</h3>
      <table>
        <thead>
          <tr>
            <th>Problem</th>
            <th>Language</th>
            <th>Verdict</th>
            <th>Submitted</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map(sub => (
            <tr key={sub.id}>
              <td>{sub.problemTitle}</td>
              <td>{sub.language}</td>
              <td className={getVerdictClass(sub.verdict)}>{sub.verdict}</td>
              <td>{new Date(sub.submittedAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SubmissionsTable;