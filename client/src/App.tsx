import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminContests from './pages/AdminContests';
import UserContests from './pages/UserContests';
import Contest from './pages/Contest';
import Submissions from './pages/Submissions';
import ContestLeaderboard from './pages/Leaderboard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/global.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <Navbar />
          <ToastContainer position="top-right" autoClose={3000} />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Navigate to="/contests" />} />

            <Route element={<PrivateRoute />}>
              <Route path="/contests" element={<UserContests />} />
              <Route path="/contest/:contestId" element={<Contest />} />
              <Route path="/submissions" element={<Submissions />} />
              <Route path="/contest/:contestId/leaderboard" element={<ContestLeaderboard />} />
            </Route>

            <Route element={<PrivateRoute allowedRole="admin" />}>
              <Route path="/admin" element={<AdminContests />} />
            </Route>
          </Routes>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;