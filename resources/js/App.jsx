import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/" element={<Layout />}>
                    {/* Routes publiques */}
                    <Route index element={<Home />} />
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                    
                    {/* Routes protégées */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="dashboard" element={<Dashboard />} />
                    </Route>

                    {/* Route par défaut */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
            </Routes>
        </AuthProvider>
    );
}

export default App;