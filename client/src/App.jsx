import React, { createContext, useEffect, useState } from 'react';
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
import axios from 'axios';
import User from './pages/User';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorPage from './pages/ErrorPage';
import ResetPassword from './pages/ResetPassword';
import ForgotPassword from './pages/ForgotPassword';

const serverUrl =
  import.meta.env.MODE === 'production'
    ? import.meta.env.VITE_BACKEND_URL
    : import.meta.env.VITE_LOCAL_BACKEND_URL;

export const AuthContext = createContext();

export const apiClient = axios.create({
  baseURL: serverUrl,
  withCredentials: true,
});

const App = () => {
  const [userData, setUserData] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [mode, setMode] = useState('');
  const [colorNotified, setColorNotified] = useState(false);
  const [calendarNotified, setCalendarNotified] = useState(false);

  useEffect(() => {
    setMode(window.localStorage.getItem('mode'));
  }, []);

  useEffect(() => {
    if (userData.personalization) {
      const theme = userData.personalization.theme;

      switch (theme) {
        case 'light':
          setMode('light');
          window.localStorage.setItem('mode', 'light');
          break;

        case 'dark':
          setMode('dark');
          window.localStorage.setItem('mode', 'dark');
          break;

        case 'system':
          setMode(
            window.matchMedia('(prefers-color-scheme: dark)').matches
              ? 'dark'
              : 'light'
          );
          window.localStorage.setItem(
            'mode',
            window.matchMedia('(prefers-color-scheme: dark)').matches
              ? 'dark'
              : 'light'
          );
          break;

        default:
          setMode('light');
      }
    }
  }, [userData]);

  useEffect(() => {
    if (mode === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [mode]);

  return (
    <AuthContext.Provider
      value={{
        userData,
        setUserData,
        isAuthenticated,
        setIsAuthenticated,
        serverUrl,
        mode,
        setMode,
        colorNotified,
        setColorNotified,
        calendarNotified,
        setCalendarNotified,
      }}
    >
      <ErrorBoundary FallbackComponent={ErrorPage}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path={'/reset_password/:token'} element={<ResetPassword />} />
          <Route path={'/forgot_password'} element={<ForgotPassword />} />
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
          <Route
            path="/profile"
            element={<ProtectedRoute element={Profile} />}
          />
          <Route
            path="/notifications"
            element={<ProtectedRoute element={Notifications} />}
          />
          <Route
            path={'/project/:projectId'}
            element={<ProtectedRoute element={ProjectItem} />}
          />
          <Route
            path={'/user/:username'}
            element={<ProtectedRoute element={User} />}
          />

          <Route path="*" element={<ErrorPage page={'404'} />} />
        </Routes>
      </ErrorBoundary>
    </AuthContext.Provider>
  );
};

export default App;
