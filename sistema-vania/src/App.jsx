import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Products from './pages/Products';
import Clients from './pages/Clients';
import Proforma from './pages/Proforma';
import SalesHistory from './pages/SalesHistory';
import BatchRegistration from './pages/BatchRegistration';
import { api } from './services/api';
import { LayoutDashboard, TrendingUp, Users, Package } from 'lucide-react';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = api.isAuthenticated();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Layout>{children}</Layout>;
};

import Dashboard from './pages/Dashboard';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />

          <Route path="/productos" element={
            <ProtectedRoute>
              <Products />
            </ProtectedRoute>
          } />

          <Route path="/clientes" element={
            <ProtectedRoute>
              <Clients />
            </ProtectedRoute>
          } />

          <Route path="/proforma" element={
            <ProtectedRoute>
              <Proforma />
            </ProtectedRoute>
          } />

          <Route path="/ventas" element={
            <ProtectedRoute>
              <SalesHistory />
            </ProtectedRoute>
          } />

          <Route path="/registro-lote" element={
            <ProtectedRoute>
              <BatchRegistration />
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
