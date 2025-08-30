import React from 'react';
import { Link } from 'react-router-dom';
import { getLogoImage } from '../../utils/imageUtils';
import './Header.css';

const Header = () => {
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
          <div className="admin-links">
            <Link to="/admin/produits" className="nav-link admin-link">Gestion Produits</Link>
            <Link to="/admin/services" className="nav-link admin-link">Gestion Services</Link>
          </div>
        </nav>
        <button className="cta-button">APPELEZ-NOUS</button>
      </div>
    </header>
  );
};

export default Header;
