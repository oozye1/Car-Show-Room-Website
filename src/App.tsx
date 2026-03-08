import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/layout/Layout';
import { AdminLayout } from './components/layout/AdminLayout';
import { Home } from './pages/public/Home';
import { Inventory } from './pages/public/Inventory';
import { CarDetails } from './pages/public/CarDetails';
import { Contact } from './pages/public/Contact';
import { AdminDashboard } from './pages/admin/Dashboard';
import { AdminCars } from './pages/admin/Cars';
import { AdminInquiries } from './pages/admin/Inquiries';
import { AdminSettings } from './pages/admin/Settings';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { HelmetProvider } from 'react-helmet-async';

export default function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/inventory" element={<Layout><Inventory /></Layout>} />
            <Route path="/inventory/:id" element={<Layout><CarDetails /></Layout>} />
            <Route path="/contact" element={<Layout><Contact /></Layout>} />

            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/cars" element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminCars />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/inquiries" element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminInquiries />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/settings" element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminSettings />
                </AdminLayout>
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}
