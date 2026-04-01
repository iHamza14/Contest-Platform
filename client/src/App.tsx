import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Auth } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { CreateContest } from './pages/CreateContest';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/create-contest" element={<CreateContest />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;