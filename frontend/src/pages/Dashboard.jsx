import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold">Welcome, {user?.name}</h1>
            <button onClick={logout} className="mt-4 btn-outline">Logout</button>
        </div>
    );
};

export default Dashboard;
