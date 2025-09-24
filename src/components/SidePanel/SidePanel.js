import React from 'react';
import { Box, Paper } from '@mui/material';
import TreeMenu from './TreeMenu';

const SidePanel = ({ onMenuItemClick }) => {
  return (
    <Paper 
      elevation={2} 
      sx={{ 
        width: 250, 
        height: '100%', 
        overflow: 'auto',
        borderRadius: 0
      }}
    >
      <Box p={2}>
        <TreeMenu onMenuItemClick={onMenuItemClick} />
      </Box>
    </Paper>
  );
};

export default SidePanel;