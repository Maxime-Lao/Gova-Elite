import React, { useState } from 'react';

const VerticalTabs = ({ tabsData }) => {
    const [selectedTab, setSelectedTab] = useState(0);

    const handleTabChange = (index) => {
        setSelectedTab(index);
    };

    return (
        <div className="flex">
            <div className="flex-none border-r border-gray-300 mr-4">
                <div className="flex flex-col">
                    {tabsData.map((tab, index) => (
                        <button
                            key={index}
                            className={`text-sm px-4 py-2 mb-2 border-b ${
                                selectedTab === index
                                    ? 'bg-indigo-700 text-white'
                                    : 'hover:bg-gray-200'
                            }`}
                            onClick={() => handleTabChange(index)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>
            <div className="flex-1">
                {tabsData.map((tabContent, index) => (
                    <div
                        key={index}
                        className={`${
                            selectedTab === index ? 'block' : 'hidden'
                        } p-4`}
                    >
                        {tabContent.content}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VerticalTabs;
