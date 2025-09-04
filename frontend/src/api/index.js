import { API_BASE } from '../config';

async function handleResponse(res) {
  const contentType = res.headers.get('content-type');
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  if (contentType && contentType.includes('application/json')) {
    return res.json();
  } else {
    throw new Error('Invalid JSON response');
  }
}

export async function fetchAccueil() {
  const res = await fetch(`${API_BASE}/accueil`);
  return handleResponse(res);
}

export async function fetchContact() {
  const res = await fetch(`${API_BASE}/contact`);
  return handleResponse(res);
}

export async function fetchProduits() {
  const res = await fetch(`${API_BASE}/produits`);
  return handleResponse(res);
}

export async function fetchCategoriesProduits() {
  const res = await fetch(`${API_BASE}/categories-produits`);
  return handleResponse(res);
}

export async function fetchServices() {
  const res = await fetch(`${API_BASE}/services`);
  return handleResponse(res);
}
