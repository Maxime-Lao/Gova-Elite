import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';

const CarSchedule = ({ car }) => {
    const dayClassName = (date) => {
        const formattedDate = format(date, 'yyyy-MM-dd');

        if (car.rents?.some((rent) => formattedDate >= format(new Date(rent.dateStart), 'yyyy-MM-dd') && formattedDate <= format(new Date(rent.dateEnd), 'yyyy-MM-dd'))) {
            return 'bg-yellow-500';
        }

        if (car.unavailabilities?.some((unavailability) => formattedDate >= format(new Date(unavailability.date_start), 'yyyy-MM-dd') && formattedDate <= format(new Date(unavailability.date_end), 'yyyy-MM-dd'))) {
            return 'bg-red-500';
        }

        return '';
    };

    return (
        car.unavailabilities && car.rents && (
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
