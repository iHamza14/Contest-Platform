import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import api from '../api/axios';
import { useSocket } from '../contexts/SocketContext';
import EditorThemeSelector from '../components/EditorThemeSelector';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/contest.css';

const Contest = () => {
  const { contestId } = useParams();
  const socket = useSocket();
  const [contest, setContest] = useState<any>(null);
  const [selectedProblem, setSelectedProblem] = useState<any>(null);
  const [code, setCode] = useState('// write your code here');
  const [language, setLanguage] = useState('javascript');
  const [editorTheme, setEditorTheme] = useState('vs-dark');
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  useEffect(() => {
    const fetchContest = async () => {
      const response = await api.get(`/contests/${contestId}`);
      setContest(response.data);
      setSelectedProblem(response.data.problems[0]);
    };
    fetchContest();
  }, [contestId]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('editorTheme');
    if (savedTheme) setEditorTheme(savedTheme);
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.emit('joinContest', contestId);

    socket.on('newSubmission', (submission) => {
      setSubmissions(prev => [submission, ...prev]);
      toast.info(`New submission from ${submission.username}: ${submission.verdict}`);
    });

    socket.on('leaderboardUpdate', (updatedLeaderboard) => {
      setLeaderboard(updatedLeaderboard);
    });

    return () => {
      socket.off('newSubmission');
      socket.off('leaderboardUpdate');
      socket.emit('leaveContest', contestId);
    };
  }, [socket, contestId]);

  const handleSubmit = async () => {
    try {
      const response = await api.post('/submissions', {
        problemId: selectedProblem.id,
        code,
        language
      });
      toast.success(`Submission received! Verdict: ${response.data.verdict}`);
    } catch (err) {
      toast.error('Submission failed');
    }
  };

  const handleThemeChange = (theme: string) => {
    setEditorTheme(theme);
    localStorage.setItem('editorTheme', theme);
  };

  if (!contest) return <div>Loading...</div>;

  return (
    <div className="contest-workspace">
      <div className="problems-sidebar card">
        <h3>Problems</h3>
        {contest.problems.map((p: any) => (
          <div
            key={p.id}
            className={`problem-tab ${selectedProblem?.id === p.id ? 'active' : ''}`}
            onClick={() => setSelectedProblem(p)}
          >
            {p.title}
          </div>
        ))}
        <div className="leaderboard-preview">
          <h4>Leaderboard</h4>
          {leaderboard.slice(0, 5).map(entry => (
            <div key={entry.rank}>{entry.rank}. {entry.username} - {entry.solved}</div>
          ))}
          <a href={`/contest/${contestId}/leaderboard`}>View full</a>
        </div>
      </div>

      <div className="problem-statement card">
        <h2>{selectedProblem?.title}</h2>
        <p>{selectedProblem?.description}</p>
        {/* Add sample I/O if available */}
      </div>

      <div className="editor-panel card">
        <div className="editor-header">
          <div>
            <EditorThemeSelector currentTheme={editorTheme} onThemeChange={handleThemeChange} />
            <select value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="cpp">C++</option>
            </select>
          </div>
          <button onClick={handleSubmit} className="btn">Submit</button>
        </div>
        <Editor
          height="60vh"
          language={language}
          value={code}
          onChange={(value) => setCode(value || '')}
          theme={editorTheme}
          options={{ fontSize: 14, minimap: { enabled: false } }}
        />
        <div className="submissions-feed">
          <h4>Live Submissions</h4>
          <ul>
            {submissions.slice(0, 10).map(sub => (
              <li key={sub.id} className={`verdict-${sub.verdict.toLowerCase().replace(' ', '-')}`}>
                {sub.username} - {sub.verdict}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Contest;