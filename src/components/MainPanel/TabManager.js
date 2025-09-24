import React, { useState } from "react";
import TabItem from "../Tabs/TabItem";
import TabContent from "../Tabs/TabContent";

const TabManager = () => {
  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState(null);

  const addTab = (tab) => {
    const exists = tabs.find((t) => t.key === tab.key);
    if (!exists) {
      setTabs((prev) => [...prev, tab]);
      setActiveTab(tab.key);
    } else {
      setActiveTab(tab.key);
    }
  };

  const closeTab = (key) => {
    setTabs((prev) => prev.filter((tab) => tab.key !== key));
    if (activeTab === key) {
      setActiveTab(tabs.length > 1 ? tabs[0].key : null);
    }
  };

  return (
    <div>
      <div>
        {tabs.map((tab) => (
          <TabItem
            key={tab.key}
            label={tab.label}
            onClose={() => closeTab(tab.key)}
            isActive={activeTab === tab.key}
            onClick={() => setActiveTab(tab.key)}
          />
        ))}
      </div>
      <div>
        {tabs.map((tab) => (
          <TabContent
            key={tab.key}
            isActive={activeTab === tab.key}
            content={tab.content}
          />
        ))}
      </div>
    </div>
  );
};

export default TabManager;