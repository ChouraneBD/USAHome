import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import './App.css';

// Auth Pages
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';

// Public Pages
import Home from './pages/public/Home';
import Products from './pages/public/Products';
import Services from './pages/public/Services';
import Contact from './pages/public/Contact';

// Admin Pages - Products CRUD
import ProductsList from './pages/admin/produits/ProductsList';
import ProductCreate from './pages/admin/produits/ProductCreate';
import ProductEdit from './pages/admin/produits/ProductEdit';
import ProductView from './pages/admin/produits/ProductView';

// Admin Pages - Services CRUD
import ServicesList from './pages/admin/services/ServicesList';
import ServiceCreate from './pages/admin/services/ServiceCreate';
import ServiceEdit from './pages/admin/services/ServiceEdit';
import ServiceView from './pages/admin/services/ServiceView';

// Admin Pages - Categories CRUD
import CategoriesList from './pages/admin/categories/CategoriesList';
import CategoryCreate from './pages/admin/categories/CategoryCreate';
import CategoryEdit from './pages/admin/categories/CategoryEdit';
import CategoryView from './pages/admin/categories/CategoryView';

// Admin Pages - Dashboard and Devis Requests
import AdminDashboard from './pages/admin/AdminDashboard';
import DevisRequests from './pages/admin/DevisRequests';
import ServiceTypesAdmin from './pages/admin/ServiceTypesAdmin';

// Legacy Pages (for backward compatibility)
import Accueil from './pages/Accueil';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Signup />} />

          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />

          {/* Protected Admin Routes */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          <Route path="/admin/devis" element={
            <ProtectedRoute>
              <DevisRequests />
            </ProtectedRoute>
          } />

          <Route path="/admin/produits" element={
            <ProtectedRoute>
              <ProductsList />
            </ProtectedRoute>
          } />

          <Route path="/admin/produits/create" element={
            <ProtectedRoute>
              <ProductCreate />
            </ProtectedRoute>
          } />

          <Route path="/admin/produits/edit/:id" element={
            <ProtectedRoute>
              <ProductEdit />
            </ProtectedRoute>
          } />

          <Route path="/admin/produits/view/:id" element={
            <ProtectedRoute>
              <ProductView />
            </ProtectedRoute>
          } />

          <Route path="/admin/services" element={
            <ProtectedRoute>
              <ServicesList />
            </ProtectedRoute>
          } />

          <Route path="/admin/services/create" element={
            <ProtectedRoute>
              <ServiceCreate />
            </ProtectedRoute>
          } />

          <Route path="/admin/services/edit/:id" element={
            <ProtectedRoute>
              <ServiceEdit />
            </ProtectedRoute>
          } />

          <Route path="/admin/services/view/:id" element={
            <ProtectedRoute>
              <ServiceView />
            </ProtectedRoute>
          } />

          <Route path="/admin/service-types" element={
            <ProtectedRoute>
              <ServiceTypesAdmin />
            </ProtectedRoute>
          } />

          <Route path="/admin/categories" element={
            <ProtectedRoute>
              <CategoriesList />
            </ProtectedRoute>
          } />

          <Route path="/admin/categories/create" element={
            <ProtectedRoute>
              <CategoryCreate />
            </ProtectedRoute>
          } />

          <Route path="/admin/categories/edit/:id" element={
            <ProtectedRoute>
              <CategoryEdit />
            </ProtectedRoute>
          } />

          <Route path="/admin/categories/view/:id" element={
            <ProtectedRoute>
              <CategoryView />
            </ProtectedRoute>
          } />

          {/* Legacy Admin Routes (redirect to protected versions) */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          {/* Legacy Routes (for backward compatibility) */}
          <Route path="/accueil" element={<Accueil />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
