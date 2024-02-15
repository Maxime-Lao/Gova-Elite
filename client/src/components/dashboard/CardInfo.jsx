import React from 'react';

const CardInfo = ({ title, nbInfo }) => {
    return (
        <div className="min-w-275 text-center h-full bg-white rounded-md shadow-md p-4">
            <div className="mb-4">
                <h6 className="text-xl font-semibold">{title}</h6>
            </div>
            <div>
                <h4 className="text-4xl font-bold">{nbInfo}</h4>
            </div>
        </div>
    );
};

export default CardInfo;