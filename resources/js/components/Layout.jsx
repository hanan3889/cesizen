import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main>
                <Outlet />
            </main>
            <footer className="bg-white border-t mt-auto">
                <div className="container mx-auto px-4 py-6">
                    <p className="text-center text-gray-600">
                        © 2025 CesiZen - Ministère de la Santé et de la Prévention
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;