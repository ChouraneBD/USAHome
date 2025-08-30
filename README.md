# USAHome - Full Stack Application

A comprehensive full-stack application built with React frontend and Laravel backend for managing products and services.

## 🏗️ Project Structure

```
usahome/
├── backend-new/          # Laravel Backend API
│   ├── app/              # Application logic
│   ├── bootstrap/        # Framework bootstrapping
│   ├── config/           # Configuration files
│   ├── database/         # Database migrations and seeders
│   ├── public/           # Public assets
│   ├── resources/        # Views and assets
│   ├── routes/           # API routes
│   └── storage/          # Storage for files, cache, etc.
├── frontend/             # React Frontend
│   ├── src/              # Source code
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API service layer
│   │   ├── hooks/        # Custom React hooks
│   │   └── utils/        # Utility functions
│   └── public/           # Public assets
└── backend/              # Legacy backend (optional)
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher)
- **PHP** (v8.2 or higher)
- **Composer** (for PHP dependencies)
- **SQLite** (or MySQL/PostgreSQL)

### 1. Clone the Repository

```bash
git clone https://github.com/ChouraneBD/USAHome.git
cd USAHome
```

### 2. Backend Setup (Laravel)

```bash
# Navigate to backend directory
cd backend-new

# Install PHP dependencies
composer install

# Create environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Create database file (if using SQLite)
touch database/database.sqlite

# Run database migrations
php artisan migrate

# Seed the database with sample data
php artisan db:seed

# Start the development server
php artisan serve
```

The backend API will be available at: `http://127.0.0.1:8000`

### 3. Frontend Setup (React)

```bash
# Navigate to frontend directory
cd frontend

# Install Node.js dependencies
npm install

# Start the development server
npm start
```

The frontend application will be available at: `http://localhost:3000`

## 📋 Available Commands

### Backend Commands (Laravel)

```bash
# Run development server
php artisan serve

# Run migrations
php artisan migrate

# Run migrations with seeders
php artisan migrate --seed

# Run specific seeder
php artisan db:seed --class=DatabaseSeeder

# Clear cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Generate application key
php artisan key:generate

# Create migration
php artisan make:migration create_table_name

# Create model
php artisan make:model ModelName

# Create controller
php artisan make:controller ControllerName

# Run tests
php artisan test
```

### Frontend Commands (React)

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Eject from Create React App (irreversible)
npm run eject
```

## 🔧 Configuration

### Backend Environment (.env)

Create a `.env` file in the `backend-new` directory with the following configuration:

```env
APP_NAME=USAHome
APP_ENV=local
APP_KEY=your_generated_key
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=sqlite
DB_DATABASE=/path/to/database.sqlite

# For MySQL/PostgreSQL:
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=usahome
# DB_USERNAME=root
# DB_PASSWORD=

CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### Frontend Configuration

The frontend is configured to connect to the backend API at `http://127.0.0.1:8000/api`. This can be modified in `frontend/src/config.js` if needed.

## 📊 Database Structure

The application includes the following database tables:
- `users` - User authentication
- `categorie_produits` - Product categories
- `produits` - Products
- `type_services` - Service types
- `services` - Services

## 🎯 Features

### Backend Features
- RESTful API endpoints
- Database migrations and seeders
- CORS configuration for frontend integration
- Authentication system
- CRUD operations for products and services

### Frontend Features
- Responsive React application
- Product catalog with search and filtering
- Service catalog with search and filtering
- Admin panel for CRUD operations
- Contact form functionality
- Modern UI/UX design

## 🚀 Deployment

### Backend Deployment

1. **Set production environment:**
```bash
cp .env.example .env
# Update .env with production values
APP_ENV=production
APP_DEBUG=false
```

2. **Optimize for production:**
```bash
composer install --optimize-autoloader --no-dev
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Frontend Deployment

1. **Build for production:**
```bash
npm run build
```

2. **Deploy the `build` folder to your web server**

## 🔐 API Endpoints

The backend provides the following API endpoints:

- `GET /api/products` - Get all products
- `POST /api/products` - Create a new product
- `GET /api/products/{id}` - Get a specific product
- `PUT /api/products/{id}` - Update a product
- `DELETE /api/products/{id}` - Delete a product

- `GET /api/services` - Get all services
- `POST /api/services` - Create a new service
- `GET /api/services/{id}` - Get a specific service
- `PUT /api/services/{id}` - Update a service
- `DELETE /api/services/{id}` - Delete a service

## 📝 Git Commands for Pushing to Repository

### 1. Initialize Git (if not already initialized)
```bash
git init
```

### 2. Add Remote Repository
```bash
git remote add origin https://github.com/ChouraneBD/USAHome.git
```

### 3. Add All Files to Staging
```bash
git add .
```

### 4. Commit Changes
```bash
git commit -m "Initial commit: USAHome full-stack application"
```

### 5. Push to Main Branch
```bash
git branch -M main
git push -u origin main
```

### 6. For Subsequent Updates
```bash
git add .
git commit -m "Your commit message"
git push origin main
```

## 🛠️ Troubleshooting

### Common Issues

1. **Port already in use:**
   ```bash
   # Kill process on port 8000
   npx kill-port 8000
   # Or specify different port
   php artisan serve --port=8080
   ```

2. **Database connection issues:**
   - Ensure SQLite is installed or MySQL server is running
   - Check database file permissions for SQLite

3. **CORS issues:**
   - Ensure CORS is configured in `backend-new/config/cors.php`
   - Check that frontend URL is allowed

4. **Composer issues:**
   ```bash
   composer dump-autoload
   ```

## 📚 Additional Resources

- [Laravel Documentation](https://laravel.com/docs)
- [React Documentation](https://reactjs.org/docs)
- [SQLite Documentation](https://www.sqlite.org/docs.html)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- **ChouraneBD** - Initial work

---

**Note:** Make sure both backend and frontend servers are running simultaneously for the full application to work properly.
