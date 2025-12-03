import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Table, Button, Spin } from 'antd';
import {
    LinkOutlined,
    AppstoreOutlined,
    ClockCircleOutlined,
    EyeOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import linkService from '../../services/link.service';
import { Link } from '../../types/link.types';

/**
 * Dashboard page with statistics and recent links
 */
const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [links, setLinks] = useState<Link[]>([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState<string[]>([]);

    useEffect(() => {
        fetchLinks();
    }, []);

    const fetchLinks = async () => {
        try {
            setLoading(true);
            const data = await linkService.getAllLinks();
            setLinks(data);

            // Extract unique categories
            const uniqueCategories = Array.from(new Set(data.map(link => link.category)));
            setCategories(uniqueCategories);
        } catch (error) {
            console.error('Failed to fetch links:', error);
        } finally {
            setLoading(false);
        }
    };

    const recentLinks = links.slice(0, 5);

    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            render: (text: string) => <span className="font-medium">{text}</span>,
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
            render: (category: string) => (
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    {category}
                </span>
            ),
        },
        {
            title: 'Created',
            dataIndex: 'createDate',
            key: 'createDate',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_: any, record: Link) => (
                <Button
                    type="link"
                    icon={<EyeOutlined />}
                    onClick={() => navigate(`/links/edit/${record.id}`)}
                >
                    View
                </Button>
            ),
        },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="space-y-4 md:space-y-6">
            <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1 md:mb-2">Dashboard</h2>
                <p className="text-sm md:text-base text-gray-600">Welcome to Link Hub Management System</p>
            </div>

            {/* Statistics Cards */}
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={8}>
                    <Card className="shadow-md hover:shadow-lg transition-shadow">
                        <Statistic
                            title="Total Links"
                            value={links.length}
                            prefix={<LinkOutlined className="text-blue-500" />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                    <Card className="shadow-md hover:shadow-lg transition-shadow">
                        <Statistic
                            title="Categories"
                            value={categories.length}
                            prefix={<AppstoreOutlined className="text-green-500" />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                    <Card className="shadow-md hover:shadow-lg transition-shadow">
                        <Statistic
                            title="Recent Links"
                            value={recentLinks.length}
                            prefix={<ClockCircleOutlined className="text-orange-500" />}
                            valueStyle={{ color: '#fa8c16' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Recent Links Table */}
            <Card
                title={<span className="text-lg md:text-xl font-semibold">Recent Links</span>}
                extra={
                    <Button type="primary" size="small" className="md:text-base" onClick={() => navigate('/links')}>
                        <span className="hidden sm:inline">View All</span>
                        <span className="sm:hidden">All</span>
                    </Button>
                }
                className="shadow-md"
            >
                <Table
                    columns={columns}
                    dataSource={recentLinks}
                    rowKey="id"
                    pagination={false}
                    scroll={{ x: 'max-content' }}
                />
            </Card>

            {/* Categories Overview */}
            <Card
                title={<span className="text-lg md:text-xl font-semibold">Categories</span>}
                className="shadow-md"
            >
                <div className="flex flex-wrap gap-2 md:gap-3">
                    {categories.map((category) => (
                        <div
                            key={category}
                            className="px-3 md:px-4 py-1.5 md:py-2 text-sm md:text-base bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => navigate('/links', { state: { category } })}
                        >
                            {category}
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};

export default Dashboard;
