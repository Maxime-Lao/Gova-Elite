import { useState, useEffect } from 'react';

const useGetConnectedUser = () => {
    const [users, setUsers] = useState();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const localStorageToken = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    const [myToken, setMyToken] = useState(localStorageToken);

    useEffect(() => {
        if (email) {
            const fetchUsers = async () => {
                try {
                    const encodedEmail = encodeURIComponent(email);
                    const response = await fetch(`https://kame-os.fr/api/users?email=${encodedEmail}`, {

                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${myToken}`,
                        },
                    });

                    if (response.ok) {
                        const usersData = await response.json();
                        setUsers(usersData[0]);
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
        }


    }, [myToken, email]);

    return email ? { connectedUser: users, error, loading } : { connectedUser: null, error, loading };
};

export default useGetConnectedUser;
