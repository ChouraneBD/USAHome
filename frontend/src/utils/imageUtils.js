// Image utility functions for handling product and service images

// Import available images
import backgroundImg from '../img/background2.png';
import logoImg from '../img/logo.png';

// Base URL for image assets
const BASE_URL = 'http://127.0.0.1:8000';

// Sample product images (you can add more images to src/img/products/)
const productImages = [
  backgroundImg, // Using background as a sample product image
  // Add more product images here when available
];

// Sample service images (you can add more images to src/img/services/)
const serviceImages = [
  backgroundImg, // Using background as a sample service image
  // Add more service images here when available
];

// Technology/IT related placeholder images (using CSS gradients and patterns)
const techPlaceholders = {
  laptop: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  phone: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  computer: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  tablet: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  accessory: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  service: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  repair: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
  installation: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
};

/**
 * Construct full image URL from relative path
 * @param {string} imageUrl - Image URL (can be relative or absolute)
 * @returns {string} Full image URL
 */
export const getFullImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  
  // If it's already a full URL, return as is
  if (imageUrl.startsWith('http') || imageUrl.startsWith('data:')) {
    return imageUrl;
  }
  
  // If it's a storage path, prepend base URL
  if (imageUrl.startsWith('/storage/') || imageUrl.startsWith('/')) {
    return `${BASE_URL}${imageUrl}`;
  }
  
  // For other relative paths, assume they're in storage
  return `${BASE_URL}/storage/${imageUrl}`;
};

/**
 * Get a product image URL with fallback
 * @param {Object} product - Product object
 * @param {string} product.image_url - Uploaded image URL
 * @param {string} product.nom - Product name for category detection
 * @param {number} index - Index for cycling through sample images
 * @returns {string} Image URL or CSS background
 */
export const getProductImage = (product, index = 0) => {
  // If product has uploaded image, use it with proper URL construction
  if (product?.image_url) {
    return getFullImageUrl(product.image_url);
  }

  // If we have sample images, cycle through them
  if (productImages.length > 0) {
    const imageIndex = index % productImages.length;
    return productImages[imageIndex];
  }

  // Fallback to tech-themed gradients based on product name
  const productName = product?.nom?.toLowerCase() || '';
  
  if (productName.includes('laptop') || productName.includes('ordinateur portable')) {
    return techPlaceholders.laptop;
  } else if (productName.includes('phone') || productName.includes('téléphone') || productName.includes('mobile')) {
    return techPlaceholders.phone;
  } else if (productName.includes('computer') || productName.includes('ordinateur') || productName.includes('pc')) {
    return techPlaceholders.computer;
  } else if (productName.includes('tablet') || productName.includes('tablette') || productName.includes('ipad')) {
    return techPlaceholders.tablet;
  } else {
    return techPlaceholders.accessory;
  }
};

/**
 * Get a service image URL with fallback
 * @param {Object} service - Service object
 * @param {string} service.image_url - Uploaded image URL
 * @param {string} service.nom - Service name for category detection
 * @param {number} index - Index for cycling through sample images
 * @returns {string} Image URL or CSS background
 */
export const getServiceImage = (service, index = 0) => {
  // If service has uploaded image, use it with proper URL construction
  if (service?.image_url) {
    return getFullImageUrl(service.image_url);
  }

  // If we have sample images, cycle through them
  if (serviceImages.length > 0) {
    const imageIndex = index % serviceImages.length;
    return serviceImages[imageIndex];
  }

  // Fallback to tech-themed gradients based on service name
  const serviceName = service?.nom?.toLowerCase() || '';
  
  if (serviceName.includes('réparation') || serviceName.includes('repair')) {
    return techPlaceholders.repair;
  } else if (serviceName.includes('installation') || serviceName.includes('install')) {
    return techPlaceholders.installation;
  } else {
    return techPlaceholders.service;
  }
};

/**
 * Get background image for hero sections
 * @returns {string} Background image URL
 */
export const getBackgroundImage = () => {
  return backgroundImg;
};

/**
 * Get logo image
 * @returns {string} Logo image URL
 */
export const getLogoImage = () => {
  return logoImg;
};

/**
 * Create a CSS background style object
 * @param {string} imageUrl - Image URL or gradient
 * @param {Object} options - Additional options
 * @returns {Object} CSS style object
 */
export const createBackgroundStyle = (imageUrl, options = {}) => {
  const {
    size = 'cover',
    position = 'center',
    repeat = 'no-repeat',
    overlay = 'rgba(0,0,0,0.3)'
  } = options;

  // Check if it's a gradient or URL
  const isGradient = imageUrl.includes('gradient');
  const isUrl = imageUrl.startsWith('http') || imageUrl.startsWith('/') || imageUrl.startsWith('data:') || imageUrl.startsWith('/storage/');

  let backgroundImage;
  if (isGradient) {
    backgroundImage = overlay ? `${overlay}, ${imageUrl}` : imageUrl;
  } else if (isUrl) {
  // Handle storage URLs by prepending base URL
  let finalUrl = getFullImageUrl(imageUrl);
  backgroundImage = overlay ? `${overlay}, url("${finalUrl}")` : `url("${finalUrl}")`;
  } else {
    // Fallback gradient
    backgroundImage = overlay ? `${overlay}, ${techPlaceholders.accessory}` : techPlaceholders.accessory;
  }

  return {
    backgroundImage,
    backgroundSize: size,
    backgroundPosition: position,
    backgroundRepeat: repeat,
  };
};

/**
 * Get a random tech-themed gradient
 * @returns {string} CSS gradient
 */
export const getRandomTechGradient = () => {
  const gradients = Object.values(techPlaceholders);
  const randomIndex = Math.floor(Math.random() * gradients.length);
  return gradients[randomIndex];
};

export default {
  getProductImage,
  getServiceImage,
  getBackgroundImage,
  getLogoImage,
  createBackgroundStyle,
  getRandomTechGradient,
};
