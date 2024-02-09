import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const CarSchedule = ({ rents }) => {

    const highlightDates = () => {
        const highlighted = [];

        rents.forEach((rent) => {
            const startDate = new Date(rent.dateStart);
            const endDate = new Date(rent.dateEnd);

            const currentDate = new Date(startDate);
            while (currentDate <= endDate) {
                highlighted.push(new Date(currentDate));
                currentDate.setDate(currentDate.getDate() + 1);
            }
        });

        return highlighted;
    };

    return (
        <div>
            <DatePicker
                inline
                highlightDates={highlightDates()}
            />
            <div className='flex'>
                <div className={`w-4 h-4 inline-block bg-green-400 mr-1 border-black border-2`}/>
                <p>Voiture indiponible</p>
            </div>
            <div className='flex'>
                <div className={`w-4 h-4 inline-block bg-white border-black mr-1 border-2`}/>
                <p>Voiture disponible</p>
            </div>
        </div>
    );
};

export default CarSchedule;
