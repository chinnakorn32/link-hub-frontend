import React, { useEffect, useState } from 'react';
import { Table, Button, Input, Select, Space, Card, message, Tag, Modal } from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    SearchOutlined,
    LinkOutlined,
    EyeOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import linkService from '../../services/link.service';
import { Link } from '../../types/link.types';
import DeleteConfirmModal from '../../components/common/DeleteConfirmModal';

const { Search } = Input;
const { Option } = Select;

/**
 * Link list page with table, pagination, search, and filter
 */
const LinkList: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [links, setLinks] = useState<Link[]>([]);
    const [filteredLinks, setFilteredLinks] = useState<Link[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [categories, setCategories] = useState<string[]>([]);
    const [viewModalVisible, setViewModalVisible] = useState(false);
    const [selectedLink, setSelectedLink] = useState<Link | null>(null);

    useEffect(() => {
        fetchLinks();
    }, []);

    useEffect(() => {
        // Check if navigated from dashboard with category filter
        if (location.state?.category) {
            setSelectedCategory(location.state.category);
        }
    }, [location.state]);

    useEffect(() => {
        filterLinks();
    }, [links, searchText, selectedCategory]);

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

    const filterLinks = () => {
        let filtered = [...links];

        // Filter by search text
        if (searchText) {
            filtered = filtered.filter(
                (link) =>
                    link.title.toLowerCase().includes(searchText.toLowerCase()) ||
                    link.url.toLowerCase().includes(searchText.toLowerCase()) ||
                    link.description?.toLowerCase().includes(searchText.toLowerCase())
            );
        }

        // Filter by category
        if (selectedCategory && selectedCategory !== 'all') {
            filtered = filtered.filter((link) => link.category === selectedCategory);
        }

        setFilteredLinks(filtered);
    };

    const handleDelete = async (id: string, title: string) => {
        DeleteConfirmModal.show({
            title: 'Delete Link',
            content: `Are you sure you want to delete "${title}"? This action cannot be undone.`,
            onConfirm: async () => {
                try {
                    await linkService.deleteLink(id);
                    message.success('Link deleted successfully');
                    fetchLinks();
                } catch (error) {
                    console.error('Failed to delete link:', error);
                }
            },
        });
    };

    const handleVisitLink = (url: string) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    const handleViewLink = (link: Link) => {
        setSelectedLink(link);
        setViewModalVisible(true);
    };

    const handleCloseModal = () => {
        setViewModalVisible(false);
        setSelectedLink(null);
    };

    const columns: ColumnsType<Link> = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            sorter: (a, b) => a.title.localeCompare(b.title),
            render: (text: string, record: Link) => (
                <div>
                    <div className="font-semibold text-gray-800">{text}</div>
                    <a
                        href={record.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 text-sm hover:underline"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {record.url}
                    </a>
                </div>
            ),
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
            render: (text: string) => (
                <span className="text-gray-600">{text || 'No description'}</span>
            ),
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
            filters: categories.map((cat) => ({ text: cat, value: cat })),
            onFilter: (value, record) => record.category === value,
            render: (category: string) => (
                <Tag color="blue" className="px-3 py-1">
                    {category}
                </Tag>
            ),
        },
        {
            title: 'Created Date',
            dataIndex: 'createDate',
            key: 'createDate',
            sorter: (a, b) => new Date(a.createDate).getTime() - new Date(b.createDate).getTime(),
            render: (date: string) => <span className="text-gray-600">{date}</span>,
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 330,
            render: (_: any, record: Link) => (
                <Space size="small">
                    <Button
                        type="primary"
                        size="small"
                        icon={<LinkOutlined />}
                        onClick={() => handleVisitLink(record.url)}
                    >
                        Visit
                    </Button>
                    <Button
                        type="default"
                        size="small"
                        icon={<EyeOutlined />}
                        className="bg-purple-50 text-purple-600 border-purple-300 hover:bg-purple-100 hover:text-purple-700 hover:border-purple-400"
                        onClick={() => handleViewLink(record)}
                    >
                        View
                    </Button>
                    <Button
                        type="default"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => navigate(`/links/edit/${record.id}`)}
                    >
                        Edit
                    </Button>
                    <Button
                        type="primary"
                        danger
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record.id, record.title)}
                    >
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    const pagination: TablePaginationConfig = {
        pageSize: 10,
        showSizeChanger: true,
        showTotal: (total) => `Total ${total} links`,
        pageSizeOptions: ['10', '20', '50', '100'],
    };

    return (
        <div className="space-y-4 md:space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1 md:mb-2">All Links</h2>
                    <p className="text-sm md:text-base text-gray-600">Manage your link collection</p>
                </div>
                <Button
                    type="primary"
                    size="large"
                    icon={<PlusOutlined />}
                    onClick={() => navigate('/links/new')}
                    className="shadow-md w-full sm:w-auto"
                >
                    <span className="hidden sm:inline">Add New Link</span>
                    <span className="sm:hidden">Add Link</span>
                </Button>
            </div>

            <Card className="shadow-md">
                <div className="mb-4 flex flex-col sm:flex-row gap-4">
                    <Search
                        placeholder="Search by title, URL, or description"
                        allowClear
                        enterButton={<SearchOutlined />}
                        size="large"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="flex-1"
                    />
                    <Select
                        size="large"
                        value={selectedCategory}
                        onChange={setSelectedCategory}
                        className="w-full sm:w-48"
                    >
                        <Option value="all">All Categories</Option>
                        {categories.map((category) => (
                            <Option key={category} value={category}>
                                {category}
                            </Option>
                        ))}
                    </Select>
                </div>

                <Table
                    columns={columns}
                    dataSource={filteredLinks}
                    rowKey="id"
                    loading={loading}
                    pagination={pagination}
                    scroll={{ x: 'max-content' }}
                />
            </Card>

            {/* View Link Modal */}
            <Modal
                title={<span className="text-lg md:text-xl font-semibold">Details</span>}
                open={viewModalVisible}
                onCancel={handleCloseModal}
                footer={[
                    <Button key="visit" type="primary" icon={<LinkOutlined />} onClick={() => selectedLink && handleVisitLink(selectedLink.url)}>
                        Visit Link
                    </Button>,
                    <Button key="edit" icon={<EditOutlined />} onClick={() => {
                        if (selectedLink) {
                            navigate(`/links/edit/${selectedLink.id}`);
                            handleCloseModal();
                        }
                    }}>
                        Edit
                    </Button>,
                    <Button key="close" onClick={handleCloseModal}>
                        Close
                    </Button>,
                ]}
                width={window.innerWidth < 768 ? '95%' : 700}
                style={window.innerWidth < 768 ? { top: 20, maxWidth: 'calc(100% - 16px)' } : {}}
            >
                {selectedLink && (
                    <div className="space-y-4">
                        <div>
                            <div className="text-gray-500 text-sm mb-1">Title</div>
                            <div className="text-lg font-semibold text-gray-800">{selectedLink.title}</div>
                        </div>
                        <div>
                            <div className="text-gray-500 text-sm mb-1">URL</div>
                            <a
                                href={selectedLink.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline break-all"
                            >
                                {selectedLink.url}
                            </a>
                        </div>
                        <div>
                            <div className="text-gray-500 text-sm mb-1">Description</div>
                            <div className="text-gray-700 whitespace-pre-wrap">
                                {selectedLink.description || 'No description provided'}
                            </div>
                        </div>
                        <div>
                            <div className="text-gray-500 text-sm mb-1">Category</div>
                            <Tag color="blue" className="px-3 py-1">
                                {selectedLink.category}
                            </Tag>
                        </div>
                        <div>
                            <div className="text-gray-500 text-sm mb-1">Created Date</div>
                            <div className="text-gray-700">{selectedLink.createDate}</div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default LinkList;
