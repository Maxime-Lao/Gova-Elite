import React, { useState } from 'react';
import useGetConnectedUser from '../hooks/useGetConnectedUser';

function CompanieForm() {
    const user = useGetConnectedUser();

    const [companie, setCompanie] = useState({
        name: '',
        address: '',
        zipCode: '',
        city: '',
        createdAt: new Date().toISOString(),
    });
    const [kbisFile, setKbisFile] = useState(null); // État pour le fichier Kbis

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCompanie({ ...companie, [name]: value });
    };

    const handleFileChange = (e) => {
        setKbisFile(e.target.files[0]); // Mettre à jour l'état avec le fichier sélectionné
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        Object.keys(companie).forEach(key => {
            formData.append(key, companie[key]);
        });
        if (kbisFile) {
            formData.append('kbis', kbisFile); // Ajouter le fichier Kbis à FormData
        }

        try {
            const response = await fetch('http://195.35.29.110:8000/api/companies', {
                method: 'POST',
                body: formData, // Utiliser FormData au lieu de JSON.stringify
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
                type="text" 
                name="zipCode" 
                value={companie.zipCode.toString()} 
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
            <input 
                type="file" 
                name="kbis" 
                onChange={handleFileChange} 
            />
            <button type="submit">Enregistrer</button>
        </form>
    );
}

export default CompanieForm;
