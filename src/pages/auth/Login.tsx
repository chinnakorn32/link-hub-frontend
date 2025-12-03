import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined, LinkOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LoginRequest } from '../../types/auth.types';

/**
 * Login page
 */
const Login: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values: LoginRequest) => {
        try {
            setLoading(true);
            await login(values);
            message.success('Login successful!');
            navigate('/');
        } catch (error: any) {
            console.error('Login failed:', error);
            message.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 p-4 md:p-6">
            <div className="w-full max-w-md">
                {/* Logo and Title */}
                <div className="text-center mb-6 md:mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-white rounded-full shadow-lg mb-3 md:mb-4">
                        <LinkOutlined className="text-4xl md:text-5xl text-blue-600" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Link Hub</h1>
                    <p className="text-blue-100 text-base md:text-lg px-4">Welcome back! Please login to your account</p>
                </div>

                {/* Login Card */}
                <Card className="shadow-2xl rounded-2xl">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6 text-center">Login</h2>

                    <Form
                        name="login"
                        onFinish={handleSubmit}
                        autoComplete="off"
                        layout="vertical"
                        requiredMark={false}
                    >
                        <Form.Item
                            name="usernameOrEmail"
                            rules={[{ required: true, message: 'Please enter your username or email' }]}
                        >
                            <Input
                                prefix={<UserOutlined className="text-gray-400" />}
                                placeholder="Username or Email"
                                size="large"
                                className="rounded-lg"
                            />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: 'Please enter your password' }]}
                        >
                            <Input.Password
                                prefix={<LockOutlined className="text-gray-400" />}
                                placeholder="Password"
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
                                className="w-full rounded-lg h-10 md:h-12 text-base md:text-lg font-semibold bg-gradient-to-r from-blue-500 to-blue-600 border-0 hover:from-blue-600 hover:to-blue-700"
                            >
                                Login
                            </Button>
                        </Form.Item>

                        {/* <div className="text-center">
                            <span className="text-gray-600">Don't have an account? </span>
                            <Link to="/register" className="text-blue-600 font-semibold hover:text-blue-700">
                                Register here
                            </Link>
                        </div> */}
                    </Form>
                </Card>

                {/* Footer */}
                {/* <div className="text-center mt-6 text-blue-100">
                    <p>© 2024 Link Hub Management System</p>
                </div> */}
            </div>
        </div>
    );
};

export default Login;
