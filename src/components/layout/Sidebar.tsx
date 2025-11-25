import React from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    DashboardOutlined,
    LinkOutlined,
    PlusCircleOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;

/**
 * Sidebar component with navigation menu
 */
const Sidebar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        {
            key: '/',
            icon: <DashboardOutlined />,
            label: 'Dashboard',
        },
        {
            key: '/links',
            icon: <LinkOutlined />,
            label: 'All Links',
        },
        {
            key: '/links/new',
            icon: <PlusCircleOutlined />,
            label: 'Add New Link',
        },
    ];

    const handleMenuClick = (key: string) => {
        navigate(key);
    };

    return (
        <Sider
            width={250}
            className="bg-gradient-to-b from-blue-900 to-blue-800 shadow-lg"
            breakpoint="lg"
            collapsedWidth="0"
        >
            <div className="h-16 flex items-center justify-center border-b border-blue-700">
                <LinkOutlined className="text-3xl text-white" />
                <span className="ml-3 text-white text-xl font-bold">Link Hub</span>
            </div>
            <Menu
                mode="inline"
                selectedKeys={[location.pathname]}
                onClick={({ key }) => handleMenuClick(key)}
                items={menuItems}
                className="bg-transparent border-0 text-white mt-4"
                theme="dark"
            />
        </Sider>
    );
};

export default Sidebar;
