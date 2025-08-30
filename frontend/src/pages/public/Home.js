import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import ProductCard from '../../components/cards/ProductCard';
import ServiceCard from '../../components/cards/ServiceCard';
import Carousel from '../../components/common/Carousel';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import { useProducts } from '../../hooks/useProducts';
import { useServices } from '../../hooks/useServices';
import { getBackgroundImage } from '../../utils/imageUtils';
import laptopImg from '../../img/products/laptop.jpg';
import './Home.css';

export default function Home() {
  const { products, loading: productsLoading, error: productsError } = useProducts();
  const { services, loading: servicesLoading, error: servicesError } = useServices();

  return (
    <Layout>
      <div className="home">
      {/* Hero Section */}
      <section className="hero" style={{ backgroundImage: `url(${getBackgroundImage()})` }}>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <div className="container">
          <h3>🔥 NOS SERVICES</h3>
          <h2>Nos Services</h2>

          {servicesLoading && <Loading text="Chargement des services..." />}
          {servicesError && <ErrorMessage error={servicesError} />}

          {!servicesLoading && !servicesError && (
            <Carousel
              items={services}
              renderItem={(service, index) => (
                <ServiceCard key={service.id} service={service} index={index} />
              )}
              itemsPerView={3}
              autoPlay={true}
              autoPlayInterval={5000}
              showDots={true}
              showArrows={true}
              className="services-carousel"
            />
          )}
        </div>
      </section>

      {/* Products Section */}
      <section className="products-section">
        <div className="container">
          <h3>🔥 NOS PRODUITS</h3>
          <h2>Nos Produits</h2>

          {productsLoading && <Loading text="Chargement des produits..." />}
          {productsError && <ErrorMessage error={productsError} />}

          {!productsLoading && !productsError && (
            <Carousel
              items={products}
              renderItem={(product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              )}
              itemsPerView={3}
              autoPlay={true}
              autoPlayInterval={4500}
              showDots={true}
              showArrows={true}
              className="products-carousel"
            />
          )}
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

            <div className="contact-cta">
              <Link to="/contact" className="contact-button">
                Pour demander un devis
              </Link>
            </div>
          </div>
        </div>
      </section>
      </div>
    </Layout>
  );
}
