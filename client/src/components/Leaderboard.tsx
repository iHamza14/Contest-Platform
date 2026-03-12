import React from 'react';

interface LeaderboardEntry {
  rank: number;
  username: string;
  solved: number;
  penalty: number;
}

const Leaderboard = ({ entries }: { entries: LeaderboardEntry[] }) => {
  return (
    <div className="leaderboard card">
      <h3>Leaderboard</h3>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>User</th>
            <th>Solved</th>
            <th>Penalty</th>
          </tr>
        </thead>
        <tbody>
          {entries.map(entry => (
            <tr key={entry.rank}>
              <td>{entry.rank}</td>
              <td>{entry.username}</td>
              <td>{entry.solved}</td>
              <td>{entry.penalty}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;