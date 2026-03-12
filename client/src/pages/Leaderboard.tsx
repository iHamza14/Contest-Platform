import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import Leaderboard from '../components/Leaderboard';

const ContestLeaderboard = () => {
  const { contestId } = useParams();
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const response = await api.get(`/contests/${contestId}/leaderboard`);
      setEntries(response.data);
    };
    fetchLeaderboard();
  }, [contestId]);

  return (
    <div className="container">
      <Leaderboard entries={entries} />
    </div>
  );
};

export default ContestLeaderboard;