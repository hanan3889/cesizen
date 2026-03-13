import React, { type PropsWithChildren } from 'react';
import { AdminSidebar } from '@/components/AdminSidebar';

export default function AdminLayout({ children }: PropsWithChildren) {
    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
            <AdminSidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-6 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
