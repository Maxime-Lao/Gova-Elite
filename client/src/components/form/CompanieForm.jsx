import React, { useState } from 'react';

function CompanieForm() {
    const [companie, setCompanie] = useState({
        name: '',
        address: '',
        zipCode: '',
        city: ''
    });

    const handleChange = (e) => {
        setCompanie({ ...companie, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://195.35.29.110:8000/api/companies', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(companie)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('Companie Created:', data);
        } catch (error) {
            console.error('Error creating companie:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input 
                type="text" 
                name="name" 
                value={companie.name} 
                onChange={handleChange} 
                placeholder="Nom de l'entreprise" 
            />
            <input 
                type="text" 
                name="address" 
                value={companie.address} 
                onChange={handleChange} 
                placeholder="Adresse" 
            />
            <input 
                type="number" 
                name="zipCode" 
                value={companie.zipCode} 
                onChange={handleChange} 
                placeholder="Code Postal" 
            />
            <input 
                type="text" 
                name="city" 
                value={companie.city} 
                onChange={handleChange} 
                placeholder="Ville" 
            />
            <button type="submit">Enregistrer</button>
        </form>
    );
}

export default CompanieForm;