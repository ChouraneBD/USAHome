import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

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

// Legacy Pages (for backward compatibility)
import Accueil from './pages/Accueil';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />

        {/* Admin Routes - Products CRUD */}
        <Route path="/admin/produits" element={<ProductsList />} />
        <Route path="/admin/produits/create" element={<ProductCreate />} />
        <Route path="/admin/produits/edit/:id" element={<ProductEdit />} />
        <Route path="/admin/produits/view/:id" element={<ProductView />} />

        {/* Admin Routes - Services CRUD */}
        <Route path="/admin/services" element={<ServicesList />} />
        <Route path="/admin/services/create" element={<ServiceCreate />} />
        <Route path="/admin/services/edit/:id" element={<ServiceEdit />} />
        <Route path="/admin/services/view/:id" element={<ServiceView />} />

        {/* Legacy Routes (for backward compatibility) */}
        <Route path="/accueil" element={<Accueil />} />
      </Routes>
    </Router>
  );
}

export default App;
