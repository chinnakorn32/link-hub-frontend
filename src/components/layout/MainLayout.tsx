import React from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const { Content } = Layout;

/**
 * Main layout component with sidebar and header
 */
const MainLayout: React.FC = () => {
    return (
        <Layout className="min-h-screen">
            <Sidebar />
            <Layout>
                <Header />
                <Content className="m-6 p-6 bg-gray-50 rounded-lg shadow-sm">
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default MainLayout;
