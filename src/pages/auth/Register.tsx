import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, LinkOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { RegisterRequest } from '../../types/auth.types';

/**
 * Register page
 */
const Register: React.FC = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values: RegisterRequest) => {
        try {
            setLoading(true);
            await register(values);
            message.success('Registration successful! Welcome to Link Hub!');
            navigate('/');
        } catch (error: any) {
            message.error(error.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-500 via-green-600 to-green-700 p-4">
            <div className="w-full max-w-md">
                {/* Logo and Title */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg mb-4">
                        <LinkOutlined className="text-5xl text-green-600" />
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-2">Link Hub</h1>
                    <p className="text-green-100 text-lg">Create your account and start managing links</p>
                </div>

                {/* Register Card */}
                <Card className="shadow-2xl rounded-2xl">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Create Account</h2>

                    <Form
                        name="register"
                        onFinish={handleSubmit}
                        autoComplete="off"
                        layout="vertical"
                        requiredMark={false}
                    >
                        <Form.Item
                            name="username"
                            rules={[
                                { required: true, message: 'Please enter your username' },
                                { min: 3, max: 50, message: 'Username must be between 3 and 50 characters' },
                            ]}
                        >
                            <Input
                                prefix={<UserOutlined className="text-gray-400" />}
                                placeholder="Username"
                                size="large"
                                className="rounded-lg"
                            />
                        </Form.Item>

                        <Form.Item
                            name="email"
                            rules={[
                                { required: true, message: 'Please enter your email' },
                                { type: 'email', message: 'Please enter a valid email' },
                            ]}
                        >
                            <Input
                                prefix={<MailOutlined className="text-gray-400" />}
                                placeholder="Email"
                                size="large"
                                className="rounded-lg"
                            />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            rules={[
                                { required: true, message: 'Please enter your password' },
                                { min: 6, message: 'Password must be at least 6 characters' },
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined className="text-gray-400" />}
                                placeholder="Password"
                                size="large"
                                className="rounded-lg"
                            />
                        </Form.Item>

                        <Form.Item
                            name="confirmPassword"
                            dependencies={['password']}
                            rules={[
                                { required: true, message: 'Please confirm your password' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Passwords do not match'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined className="text-gray-400" />}
                                placeholder="Confirm Password"
                                size="large"
                                className="rounded-lg"
                            />
                        </Form.Item>

                        <Form.Item className="mb-4">
                            <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                                loading={loading}
                                className="w-full rounded-lg h-12 text-lg font-semibold bg-gradient-to-r from-green-500 to-green-600 border-0 hover:from-green-600 hover:to-green-700"
                            >
                                Register
                            </Button>
                        </Form.Item>

                        <div className="text-center">
                            <span className="text-gray-600">Already have an account? </span>
                            <Link to="/login" className="text-green-600 font-semibold hover:text-green-700">
                                Login here
                            </Link>
                        </div>
                    </Form>
                </Card>

                {/* Footer */}
                <div className="text-center mt-6 text-green-100">
                    <p>© 2024 Link Hub Management System</p>
                </div>
            </div>
        </div>
    );
};

export default Register;
