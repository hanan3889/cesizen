import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

import Navbar from '../components/Navbar'; // Import Navbar

import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Informations from '../pages/Informations';

const PrivateRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    if (loading) return null;
    return isAuthenticated ? children : <Navigate to="/login" />;
};

const GuestRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    if (loading) return null;
    return !isAuthenticated ? children : <Navigate to="/dashboard" />;
};

const AppRoutes = () => (
    <> {/* Use a Fragment to wrap Navbar and Routes */}
        <Navbar /> {/* Render Navbar here */}
        <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<Home />} />
        <Route path="/informations" element={<Informations />} />

        {/* Routes guest uniquement */}
        <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />

        {/* Routes protégées */}
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
    </Routes>
    </>
);

export default AppRoutes;