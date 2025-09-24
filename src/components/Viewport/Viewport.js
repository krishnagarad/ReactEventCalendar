import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from '../Header/Header';
import SidePanel from '../SidePanel/SidePanel';
import MainPanel from '../MainPanel/MainPanel';
import Dashboard from '../../pages/Dashboard';

const routeToTabMapping = {
  '/dashboard': { id: 'dashboard', title: 'Dashboard', component: Dashboard },
  '/events': { id: 'events', title: 'Events', component: null },
  '/profile': { id: 'profile', title: 'Profile', component: null },
  '/settings': { id: 'settings', title: 'Settings', component: null }
};

const Viewport = ({ isAuthenticated, children }) => {
  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Sync tabs with current route
  useEffect(() => {
    const currentPath = location.pathname;
    const routeInfo = routeToTabMapping[currentPath];
    
    if (routeInfo) {
      const existingTab = tabs.find(tab => tab.id === routeInfo.id);
      
      if (!existingTab) {
        // Add new tab if it doesn't exist
        const newTab = {
          id: routeInfo.id,
          title: routeInfo.title,
          path: currentPath
        };
        setTabs(prev => [...prev, newTab]);
      }
      setActiveTab(routeInfo.id);
    }
  }, [location.pathname, tabs]);

  // Load Dashboard as default tab on component mount
  useEffect(() => {
    if (tabs.length === 0) {
      const defaultTab = {
        id: 'dashboard',
        title: 'Dashboard',
        path: '/dashboard'
      };
      setTabs([defaultTab]);
      setActiveTab('dashboard');
      
      // Navigate to dashboard if we're on root
      if (location.pathname === '/') {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [tabs.length, navigate, location.pathname]);

  const addTab = (menuItem) => {
    const existingTab = tabs.find(tab => tab.id === menuItem.id);
    
    if (existingTab) {
      setActiveTab(menuItem.id);
      navigate(menuItem.path);
    } else {
      const newTab = {
        id: menuItem.id,
        title: menuItem.label,
        path: menuItem.path
      };
      setTabs(prev => [...prev, newTab]);
      setActiveTab(menuItem.id);
      navigate(menuItem.path);
    }
  };

  const closeTab = (tabId) => {
    // Prevent closing the Dashboard tab if it's the last tab
    if (tabs.length === 1 && tabId === 'dashboard') {
      return;
    }

    //const tabToClose = tabs.find(tab => tab.id === tabId);
    setTabs(prev => prev.filter(tab => tab.id !== tabId));
    
    if (activeTab === tabId) {
      const remainingTabs = tabs.filter(tab => tab.id !== tabId);
      if (remainingTabs.length > 0) {
        // If Dashboard exists, make it active, otherwise pick the last tab
        const dashboardTab = remainingTabs.find(tab => tab.id === 'dashboard');
        const nextActiveTab = dashboardTab || remainingTabs[remainingTabs.length - 1];
        setActiveTab(nextActiveTab.id);
        navigate(nextActiveTab.path);
      }
    }
  };

  const handleTabChange = (tabId) => {
    const tab = tabs.find(t => t.id === tabId);
    if (tab) {
      setActiveTab(tabId);
      navigate(tab.path);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header />
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <SidePanel onMenuItemClick={addTab} isAuthenticated={isAuthenticated} />
        <MainPanel 
          tabs={tabs} 
          activeTab={activeTab} 
          onTabChange={handleTabChange}
          onTabClose={closeTab}
        >
          {children}
        </MainPanel>
      </Box>
    </Box>
  );
};

export default Viewport;