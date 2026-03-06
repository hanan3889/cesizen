import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';

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
    <Routes>
        <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/" element={<Navigate to="/dashboard" />} />
    </Routes>
);

export default AppRoutes;