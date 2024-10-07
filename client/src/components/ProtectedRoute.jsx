import React, { useContext, useEffect } from 'react';
import { apiClient, AuthContext } from '../App';
import { Navigate, useLocation } from 'react-router-dom';
import Loader from '../components/Loader';

const ProtectedRoute = ({ element: Component, ...prop }) => {
  const { userData, setUserData, isAuthenticated, setIsAuthenticated } =
    useContext(AuthContext);
  const path = useLocation().pathname.split('/')[1];

  const firstLetter = path[0].toUpperCase();
  document.title = `TaskFlow - ${firstLetter}${path.slice(1)}`;

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await apiClient.get('/api/v1/auth/auth-check');

        if (data.status === 'success') {
          setIsAuthenticated(true);
          setUserData(data.data.user);
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="auth-loader-box">
        <Loader style={{ width: '2.5rem', height: '2.5rem' }} />
        <span className="auth-loader-text">Loading page....</span>
      </div>
    );
  }

  return isAuthenticated ? <Component {...prop} /> : <Navigate to={'/login'} />;
};

export default ProtectedRoute;
