import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import SubmissionsTable from '../components/SubmissionsTable';

const Submissions = () => {
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      const response = await api.get('/submissions');
      setSubmissions(response.data);
    };
    fetchSubmissions();
  }, []);

  return (
    <div className="container">
      <SubmissionsTable submissions={submissions} />
    </div>
  );
};

export default Submissions;