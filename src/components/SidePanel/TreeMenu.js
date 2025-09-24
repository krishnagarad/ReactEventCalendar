import React from 'react';
import { 
  SimpleTreeView, 
  TreeItem 
} from '@mui/x-tree-view';
import { 
  ExpandMore, 
  ChevronRight,
  Dashboard as DashboardIcon,
  Event as EventIcon,
  Person as PersonIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import Dashboard from '../../pages/Dashboard';
import Events from '../../pages/Events';
import Profile from '../../pages/Profile';
import Settings from '../../pages/Settings';
import { getAuthToken } from '../../auth/authTokens';

const allMenuItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <DashboardIcon />,
    component: Dashboard,
    path: '/dashboard',
    requiresAuth: false
  },
  {
    id: 'events',
    label: 'Events',
    icon: <EventIcon />,
    component: Events,
    path: '/events',
    requiresAuth: true
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: <PersonIcon />,
    component: Profile,
    path: '/profile',
    requiresAuth: true
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <SettingsIcon />,
    component: Settings,
    path: '/settings',
    requiresAuth: true
  }
];

const TreeMenu = ({ onMenuItemClick }) => {
  const isAuthenticated = !!getAuthToken();
  
  // Filter menu items based on authentication status
  const menuItems = allMenuItems.filter(item => 
    !item.requiresAuth || isAuthenticated
  );

  const handleNodeSelect = (event, nodeId) => {
    const menuItem = menuItems.find(item => item.id === nodeId);
    if (menuItem) {
      onMenuItemClick(menuItem);
    }
  };

  return (
    <SimpleTreeView
      defaultCollapseIcon={<ExpandMore />}
      defaultExpandIcon={<ChevronRight />}
      onSelectedItemsChange={handleNodeSelect}
    >
      {menuItems.map((item) => (
        <TreeItem
          key={item.id}
          itemId={item.id}
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.5 }}>
              {item.icon}
              <Typography variant="body2">{item.label}</Typography>
            </Box>
          }
        />
      ))}
    </SimpleTreeView>
  );
};

export default TreeMenu;