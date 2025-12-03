import React, { useState } from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const { Content } = Layout;

/**
 * Main layout component with sidebar and header
 */
const MainLayout: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleSidebarToggle = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleSidebarClose = () => {
        setSidebarOpen(false);
    };

    return (
        <Layout className="min-h-screen">
            <Sidebar open={sidebarOpen} onClose={handleSidebarClose} />
            <Layout>
                <Header onMenuClick={handleSidebarToggle} />
                <Content className="m-3 md:m-6 p-4 md:p-6 bg-gray-50 rounded-lg shadow-sm">
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default MainLayout;
