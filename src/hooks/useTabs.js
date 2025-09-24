import { useState } from 'react';

export default function useTabs(initialTabs = []) {
  const [tabs, setTabs] = useState(initialTabs);
  const [activeTab, setActiveTab] = useState(0);

  const addTab = (newTab) => {
    setTabs((prevTabs) => [...prevTabs, newTab]);
    setActiveTab(tabs.length);
  };

  const closeTab = (index) => {
    if (tabs[index].closable) {
      const newTabs = tabs.filter((_, i) => i !== index);
      setTabs(newTabs);
      setActiveTab((prev) => (prev > 0 ? prev - 1 : 0));
    }
  };

  const closeAllTabs = () => {
    setTabs(tabs.filter((tab) => !tab.closable));
    setActiveTab(0);
  };

  const closeOtherTabs = () => {
    setTabs((prev) => [
      prev[activeTab],
      ...prev.filter((tab, idx) => !tab.closable && idx !== activeTab),
    ]);
    setActiveTab(0);
  };

  return {
    tabs,
    activeTab,
    addTab,
    closeTab,
    closeAllTabs,
    closeOtherTabs,
    setActiveTab,
  };
}