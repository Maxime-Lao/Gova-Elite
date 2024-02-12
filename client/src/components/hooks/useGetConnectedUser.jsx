import { useState, useEffect } from 'react';

const useGetConnectedUser = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const localStorageToken = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    const [myToken, setMyToken] = useState(localStorageToken);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(`http://195.35.29.110:8000/api/users/by-email/${email}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${myToken}`,
                    },
                });

                if (response.ok) {
                    const usersData = await response.json();
                    setUsers(usersData);
                } else {
                    setError('Erreur lors de la récupération des utilisateurs');
                }
            } catch (error) {
                setError('Erreur lors de la récupération des utilisateurs: ' + error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [myToken, email]);

    return { connectedUser: users, error, loading };
};

export default useGetConnectedUser;
