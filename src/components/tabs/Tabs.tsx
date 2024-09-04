import React from "react";
import "./Tabs.css";
const Tabs = ({
  tab,
  setTab,
  tabs,
}: {
  tab: number;
  setTab: (d: number) => void;
  tabs: string[];
}) => {
  return (
    <div className={`tabsContainer`}>
      {tabs.map((t, i) => (
        <div
          key={i}
          onClick={() => setTab(i)}
          className={`tab ${tab === i ? "active" : ""}`}
        >
          <span className="body-s-medium">{t}</span>
        </div>
      ))}
    </div>
  );
};

export default Tabs;
