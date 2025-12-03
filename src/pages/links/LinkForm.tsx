import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Card, message, Select } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import linkService from '../../services/link.service';
import { LinkRequest } from '../../types/link.types';

const { TextArea } = Input;
const { Option } = Select;

/**
 * Link form page for creating and editing links
 */
const LinkForm: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const isEditMode = !!id;
    // const [isHidden, setIsHidden] = useState(false);

    // Predefined categories
    const predefinedCategories = [
        'Development',
        'Design',
        'Documentation',
        'Productivity',
        'Cloud',
        'DevOps',
        'Database',
        'Tools',
        'Learning',
        'Other',
    ];

    useEffect(() => {
        if (isEditMode) {
            fetchLink();
        }
    }, [id]);

    const fetchLink = async () => {
        if (!id) return;

        try {
            setLoading(true);
            const link = await linkService.getLinkById(id);
            form.setFieldsValue({
                title: link.title,
                url: link.url,
                description: link.description,
                category: link.category,
            });
        } catch (error) {
            message.error('Failed to load link details');
            navigate('/links');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (values: LinkRequest) => {
        try {
            setSubmitting(true);
            if (isEditMode && id) {
                try {
                    await linkService.updateLink(id, values);
                    message.success('Link updated successfully');
                    navigate('/links');
                    // setIsHidden(true);
                } catch (error: any) {
                    message.error(error.response?.data?.message);
                }
            } else {
                try {
                    await linkService.createLink(values);
                    message.success('Link created successfully');
                    navigate('/links');
                    // setIsHidden(true);
                } catch (error: any) {
                    message.error(error.response?.data?.message);
                }
            }
        } catch (error) {
            console.error('Failed to save link:', error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-full md:max-w-2xl lg:max-w-3xl mx-auto px-4 md:px-0">
            <div className="mb-4 md:mb-6">
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate('/links')}
                    className="mb-3 md:mb-4"
                    size="small"
                >
                    <span className="hidden sm:inline">Back to Links</span>
                    <span className="sm:hidden">Back</span>
                </Button>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1 md:mb-2">
                    {isEditMode ? 'Edit Link' : 'Add New Link'}
                </h2>
                <p className="text-sm md:text-base text-gray-600">
                    {isEditMode
                        ? 'Update the link information below'
                        : 'Fill in the details to create a new link'}
                </p>
            </div>

            <Card className="shadow-md" loading={loading}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    autoComplete="off"
                    requiredMark="optional"
                >
                    <Form.Item
                        label={<span className="font-semibold">Title</span>}
                        name="title"
                        rules={[
                            { required: true, message: 'Please enter a title' },
                            { min: 1, max: 255, message: 'Title must be between 1 and 255 characters' },
                        ]}
                    >
                        <Input
                            placeholder="Enter link title"
                            size="large"
                            maxLength={255}
                            showCount
                        />
                    </Form.Item>

                    <Form.Item
                        label={<span className="font-semibold">URL</span>}
                        name="url"
                        rules={[
                            { required: true, message: 'Please enter a URL' },
                            {
                                type: 'url',
                                message: 'Please enter a valid URL',
                            },
                            { max: 2048, message: 'URL must not exceed 2048 characters' },
                        ]}
                    >
                        <Input
                            placeholder="https://example.com"
                            size="large"
                            maxLength={2048}
                        />
                    </Form.Item>

                    <Form.Item
                        label={<span className="font-semibold">Description</span>}
                        name="description"
                        rules={[
                            { max: 5000, message: 'Description must not exceed 5000 characters' },
                        ]}
                    >
                        <TextArea
                            placeholder="Enter a description for this link"
                            rows={4}
                            maxLength={5000}
                            showCount
                        />
                    </Form.Item>

                    <Form.Item
                        label={<span className="font-semibold">Category</span>}
                        name="category"
                        rules={[
                            { required: true, message: 'Please select a category' },
                            { min: 1, max: 100, message: 'Category must be between 1 and 100 characters' },
                        ]}
                    >
                        <Select
                            placeholder="Select a category"
                            size="large"
                            showSearch
                            allowClear
                        >
                            {predefinedCategories.map((category) => (
                                <Option key={category} value={category}>
                                    {category}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item className="mb-0">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                                icon={<SaveOutlined />}
                                loading={submitting}
                                className="w-full sm:w-auto"
                            >
                                {isEditMode ? 'Update Link' : 'Create Link'}
                            </Button>
                            <Button
                                size="large"
                                onClick={() => navigate('/links')}
                                disabled={submitting}
                                className="w-full sm:w-auto"
                            >
                                Cancel
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
            </Card>

            {/* Preview Card */}
            {/* <Card
                    title={<span className="font-semibold">Preview</span>}
                    className="shadow-md mt-6"
                >
                    <Form.Item noStyle shouldUpdate>
                        {() => {
                            const values = form.getFieldsValue();
                            return (
                                <div className="space-y-3">
                                    <div>
                                        <span className="text-gray-500 text-sm">Title:</span>
                                        <div className="font-semibold text-lg">
                                            {values.title || 'No title yet'}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 text-sm">URL:</span>
                                        <div className="text-blue-500">
                                            {values.url || 'No URL yet'}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 text-sm">Description:</span>
                                        <div className="text-gray-700">
                                            {values.description || 'No description yet'}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 text-sm">Category:</span>
                                        <div>
                                            {values.category ? (
                                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                                                    {values.category}
                                                </span>
                                            ) : (
                                                'No category yet'
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        }}
                    </Form.Item>
                </Card> */}
        </div>
    );
};

export default LinkForm;
