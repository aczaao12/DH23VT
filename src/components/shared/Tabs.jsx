import React, { useState } from 'react';
import './Tabs.css';

const Tabs = ({ tabs }) => {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <div>
            <div className="tab-buttons">
                {tabs.map((tab, index) => (
                    <button
                        key={index}
                        className={activeTab === index ? 'active' : ''}
                        onClick={() => setActiveTab(index)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className="tab-content">
                {tabs[activeTab].content}
            </div>
        </div>
    );
};

export default Tabs;