import React from 'react';
import { Layout, Dropdown, Avatar } from 'antd';
import { UserOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const { Header: AntHeader } = Layout;

/**
 * Header component
 */
const Header: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems: MenuProps['items'] = [
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: user?.email || 'Profile',
            disabled: true,
        },
        {
            type: 'divider',
        },
        {
            key: 'settings',
            icon: <SettingOutlined />,
            label: 'Settings',
            disabled: true,
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Logout',
            onClick: handleLogout,
            danger: true,
        },
    ];

    return (
        <AntHeader className="bg-white shadow-sm px-3 md:px-6 flex items-center justify-between">
            <h1 className="text-lg md:text-2xl lg:text-3xl font-bold text-gray-800 m-0">
                <span className="hidden md:inline">Link Hub Management</span>
                <span className="md:hidden">Link Hub</span>
            </h1>
            <div className="flex items-center gap-2 md:gap-4">
                <Dropdown menu={{ items: menuItems }} placement="bottomRight" arrow>
                    <div className="flex items-center gap-1 md:gap-2 cursor-pointer hover:bg-gray-100 px-2 md:px-3 py-1 md:py-2 rounded-lg transition-colors">
                        <Avatar icon={<UserOutlined />} className="bg-blue-500" />
                        <span className="font-medium text-gray-700 text-sm md:text-base hidden sm:inline">
                            {user?.username || 'User'}
                        </span>
                    </div>
                </Dropdown>
            </div>
        </AntHeader>
    );
};

export default Header;
