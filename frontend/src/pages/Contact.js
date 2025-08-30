import React, { useEffect, useState } from 'react';

export default function Contact() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  useEffect(() => {
    fetch('http://localhost:8000/api/contact')
      .then(res => {
        if (!res.ok) throw new Error('API error');
        return res.json();
      })
      .then(data => setMessage(data.message))
      .catch(() => setError('Erreur lors du chargement.'));
  }, []);
  return <h2>{error ? error : message}</h2>;
}
