import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

import Navbar from '../components/Navbar';

import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Informations from '../pages/Informations';
import InformationShow from '../pages/Information/Show';
import ShowCategory from '../pages/Categories/Show';
import UsersIndex from '../pages/Admin/Users/Index';
import AdminDashboard from '../pages/Admin/Dashboard';
import ResetPassword from '../pages/auth/ResetPassword';

const PrivateRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    if (loading) return null;
    return isAuthenticated ? children : <Navigate to="/login" />;
};

const GuestRoute = ({ children }) => {
    const { isAuthenticated, isAdmin, loading } = useAuth();
    if (loading) return null;
    if (!isAuthenticated) return children;
    return <Navigate to={isAdmin() ? '/admin/dashboard' : '/dashboard'} />;
};

const AdminRoute = ({ children }) => {
    const { isAuthenticated, isAdmin, loading } = useAuth();
    if (loading) return null;
    if (!isAuthenticated) return <Navigate to="/login" />;
    if (!isAdmin()) return <Navigate to="/dashboard" />;
    return children;
};

const AppRoutes = () => (
    <>
        <Navbar />
        <Routes>
            {/* Routes publiques */}
            <Route path="/" element={<Home />} />
            <Route path="/informations" element={<Informations />} />
            <Route path="/informations/:slug" element={<InformationShow />} />
            <Route path="/categories/:id" element={<ShowCategory />} />

            {/* Routes guest uniquement */}
            <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
            <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Routes protégées */}
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />

            {/* Routes admin */}
            <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><UsersIndex /></AdminRoute>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    </>
);

export default AppRoutes;
