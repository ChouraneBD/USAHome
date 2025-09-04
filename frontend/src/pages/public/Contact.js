import React, { useState } from 'react';
import Layout from '../../components/layout/Layout';
import { useDevis } from '../../hooks/useDevis';
import './Contact.css';

const Contact = () => {
  const { createDevis } = useDevis();
  const [errors, setErrors] = useState({});
  const [contactForm, setContactForm] = useState({
    nom: '',
    email: '',
    telephone: '',
    objet: '',
    message: '',
    typeDevis: 'service' // 'service' or 'product'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');
    setSubmitSuccess(false);

    try {
      // Prepare data in the format expected by the backend
      const devisData = {
        nom: contactForm.nom,
        email: contactForm.email,
        telephone: contactForm.telephone,
        objet: contactForm.objet,
        message: contactForm.message,
        type_devis: contactForm.typeDevis
      };

      // Use the same pattern as services - call the hook's createDevis function
      const result = await createDevis(devisData);
      
      setSubmitSuccess(true);
      setSubmitMessage('Votre demande de devis a été envoyée avec succès! Nous vous contacterons bientôt.');
      
      // Reset form on success
      setContactForm({
        nom: '',
        email: '',
        telephone: '',
        objet: '',
        message: '',
        typeDevis: 'service'
      });

    } catch (error) {
      console.error('Error submitting contact form:', error);
      setSubmitSuccess(false);
      setSubmitMessage(error.message || 'Une erreur est survenue lors de l\'envoi de votre demande.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Layout>
      <div className="contact-page">
        {/* Hero Section */}
        <section className="contact-hero">
          <div className="container">
            <h1>Demander un Devis</h1>
            <p>Contactez-nous pour obtenir un devis personnalisé pour nos services et produits</p>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="contact-form-section">
          <div className="container">
            <div className="contact-content">
              {/* Contact Information */}
              <div className="contact-info-card">
                <h2>Nos Coordonnées</h2>
                
                <div className="contact-details">
                  <div className="contact-item">
                    <div className="contact-icon">📞</div>
                    <div>
                      <h4>Téléphone</h4>
                      <p>05 22 930 938</p>
                      <p>06 14 93 93 93</p>
                    </div>
                  </div>

                  <div className="contact-item">
                    <div className="contact-icon">✉️</div>
                    <div>
                      <h4>Email</h4>
                      <p>info@usahome.ma</p>
                      <p>support@usahome.ma</p>
                    </div>
                  </div>

                  <div className="contact-item">
                    <div className="contact-icon">📍</div>
                    <div>
                      <h4>Adresse</h4>
                      <p>13, Rue 152, Groupe N° El Ouifa</p>
                      <p>Casablanca, Maroc</p>
                    </div>
                  </div>

                  <div className="contact-item">
                    <div className="contact-icon">🕒</div>
                    <div>
                      <h4>Horaires</h4>
                      <p>Lun - Ven: 9h00 - 18h00</p>
                      <p>Sam: 9h00 - 13h00</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="contact-form-card">
                <h2>Demande de Devis</h2>
                <p>Remplissez le formulaire ci-dessous et nous vous contacterons dans les plus brefs délais.</p>
                
                {submitMessage && (
                  <div className={`submit-message ${submitSuccess ? 'success' : 'error'}`} style={{
                    backgroundColor: submitSuccess ? '#d4edda' : '#f8d7da',
                    border: `1px solid ${submitSuccess ? '#c3e6cb' : '#f5c6cb'}`,
                    borderRadius: '4px',
                    padding: '12px',
                    margin: '10px 0',
                    color: submitSuccess ? '#155724' : '#721c24'
                  }}>
                    {submitSuccess ? '✅' : '❌'} {submitMessage}
                  </div>
                )}

                <form onSubmit={handleContactSubmit} className="contact-form">
                  <div className="form-group">
                    <label htmlFor="nom">Nom complet *</label>
                    <input
                      type="text"
                      id="nom"
                      name="nom"
                      value={contactForm.nom}
                      onChange={handleInputChange}
                      required
                      placeholder="Votre nom complet"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="email">Email *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={contactForm.email}
                        onChange={handleInputChange}
                        required
                        placeholder="votre@email.com"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="telephone">Téléphone</label>
                      <input
                        type="tel"
                        id="telephone"
                        name="telephone"
                        value={contactForm.telephone}
                        onChange={handleInputChange}
                        placeholder="06 XX XX XX XX"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="typeDevis">Type de devis *</label>
                    <select
                      id="typeDevis"
                      name="typeDevis"
                      value={contactForm.typeDevis}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="service">Service</option>
                      <option value="product">Produit</option>
                      <option value="both">Service et Produit</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="objet">Objet *</label>
                    <input
                      type="text"
                      id="objet"
                      name="objet"
                      value={contactForm.objet}
                      onChange={handleInputChange}
                      required
                      placeholder="Objet de votre demande"
                    />
                    {errors.objet &&
                      <span className="error-message">{errors.objet}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">Message *</label>
                    <textarea
                      id="message"
                      name="message"
                      rows="5"
                      value={contactForm.message}
                      onChange={handleInputChange}
                      required
                      placeholder="Décrivez votre projet en détail..."
                    ></textarea>
                    {errors.message &&
                      <span className="error-message">{errors.message}</span>}
                  </div>

                  <button 
                    type="submit" 
                    className="submit-button"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Envoi en cours...' : 'Envoyer la demande'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Contact;
