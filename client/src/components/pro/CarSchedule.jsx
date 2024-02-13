import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const CarSchedule = ({ car }) => {
    const dayClassName = (date) => {
        const formattedDate = date.toISOString().split('T')[0];

        if (car.rents?.some((rent) => formattedDate >= rent.dateStart && formattedDate <= rent.dateEnd)) {
            return 'bg-yellow-500';
        }

        if (car.unavailability?.some((unavailability) => formattedDate >= unavailability.date_start && formattedDate <= unavailability.date_end)) {
            return 'bg-red-500';
        }

        return '';
    };

    return (
        car.unavailability && car.rents && (
            <div>
                <DatePicker
                    inline
                    dayClassName={dayClassName}
                />
                <div className='flex'>
                    <div className={`w-4 h-4 inline-block ${dayClassName} mr-1 border-black border-2 bg-yellow-500`}/>
                    <p>Voiture en location</p>
                </div>
                <div className='flex'>
                    <div className={`w-4 h-4 inline-block ${dayClassName} border-black mr-1 border-2 bg-red-500`}/>
                    <p>Voiture indisponible (révision ou autres)</p>
                </div>
                <div className='flex'>
                    <div className={`w-4 h-4 inline-block border-black mr-1 border-2`}/>
                    <p>Voiture disponible</p>
                </div>
            </div>
        )
    );
};

export default CarSchedule;
