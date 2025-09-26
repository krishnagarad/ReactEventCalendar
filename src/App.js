import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { authenticate } from './api/services';
import { getAuthToken, setAuthToken } from './auth/authTokens';
import Viewport from './components/Viewport/Viewport';
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const login = async () => {
      const existingToken = getAuthToken();
      if (existingToken) {
        console.log('Already Authenticated!');
        setIsAuthenticated(true);
      } else {
        try {
          const token = await authenticate();
          setAuthToken(token);
          console.log('Authenticated!', token);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Authentication failed:', error);
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };
    login();
  }, []);

  // Handle logout
  const handleLogout = () => {
    if(isAuthenticated) {
      setAuthToken(null); // This will remove the token
      setIsAuthenticated(false);      
    }else{
      window.location.href = '/';
    }
  };

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div>Loading...</div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route 
              path="/*" 
              element={
                <Viewport isAuthenticated={isAuthenticated} handleLogout={handleLogout}>
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    {isAuthenticated && (
                      <>
                        <Route path="/events" element={<Events />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/settings" element={<Settings />} />
                      </>
                    )}
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                  </Routes>
                </Viewport>
              } 
            />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
