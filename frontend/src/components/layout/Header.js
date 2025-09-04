import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getLogoImage } from '../../utils/imageUtils';
import './Header.css';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="header">
      <div className="container">
        <div className="logo">
          <Link to="/">
            <img src={getLogoImage()} alt="USAHOME" className="logo-image" />
          </Link>
        </div>
        <nav className="nav">
          <Link to="/" className="nav-link">Accueil</Link>
          <Link to="/services" className="nav-link">Services</Link>
          <Link to="/products" className="nav-link">Produits</Link>
          <Link to="/contact" className="nav-link">Contact</Link>

          {isAuthenticated ? (
            <div className="auth-section">
              <span className="user-greeting">Hello, {user?.name}</span>
              <Link to="/admin/dashboard" className="nav-link admin-link">Dashboard</Link>
              <button onClick={handleLogout} className="logout-button">Logout</button>
            </div>
          ) : (
            <div className="auth-section">
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link register-link">Sign Up</Link>
            </div>
          )}
        </nav>
        <button className="cta-button">APPELEZ-NOUS</button>
      </div>
    </header>
  );
};

export default Header;
