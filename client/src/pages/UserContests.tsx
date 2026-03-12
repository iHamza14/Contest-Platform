import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

interface Contest {
  id: number;
  title: string;
  startTime: string;
  endTime: string;
}

const UserContests = () => {
  const [contests, setContests] = useState<Contest[]>([]);

  useEffect(() => {
    const fetchContests = async () => {
      const response = await api.get('/contests');
      setContests(response.data);
    };
    fetchContests();
  }, []);

  return (
    <div className="container">
      <h2>All Contests</h2>
      <div className="contest-grid">
        {contests.map(contest => (
          <Link to={`/contest/${contest.id}`} key={contest.id} className="contest-card card">
            <h3>{contest.title}</h3>
            <p>Starts: {new Date(contest.startTime).toLocaleString()}</p>
            <p>Ends: {new Date(contest.endTime).toLocaleString()}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default UserContests;