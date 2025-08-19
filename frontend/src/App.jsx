import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import LoginStudent from './components/Auth/LoginStudent';
import LoginTeacher from './components/Auth/LoginTeacher';
import Dashboard from './pages/Dashboard';
import CourseDetail from './pages/CourseDetail';
import Fichier from './pages/Fichier';
import NotFond from './pages/404';
import Chat from './chat';
import OnlineStudents from './OnlineStudents';

function App() {
  return (
    <Router>
      <div className="App" style={{ display: 'flex' }}>
        {/* Barre latérale élèves connectés visible partout */}
        <OnlineStudents />

        <div style={{ flex: 1, padding: 0 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login-student" element={<LoginStudent />} />
            <Route path="/login-teacher" element={<LoginTeacher />} />
            <Route path="/dashboard" element={<Dashboard />} />
            {/* <Route path="/students" element={<Students />} /> */}
            <Route path="/chat" element={<Chat />} />
            <Route path="/course" element={<CourseDetail />} />
            <Route path="/fichier" element={<Fichier />} />
            <Route path="*" element={<NotFond />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
