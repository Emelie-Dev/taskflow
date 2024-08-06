import React, { useContext, useEffect } from 'react';
import { apiClient, AuthContext } from '../App';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element: Component, ...prop }) => {
  const { userData, setUserData, isAuthenticated, setIsAuthenticated } =
    useContext(AuthContext);

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
    // Still loading, you might want to show a loading indicator
    return <></>;
  }

  return isAuthenticated ? <Component {...prop} /> : <Navigate to={'/login'} />;
};

export default ProtectedRoute;
