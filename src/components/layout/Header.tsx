import React, { useState, useEffect } from 'react';
import { Layout, Dropdown, Avatar, Button } from 'antd';
import { UserOutlined, LogoutOutlined, SettingOutlined, MenuOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const { Header: AntHeader } = Layout;

interface HeaderProps {
    onMenuClick: () => void;
}

/**
 * Header component with hamburger menu for mobile
 */
const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

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
            <div className="flex items-center gap-2 md:gap-4">
                {isMobile && (
                    <Button
                        type="text"
                        icon={<MenuOutlined />}
                        onClick={onMenuClick}
                        className="text-xl text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                        size="large"
                    />
                )}
                <h1 className="text-lg md:text-2xl lg:text-3xl font-bold text-gray-800 m-0">
                    <span className="hidden md:inline">Link Hub Management</span>
                    <span className="md:hidden">Link Hub</span>
                </h1>
            </div>
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
