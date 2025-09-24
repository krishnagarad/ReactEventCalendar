import React from 'react';
import { Box, Tabs, Tab, IconButton, Typography, Paper } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const MainPanel = ({ tabs, activeTab, onTabChange, onTabClose, children }) => {
  const handleTabChange = (event, newValue) => {
    onTabChange(newValue);
  };

  const handleCloseTab = (event, tabId) => {
    event.stopPropagation();
    onTabClose(tabId);
  };

  if (tabs.length === 0) {
    return (
      <Box 
        sx={{ 
          flex: 1, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: '#f5f5f5'
        }}
      >
        <Typography variant="h6" color="textSecondary">
          Loading...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <Paper elevation={1} square>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          {tabs.map((tab) => (
            <Tab
              key={tab.id}
              value={tab.id}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span>{tab.title}</span>
                  {/* Don't show close button for Dashboard when it's the only tab */}
                  {!(tabs.length === 1 && tab.id === 'dashboard') && (
                    <IconButton
                      size="small"
                      onClick={(e) => handleCloseTab(e, tab.id)}
                      sx={{ ml: 1, p: 0.25 }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              }
            />
          ))}
        </Tabs>
      </Paper>
      
      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        {children}
      </Box>
    </Box>
  );
};

export default MainPanel;