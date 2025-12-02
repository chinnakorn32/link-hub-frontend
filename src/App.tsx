import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/dashboard/Dashboard';
import LinkList from './pages/links/LinkList';
import LinkForm from './pages/links/LinkForm';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

/**
 * Main App component with routing and authentication
 */
const App: React.FC = () => {
    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#0ea5e9',
                    borderRadius: 6,
                },
            }}
        >
            <AuthProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        {/* Protected routes */}
                        <Route
                            path="/"
                            element={
                                <ProtectedRoute>
                                    <MainLayout />
                                </ProtectedRoute>
                            }
                        >
                            <Route index element={<Dashboard />} />
                            <Route path="links" element={<LinkList />} />
                            <Route path="links/new" element={<LinkForm />} />
                            <Route path="links/edit/:id" element={<LinkForm />} />
                        </Route>

                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </BrowserRouter>
            </AuthProvider>
        </ConfigProvider>
    );
};

export default App;
