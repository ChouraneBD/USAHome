import React, { useEffect, useState } from 'react';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import { useProducts } from '../hooks/useProducts';
import { useServices } from '../hooks/useServices';
import './Accueil.css';

export default function Accueil() {
  const { services: allServices, loading: servicesLoading } = useServices();
  const { products: allProducts, loading: productsLoading } = useProducts();
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const [contactForm, setContactForm] = useState({
    nom: '',
    email: '',
    objet: '',
    message: ''
  });

  useEffect(() => {
    if (allServices.length > 0) {
      console.log('Services data:', allServices);
      allServices.forEach((service, index) => {
        console.log(`Service ${index + 1} image_url:`, service.image_url);
      });
      setServices(allServices.slice(0, 4)); // Show first 4 services
    }
  }, [allServices]);

  useEffect(() => {
    if (allProducts.length > 0) {
      console.log('Products data:', allProducts);
      allProducts.forEach((product, index) => {
        console.log(`Product ${index + 1} image_url:`, product.image_url);
      });
      setProducts(allProducts.slice(0, 4)); // Show first 4 products
    }
  }, [allProducts]);

  const handleContactSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:8000/api/devis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...contactForm,
          type_devis: 'service' // Default for accueil page
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert(data.message || 'Message envoyé avec succès!');
        setContactForm({ nom: '', email: '', objet: '', message: '' });
      } else {
        alert(data.message || 'Une erreur est survenue lors de l\'envoi de votre message.');
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
    }
  };

  const handleInputChange = (e) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="accueil">
      <style>
        {`
          /* Modern Card Styles with Enhanced Colors */
          .modern-service-card, .modern-product-card {
            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(10px);
            border-radius: 24px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.08);
            overflow: hidden;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            height: 420px;
            display: flex;
            flex-direction: column;
            border: 1px solid rgba(255,255,255,0.3);
            position: relative;
          }

          .modern-service-card::before, .modern-product-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899);
          }

          .modern-product-card::before {
            background: linear-gradient(90deg, #06b6d4, #3b82f6, #6366f1);
          }

          .modern-service-card:hover, .modern-product-card:hover {
            transform: translateY(-12px) scale(1.02);
            box-shadow: 0 20px 60px rgba(0,0,0,0.15);
            border-color: rgba(99, 102, 241, 0.3);
          }

          .modern-card-image-container {
            height: 220px;
            overflow: hidden;
            position: relative;
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          }

          .modern-card-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.4s ease;
            filter: brightness(1.05) contrast(1.05);
          }

          .modern-service-card:hover .modern-card-image,
          .modern-product-card:hover .modern-card-image {
            transform: scale(1.08);
            filter: brightness(1.1) contrast(1.1) saturate(1.1);
          }

          .modern-card-placeholder {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 4.5rem;
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%);
            color: white;
            position: relative;
          }

          .modern-card-placeholder::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
            animation: pulse 3s ease-in-out infinite;
          }

          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }

          .modern-product-card .modern-card-placeholder {
            background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #6366f1 100%);
          }

          .modern-card-content {
            padding: 24px;
            flex: 1;
            display: flex;
            flex-direction: column;
            background: linear-gradient(135deg, #ffffff 0%, #fafbfc 100%);
          }

          .modern-card-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 12px;
          }

          .modern-card-title {
            font-size: 20px;
            font-weight: 700;
            color: #1e293b;
            margin: 0;
            line-height: 1.3;
            letter-spacing: -0.025em;
          }

          .modern-card-badge {
            background: linear-gradient(135deg, #7c3aed, #4c1d95);
            color: white;
            padding: 6px 14px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            box-shadow: 0 2px 8px rgba(124, 58, 237, 0.3);
          }

          .modern-product-card .modern-card-badge {
            background: linear-gradient(135deg, #1e40af, #1e3a8a);
            box-shadow: 0 2px 8px rgba(30, 64, 175, 0.3);
          }

          .modern-card-description {
            color: #64748b;
            font-size: 14px;
            line-height: 1.6;
            margin: 0 0 18px 0;
            flex: 1;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .modern-card-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: auto;
            padding-top: 16px;
            border-top: 1px solid #e2e8f0;
          }

          .modern-card-price {
            font-size: 22px;
            font-weight: 800;
            color: #7c2d12;
            text-shadow: 0 1px 2px rgba(124, 45, 18, 0.1);
          }

          .modern-product-card .modern-card-price {
            color: #1e3a8a;
            text-shadow: 0 1px 2px rgba(30, 58, 138, 0.1);
          }

          .modern-card-button {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 16px 38px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
            text-decoration: none;
            display: inline-block;
            text-align: center;
          }

          .modern-card-button::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            transition: left 0.5s;
          }

          .modern-card-button:hover::before {
            left: 100%;
          }

          .modern-card-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6);
          }

          .modern-product-card .modern-card-button {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
          }

          .modern-product-card .modern-card-button:hover {
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
          }

          /* Grid Layout */
          .services-grid, .products-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
            gap: 32px;
            margin: 48px 0;
            padding: 0 16px;
          }

          @media (max-width: 768px) {
            .modern-service-card, .modern-product-card {
              height: 380px;
              margin: 0 8px;
            }

            .modern-card-image-container {
              height: 180px;
            }

            .services-grid, .products-grid {
              grid-template-columns: 1fr;
              gap: 24px;
              padding: 0 8px;
            }

            .modern-card-content {
              padding: 20px;
            }

            .modern-card-title {
              font-size: 18px;
            }
          }

          /* Additional visual enhancements */
          .modern-service-card:nth-child(2n) {
            transform: translateY(8px);
          }

          .modern-product-card:nth-child(2n) {
            transform: translateY(8px);
          }

          .modern-service-card:nth-child(3n) {
            transform: translateY(16px);
          }

          .modern-product-card:nth-child(3n) {
            transform: translateY(16px);
          }
        `}
      </style>
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="logo">
            <h1>USAHOME</h1>
          </div>
          <nav className="nav">
            <a href="#accueil">Accueil</a>
            <a href="#optimisation">OptimaTique</a>
            <a href="#produits">Nos Produits / Services</a>
            <a href="#support">Support</a>
            <a href="#contact">Contactez-Nous</a>
          </nav>
          <button className="cta-button">APPELEZ-NOUS</button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <span className="hero-subtitle">INFORMATIQUE & TÉLÉPHONIE</span>
            <h2>Nous vous proposons fourniture et pose</h2>
            <button className="hero-button">Plus</button>
          </div>
          <div className="hero-image">
            <div className="laptop-mockup">
              <div className="screen"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <div className="container">
          <h3>🔥 NOS SERVICES</h3>
          <h2>Nos Services</h2>

          <div className="services-grid">
            {services.map((service, index) => (
              <div key={service.id} className="modern-service-card">
                <div className="modern-card-image-container">
                  {service.image_url ? (
                    <img
                      src={service.image_url.startsWith('http') ? service.image_url : `http://127.0.0.1:8000${service.image_url}`}
                      alt={service.nom}
                      className="modern-card-image"
                      onError={(e) => {
                        console.log('Service image failed to load:', service.image_url);
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<div class="modern-card-placeholder">🔧</div>';
                      }}
                    />
                  ) : (
                    <div className="modern-card-placeholder">🔧</div>
                  )}
                </div>
                <div className="modern-card-content">
                  <div className="modern-card-header">
                    <h3 className="modern-card-title">{service.nom}</h3>
                    {service.type && (
                      <span className="modern-card-badge">{service.type.nom}</span>
                    )}
                  </div>
                  <p className="modern-card-description">{service.description}</p>
                  <div className="modern-card-footer">
                    {service.prix && (
                      <div className="modern-card-price">{service.prix} €</div>
                    )}
                    <button className="modern-card-button">En savoir plus</button>
                  </div>
                </div>
              </div>
            ))}

            {/* Add some default service cards if no services loaded */}
            {services.length === 0 && (
              <>
                <div className="service-card">
                  <div className="service-card-inner">
                    <div className="service-card-front service-1">
                      <div className="service-overlay">
                        <h4>Installation de réfrigérateur</h4>
                        <p>Service d'installation professionnelle</p>
                        <span className="category">Installation</span>
                      </div>
                    </div>
                    <div className="service-card-back">
                      <h3>Installation de réfrigérateur</h3>
                      <p className="service-details">Service complet d'installation professionnelle de réfrigérateurs avec garantie.</p>
                      <ul className="service-features">
                        <li>Installation professionnelle</li>
                        <li>Garantie 2 ans</li>
                        <li>Support technique</li>
                        <li>Maintenance incluse</li>
                      </ul>
                      <div className="service-price">À partir de 150 €</div>
                      <button className="service-button">Demander un devis</button>
                    </div>
                  </div>
                </div>
                <div className="service-card">
                  <div className="service-card-inner">
                    <div className="service-card-front service-2">
                      <div className="service-overlay">
                        <h4>Consultation décoration</h4>
                        <p>Conseils personnalisés pour la décoration</p>
                        <span className="category">Consultation</span>
                      </div>
                    </div>
                    <div className="service-card-back">
                      <h3>Consultation décoration</h3>
                      <p className="service-details">Conseils d'experts pour transformer votre espace avec style et fonctionnalité.</p>
                      <ul className="service-features">
                        <li>Consultation personnalisée</li>
                        <li>Plans 3D inclus</li>
                        <li>Suivi de projet</li>
                        <li>Conseils d'achat</li>
                      </ul>
                      <div className="service-price">À partir de 200 €</div>
                      <button className="service-button">Demander un devis</button>
                    </div>
                  </div>
                </div>
                <div className="service-card">
                  <div className="service-card-inner">
                    <div className="service-card-front service-3">
                      <div className="service-overlay">
                        <h4>Maintenance technique</h4>
                        <p>Service de maintenance et réparation</p>
                        <span className="category">Maintenance</span>
                      </div>
                    </div>
                    <div className="service-card-back">
                      <h3>Maintenance technique</h3>
                      <p className="service-details">Service complet de maintenance et réparation pour tous vos équipements.</p>
                      <ul className="service-features">
                        <li>Diagnostic gratuit</li>
                        <li>Réparation rapide</li>
                        <li>Pièces d'origine</li>
                        <li>Garantie réparation</li>
                      </ul>
                      <div className="service-price">À partir de 80 €</div>
                      <button className="service-button">Demander un devis</button>
                    </div>
                  </div>
                </div>
                <div className="service-card">
                  <div className="service-card-inner">
                    <div className="service-card-front service-4">
                      <div className="service-overlay">
                        <h4>Support technique</h4>
                        <p>Assistance technique 24/7</p>
                        <span className="category">Support</span>
                      </div>
                    </div>
                    <div className="service-card-back">
                      <h3>Support technique</h3>
                      <p className="service-details">Assistance technique disponible 24h/24 et 7j/7 pour tous vos besoins.</p>
                      <ul className="service-features">
                        <li>Support 24/7</li>
                        <li>Intervention rapide</li>
                        <li>Assistance à distance</li>
                        <li>Formation utilisateur</li>
                      </ul>
                      <div className="service-price">À partir de 50 €</div>
                      <button className="service-button">Demander un devis</button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="products-section">
        <div className="container">
          <h3>🔥 NOS PRODUITS</h3>
          <h2>Nos Produits</h2>

          <div className="products-grid">
            {products.map((product, index) => (
              <div key={product.id} className="modern-product-card">
                <div className="modern-card-image-container">
                  {product.image_url ? (
                    <img
                      src={product.image_url.startsWith('http') ? product.image_url : `http://127.0.0.1:8000${product.image_url}`}
                      alt={product.nom}
                      className="modern-card-image"
                      onError={(e) => {
                        console.log('Product image failed to load:', product.image_url);
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<div class="modern-card-placeholder">📦</div>';
                      }}
                    />
                  ) : (
                    <div className="modern-card-placeholder">📦</div>
                  )}
                </div>
                <div className="modern-card-content">
                  <div className="modern-card-header">
                    <h3 className="modern-card-title">{product.nom}</h3>
                    {product.categorie && (
                      <span className="modern-card-badge">{product.categorie.nom}</span>
                    )}
                  </div>
                  <p className="modern-card-description">{product.description}</p>
                  <div className="modern-card-footer">
                    <div className="modern-card-price">{product.prix} €</div>
                    <button className="modern-card-button">Acheter</button>
                  </div>
                </div>
              </div>
            ))}

            {/* Add some default product cards if no products loaded */}
            {products.length === 0 && (
              <>
                <div className="product-card">
                  <div className="product-card-inner">
                    <div className="product-card-front product-1">
                      <div className="product-overlay">
                        <h4>Réfrigérateur</h4>
                        <p>Réfrigérateur moderne et économique</p>
                        <span className="price">499.99 €</span>
                        <span className="category">Électroménager</span>
                      </div>
                    </div>
                    <div className="product-card-back">
                      <h3>Réfrigérateur</h3>
                      <p className="product-details">Réfrigérateur moderne avec technologie No Frost et classe énergétique A++.</p>
                      <ul className="product-specs">
                        <li>Capacité 300L</li>
                        <li>Classe A++</li>
                        <li>No Frost</li>
                        <li>Garantie 2 ans</li>
                      </ul>
                      <div className="product-price">499.99 €</div>
                      <button className="product-button">Acheter maintenant</button>
                    </div>
                  </div>
                </div>
                <div className="product-card">
                  <div className="product-card-inner">
                    <div className="product-card-front product-2">
                      <div className="product-overlay">
                        <h4>Canapé</h4>
                        <p>Canapé confortable pour le salon</p>
                        <span className="price">299.99 €</span>
                        <span className="category">Meubles</span>
                      </div>
                    </div>
                    <div className="product-card-back">
                      <h3>Canapé</h3>
                      <p className="product-details">Canapé 3 places en tissu doux avec coussins moelleux pour un confort optimal.</p>
                      <ul className="product-specs">
                        <li>3 places</li>
                        <li>Tissu premium</li>
                        <li>Coussins déhoussables</li>
                        <li>Livraison gratuite</li>
                      </ul>
                      <div className="product-price">299.99 €</div>
                      <button className="product-button">Acheter maintenant</button>
                    </div>
                  </div>
                </div>
                <div className="product-card">
                  <div className="product-card-inner">
                    <div className="product-card-front product-3">
                      <div className="product-overlay">
                        <h4>Vase décoratif</h4>
                        <p>Beau vase pour décorer votre maison</p>
                        <span className="price">49.99 €</span>
                        <span className="category">Décoration</span>
                      </div>
                    </div>
                    <div className="product-card-back">
                      <h3>Vase décoratif</h3>
                      <p className="product-details">Vase en céramique artisanale avec finition mate, parfait pour votre décoration.</p>
                      <ul className="product-specs">
                        <li>Céramique artisanale</li>
                        <li>Finition mate</li>
                        <li>Hauteur 30cm</li>
                        <li>Design moderne</li>
                      </ul>
                      <div className="product-price">49.99 €</div>
                      <button className="product-button">Acheter maintenant</button>
                    </div>
                  </div>
                </div>
                <div className="product-card">
                  <div className="product-card-inner">
                    <div className="product-card-front product-4">
                      <div className="product-overlay">
                        <h4>Table basse</h4>
                        <p>Table basse moderne en bois</p>
                        <span className="price">199.99 €</span>
                        <span className="category">Meubles</span>
                      </div>
                    </div>
                    <div className="product-card-back">
                      <h3>Table basse</h3>
                      <p className="product-details">Table basse en bois massif avec design scandinave et finition naturelle.</p>
                      <ul className="product-specs">
                        <li>Bois massif</li>
                        <li>Design scandinave</li>
                        <li>120x60cm</li>
                        <li>Montage inclus</li>
                      </ul>
                      <div className="product-price">199.99 €</div>
                      <button className="product-button">Acheter maintenant</button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <div className="container">
          <div className="contact-info">
            <h3>🔥 NOUS CONTACTER</h3>
            <h2>Besoin plus d'informations ?</h2>
            <p>Nous sommes à l'écoute, n'hésitez pas à nous contacter, on vous répond au plus vite</p>

            <div className="contact-details">
              <div className="contact-item">
                <div className="contact-icon">📞</div>
                <div>
                  <h4>Téléphone</h4>
                  <p>05 22 930 938 / 06 14 93 93 93</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">✉️</div>
                <div>
                  <h4>Email</h4>
                  <p>info@usahome.ma - support@usahome.ma</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">📍</div>
                <div>
                  <h4>Adresse</h4>
                  <p>13, Rue 152, Groupe N° El Ouifa, Casablanca</p>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-form-container">
            <h3>🔥 NOUS CONNAÎTRE</h3>
            <h2>Comment pouvons-nous vous aider ?</h2>
            <p>Merci de nous laisser votre demande, un de nos collaborateurs traitera votre demande le plutôt possible</p>

            <form onSubmit={handleContactSubmit} className="contact-form">
              <div className="form-row">
                <input
                  type="text"
                  name="nom"
                  placeholder="Nom*"
                  value={contactForm.nom}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email*"
                  value={contactForm.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <input
                type="text"
                name="objet"
                placeholder="Objet*"
                value={contactForm.objet}
                onChange={handleInputChange}
                required
              />
              <textarea
                name="message"
                placeholder="Votre Message"
                rows="4"
                value={contactForm.message}
                onChange={handleInputChange}
              ></textarea>
              <button type="submit" className="submit-button">ENVOYEZ LE MESSAGE</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
