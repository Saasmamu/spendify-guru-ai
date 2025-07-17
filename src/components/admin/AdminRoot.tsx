
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLogin from '@/pages/admin/Login';
import AdminDashboard from '@/pages/admin/Dashboard';
import { AdminProtectedRoute } from './AdminProtectedRoute';

export const AdminRoot = () => {
  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />
      <Route path="/*" element={
        <AdminProtectedRoute>
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/dashboard" element={<AdminDashboard />} />
          </Routes>
        </AdminProtectedRoute>
      } />
    </Routes>
  );
};

export default AdminRoot;
