# USAHOME Frontend - Professional React Application

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── common/          # Common components (Loading, ErrorMessage, etc.)
│   ├── layout/          # Layout components (Header, Layout, etc.)
│   ├── forms/           # Form components (ProductForm, ServiceForm, etc.)
│   └── cards/           # Card components (ProductCard, ServiceCard, etc.)
├── pages/               # Page components
│   ├── public/          # Public pages (Home, Products, Services)
│   └── admin/           # Admin pages (ProductsAdmin, ServicesAdmin)
├── services/            # API service layer
├── hooks/               # Custom React hooks
├── utils/               # Utility functions
├── styles/              # Global styles and CSS utilities
└── assets/              # Static assets (images, icons, etc.)
```

## 🚀 Features

### Public Pages
- **Home** (`/`) - Landing page with hero section, contact form, featured products and services
- **Products** (`/products`) - Product catalog with search and filtering
- **Services** (`/services`) - Service catalog with search and filtering
- **Contact** (`/contact`) - Contact form and information

### Admin Pages
- **Products Admin** (`/admin/products`) - Full CRUD operations for products
- **Services Admin** (`/admin/services`) - Full CRUD operations for services

### Components Architecture

#### Layout Components
- `Header` - Navigation header with responsive design
- `Layout` - Main layout wrapper with header integration

#### Card Components
- `ProductCard` - Reusable product display card with actions
- `ServiceCard` - Reusable service display card with actions

#### Form Components
- `ProductForm` - Product creation/editing form with validation
- `ServiceForm` - Service creation/editing form with validation

#### Common Components
- `Loading` - Loading spinner with different sizes
- `ErrorMessage` - Error display with retry functionality

### Custom Hooks
- `useProducts` - Product data management with CRUD operations
- `useServices` - Service data management with CRUD operations
- `useProductCategories` - Product categories data
- `useServiceTypes` - Service types data

### API Service Layer
- `api.js` - Base API service with common HTTP methods
- `productService.js` - Product-specific API calls
- `serviceService.js` - Service-specific API calls

## 🎨 Styling

### Global Styles
- Utility classes for common styling patterns
- Responsive design utilities
- Color and spacing system
- Typography system

### Component Styles
- Modular CSS files for each component
- Consistent design system
- Mobile-first responsive design

## 🔧 Development

### Available Scripts
```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
npm run eject      # Eject from Create React App
```

### API Integration
The application connects to a Laravel backend API running on `http://127.0.0.1:8000/api`

### Environment Setup
1. Install dependencies: `npm install`
2. Start the development server: `npm start`
3. Ensure the Laravel backend is running on port 8000

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🔐 Admin Features

### Product Management
- Create, read, update, delete products
- Image upload functionality
- Category management
- Price and description editing

### Service Management
- Create, read, update, delete services
- Image upload functionality
- Service type management
- Pricing (fixed or quote-based)

## 🎯 Key Features

### Professional UI/UX
- Modern, clean design
- Intuitive navigation
- Loading states and error handling
- Form validation
- Image upload with preview

### Performance
- Optimized API calls
- Debounced search functionality
- Lazy loading where appropriate
- Efficient state management

### Accessibility
- Semantic HTML structure
- Keyboard navigation support
- Screen reader friendly
- ARIA labels and roles

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment Variables
Create a `.env` file for environment-specific configurations:
```
REACT_APP_API_URL=http://your-api-url.com/api
```

## 📝 Code Quality

### ESLint Configuration
- React best practices
- Accessibility rules
- Import/export validation
- Unused variable detection

### File Organization
- Logical folder structure
- Consistent naming conventions
- Separation of concerns
- Reusable components

## 🔄 State Management

### Custom Hooks Pattern
- Centralized data fetching logic
- Error handling
- Loading states
- CRUD operations

### Local State
- Form state management
- UI state (modals, filters)
- Component-specific state

## 📚 Documentation

Each component and hook includes:
- JSDoc comments
- PropTypes (where applicable)
- Usage examples
- Error handling documentation

## 🐛 Error Handling

### Global Error Boundaries
- Graceful error recovery
- User-friendly error messages
- Retry functionality
- Fallback UI components

### API Error Handling
- Network error handling
- HTTP status code handling
- User feedback for errors
- Automatic retry for failed requests

## 🔧 Utilities

### Helper Functions
- Price formatting
- Date formatting
- Text truncation
- File validation
- Local storage management

### Custom Utilities
- Debounce function
- Slug generation
- Email validation
- Image URL handling
