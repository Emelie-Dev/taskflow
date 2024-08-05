import React, { createContext, useState } from 'react';
import Home from './pages/Home';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';
import CalendarPage from './pages/CalendarPage';
import Chats from './pages/Chats';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import ProjectItem from './pages/ProjectItem';
import ProtectedRoute from './components/ProtectedRoute';

export const AuthContext = createContext();

console.log(import.meta.env);

const App = () => {
  const [userData, setUserData] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  return (
    <AuthContext.Provider
      value={{ userData, setUserData, isAuthenticated, setIsAuthenticated }}
    >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={<ProtectedRoute element={Dashboard} />}
        />
        <Route
          path="/projects"
          element={<ProtectedRoute element={Projects} />}
        />
        <Route path="/tasks" element={<ProtectedRoute element={Tasks} />} />
        <Route
          path="/calendar"
          element={<ProtectedRoute element={CalendarPage} />}
        />
        <Route path="/chats" element={<ProtectedRoute element={Chats} />} />
        <Route
          path="/analytics"
          element={<ProtectedRoute element={Analytics} />}
        />
        <Route
          path="/settings"
          element={<ProtectedRoute element={Settings} />}
        />
        <Route path="/profile" element={<ProtectedRoute element={Profile} />} />
        <Route
          path="/notifications"
          element={<ProtectedRoute element={Notifications} />}
        />
        <Route
          path="/projectitem"
          element={<ProtectedRoute element={ProjectItem} />}
        />
      </Routes>
    </AuthContext.Provider>
  );
};

export default App;
