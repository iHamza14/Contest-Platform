import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

export const Dashboard = () => {
  const [contests, setContests] = useState([]);

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const res = await api.get('/contests');
        setContests(res.data);
      } catch (error) {
        console.error('Failed to fetch contests');
      }
    };
    fetchContests();
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">Active Contests</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contests.map((contest: any) => (
            <div key={contest.id} className="bg-white rounded-lg shadow border border-slate-200 p-6 flex flex-col transition-all hover:shadow-md">
              <h3 className="text-xl font-semibold mb-2">{contest.title}</h3>
              <p className="text-slate-600 mb-4 line-clamp-2">{contest.description || 'No description provided.'}</p>
              
              <div className="mt-auto flex justify-between items-center text-sm text-slate-500">
                <span>By: {contest.host?.username || 'Unknown'}</span>
                <span>{contest._count?.problems || 0} Problems</span>
              </div>
              
              <button className="mt-4 w-full bg-blue-50 bg-opacity-50 text-blue-700 border border-blue-200 hover:bg-blue-100 font-medium py-2 px-4 rounded transition-colors">
                View & Join
              </button>
            </div>
          ))}
          
          {contests.length === 0 && (
            <div className="col-span-full text-center py-12 text-slate-500">
              No active contests found. Be the first to host one!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
