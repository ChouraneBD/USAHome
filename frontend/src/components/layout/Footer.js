import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="container">
          <div className="footer-sections">
            {/* Company Info */}
            <div className="footer-section">
              <h3>USAHOME</h3>
              <p>Votre partenaire de confiance pour l'informatique et la téléphonie.</p>
              <div className="social-links">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link">
                  📘 Facebook
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link">
                  🐦 Twitter
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link">
                  💼 LinkedIn
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-section">
              <h4>Liens Rapides</h4>
              <ul className="footer-links">
                <li><Link to="/">Accueil</Link></li>
                <li><Link to="/products">Nos Produits</Link></li>
                <li><Link to="/services">Nos Services</Link></li>
                <li><Link to="/contact">Contact</Link></li>
              </ul>
            </div>

            {/* Services */}
            <div className="footer-section">
              <h4>Nos Services</h4>
              <ul className="footer-links">
                <li><a href="#installation">Installation</a></li>
                <li><a href="#consultation">Consultation</a></li>
                <li><a href="#maintenance">Maintenance</a></li>
                <li><a href="#support">Support 24/7</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="footer-section">
              <h4>Contact</h4>
              <div className="contact-info">
                <div className="contact-item">
                  <span className="contact-icon">📞</span>
                  <div>
                    <p>05 22 930 938</p>
                    <p>06 14 93 93 93</p>
                  </div>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">✉️</span>
                  <div>
                    <p>info@usahome.ma</p>
                    <p>support@usahome.ma</p>
                  </div>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">📍</span>
                  <p>13, Rue 152, Groupe N° El Ouifa, Casablanca</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-content">
            <p>&copy; 2024 USAHOME. Tous droits réservés.</p>
            <div className="footer-bottom-links">
              <a href="#privacy">Politique de confidentialité</a>
              <a href="#terms">Conditions d'utilisation</a>
              <a href="#cookies">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
