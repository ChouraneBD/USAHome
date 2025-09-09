import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getLogoImage } from '../../utils/imageUtils';
import './Header.css';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      setIsMobileMenuOpen(false); // Close mobile menu after logout
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="container">
        <div className="logo">
          <Link to="/" onClick={closeMobileMenu}>
            <img src={getLogoImage()} alt="USAHOME" className="logo-image" />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="nav desktop-nav">
          <Link to="/" className="nav-link">Accueil</Link>
          <Link to="/services" className="nav-link">Services</Link>
          <Link to="/products" className="nav-link">Produits</Link>
          <Link to="/contact" className="nav-link">Contact</Link>

          {isAuthenticated && (
            <div className="auth-section">
              <span className="user-greeting">Hello, {user?.name}</span>
              <Link to="/admin/dashboard" className="nav-link admin-link">Dashboard</Link>
              <button onClick={handleLogout} className="logout-button">Logout</button>
            </div>
          )}
        </nav>

        {/* CTA Button - Desktop */}
        <button className="cta-button desktop-cta">APPELEZ-NOUS</button>

        {/* Mobile Menu Toggle */}
        <button
          className={`mobile-menu-toggle ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>

        {/* Mobile Navigation */}
        <nav className={`nav mobile-nav ${isMobileMenuOpen ? 'open' : ''}`}>
          <Link to="/" className="nav-link" onClick={closeMobileMenu}>Accueil</Link>
          <Link to="/services" className="nav-link" onClick={closeMobileMenu}>Services</Link>
          <Link to="/products" className="nav-link" onClick={closeMobileMenu}>Produits</Link>
          <Link to="/contact" className="nav-link" onClick={closeMobileMenu}>Contact</Link>

          {isAuthenticated && (
            <div className="auth-section mobile-auth">
              <span className="user-greeting">Hello, {user?.name}</span>
              <Link to="/admin/dashboard" className="nav-link admin-link" onClick={closeMobileMenu}>Dashboard</Link>
              <button onClick={() => { handleLogout(); closeMobileMenu(); }} className="logout-button">Logout</button>
            </div>
          )}

          {/* CTA Button - Mobile */}
          <button className="cta-button mobile-cta" onClick={closeMobileMenu}>APPELEZ-NOUS</button>
        </nav>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && <div className="mobile-menu-overlay" onClick={closeMobileMenu}></div>}
      </div>
    </header>
  );
};

export default Header;
