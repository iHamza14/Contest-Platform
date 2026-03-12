import React, { useState } from 'react';
import api from '../api/axios';

const AdminContests = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    problems: [{ title: '', description: '', testCases: '' }]
  });

  const addProblem = () => {
    setForm({
      ...form,
      problems: [...form.problems, { title: '', description: '', testCases: '' }]
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/contests', form);
      alert('Contest created successfully!');
      // Reset form or redirect
    } catch (err) {
      alert('Failed to create contest');
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Create New Contest</h2>
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Contest Title"
            value={form.title}
            onChange={(e) => setForm({...form, title: e.target.value})}
            required
          />
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({...form, description: e.target.value})}
            required
          />
          <div style={{ display: 'flex', gap: '1rem' }}>
            <input
              type="datetime-local"
              value={form.startTime}
              onChange={(e) => setForm({...form, startTime: e.target.value})}
              required
            />
            <input
              type="datetime-local"
              value={form.endTime}
              onChange={(e) => setForm({...form, endTime: e.target.value})}
              required
            />
          </div>

          <h3>Problems</h3>
          {form.problems.map((p, idx) => (
            <div key={idx} style={{ marginBottom: '1rem', border: '1px solid #ccc', padding: '1rem' }}>
              <input
                placeholder="Problem Title"
                value={p.title}
                onChange={(e) => {
                  const newProblems = [...form.problems];
                  newProblems[idx].title = e.target.value;
                  setForm({...form, problems: newProblems});
                }}
              />
              <textarea
                placeholder="Problem Description"
                value={p.description}
                onChange={(e) => {
                  const newProblems = [...form.problems];
                  newProblems[idx].description = e.target.value;
                  setForm({...form, problems: newProblems});
                }}
              />
              <textarea
                placeholder="Test Cases (JSON)"
                value={p.testCases}
                onChange={(e) => {
                  const newProblems = [...form.problems];
                  newProblems[idx].testCases = e.target.value;
                  setForm({...form, problems: newProblems});
                }}
              />
            </div>
          ))}
          <button type="button" onClick={addProblem} className="btn btn-secondary">+ Add Problem</button>
          <button type="submit" className="btn" style={{ marginLeft: '1rem' }}>Create Contest</button>
        </form>
      </div>
    </div>
  );
};

export default AdminContests;