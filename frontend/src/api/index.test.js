import {
  fetchAccueil,
  fetchContact,
  fetchProduitMessage,
  fetchServiceMessage,
  fetchProduits,
  fetchCategoriesProduits,
  fetchServices,
  fetchTypesServices
} from './index';

describe('API functions', () => {
  test('fetchAccueil returns accueil message', async () => {
    const data = await fetchAccueil();
    expect(data).toHaveProperty('message');
  });

  test('fetchContact returns contact message', async () => {
    const data = await fetchContact();
    expect(data).toHaveProperty('message');
  });

  test('fetchProduitMessage returns produit message', async () => {
    const data = await fetchProduitMessage();
    expect(data).toHaveProperty('message');
  });

  test('fetchServiceMessage returns service message', async () => {
    const data = await fetchServiceMessage();
    expect(data).toHaveProperty('message');
  });

  test('fetchProduits returns array of products', async () => {
    const data = await fetchProduits();
    expect(Array.isArray(data)).toBe(true);
  });

  test('fetchCategoriesProduits returns array of categories', async () => {
    const data = await fetchCategoriesProduits();
    expect(Array.isArray(data)).toBe(true);
  });

  test('fetchServices returns array of services', async () => {
    const data = await fetchServices();
    expect(Array.isArray(data)).toBe(true);
  });

  test('fetchTypesServices returns array of service types', async () => {
    const data = await fetchTypesServices();
    expect(Array.isArray(data)).toBe(true);
  });
});
