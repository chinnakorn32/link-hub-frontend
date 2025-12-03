import React, { useState, useEffect } from 'react';
import { Layout, Menu, Drawer } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    DashboardOutlined,
    LinkOutlined,
    PlusCircleOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;

interface SidebarProps {
    open: boolean;
    onClose: () => void;
}

/**
 * Sidebar component with responsive navigation menu
 * - Mobile/Tablet: Drawer from left
 * - Desktop: Fixed sidebar
 */
const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

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
        // Auto-close drawer on mobile after navigation
        if (isMobile) {
            onClose();
        }
    };

    const sidebarContent = (
        <>
            <div className="h-16 flex items-center justify-center border-b border-blue-700 px-4">
                <LinkOutlined className="text-2xl md:text-3xl text-white" />
                <span className="ml-2 md:ml-3 text-white text-lg md:text-xl font-bold">Link Hub</span>
            </div>
            <Menu
                mode="inline"
                selectedKeys={[location.pathname]}
                onClick={({ key }) => handleMenuClick(key)}
                items={menuItems}
                className="bg-transparent border-0 text-white mt-4"
                theme="dark"
                style={{ fontSize: '16px' }}
            />
        </>
    );

    // Mobile/Tablet: Drawer
    if (isMobile) {
        return (
            <Drawer
                placement="left"
                onClose={onClose}
                open={open}
                closable={false}
                width={280}
                styles={{
                    body: { padding: 0 },
                    header: { display: 'none' }
                }}
                className="sidebar-drawer"
            >
                <div className="bg-gradient-to-b from-blue-900 to-blue-800 h-full">
                    {sidebarContent}
                </div>
            </Drawer>
        );
    }

    // Desktop: Fixed Sider
    return (
        <Sider
            width={250}
            className="bg-gradient-to-b from-blue-900 to-blue-800 shadow-lg"
        >
            {sidebarContent}
        </Sider>
    );
};

export default Sidebar;
