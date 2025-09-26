import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { 
  Logout as LogoutIcon,
  Login as LoginIcon
} from '@mui/icons-material';

const Header = ({ isAuthenticated, handleLogout }) => {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Event Calendar Application
        </Typography>       
        <Button
          variant="contained"
          startIcon={!isAuthenticated ? <LoginIcon /> : <LogoutIcon />}
          onClick={handleLogout}
        >
          {!isAuthenticated ? 'Log In' : 'Log Out'}
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;