# Quick Bite Restaurant Management System

A full-stack restaurant management application built with Flask and React, featuring public menu browsing, user cart functionality, and comprehensive admin management tools.

## Live Demo

**Application URL:** https://kitchen-1-estc.onrender.com
**Backend API URL:** https://kitchen-4tp1.onrender.com

**Admin Credentials:**
- Username: `admin`
- Password: `admin123`

**Test User Credentials:**
- Username: `john_doe`
- Password: `password123`

## Features

### Public Access
- Browse menu items without authentication
- Search and filter menu items by category
- View detailed item descriptions and pricing
- Responsive design for all devices

### User Features
- User registration and secure login
- Add items to shopping cart (authentication required)
- Manage cart quantities and remove items
- Place orders and view order history
- Real-time cart counter in navigation

### Admin Features
- Comprehensive admin dashboard with statistics
- Menu item management (create, edit, delete)
- Category management with validation
- Order status management and tracking
- User management and monitoring
- Real-time order approval/rejection system

## Technology Stack

### Backend
- **Flask** - Python web framework
- **SQLAlchemy** - Database ORM
- **Flask-RESTful** - REST API development
- **Flask-CORS** - Cross-origin resource sharing
- **Flask-Migrate** - Database migrations
- **SQLite** - Database (production ready)
- **Formik & Yup** - Form validation

### Frontend
- **React** - JavaScript library for UI
- **React Router** - Client-side routing
- **Context API** - State management
- **Fetch API** - HTTP client
- **CSS3** - Styling with green/white theme

## Project Structure

```
kitchen/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   │   ├── Admin/      # Admin dashboard components
│   │   │   ├── Auth/       # Authentication components
│   │   │   ├── Menu/       # Menu display components
│   │   │   ├── Orders/     # Cart and order components
│   │   │   └── Navigation/ # Navigation components
│   │   ├── pages/         # Page-level components
│   │   ├── services/      # API service functions
│   │   ├── context/       # React context providers
│   │   └── index.css      # Global styles
│   └── package.json       # Frontend dependencies
├── server/                # Flask backend application
│   ├── routes/           # API route handlers
│   │   ├── admin_routes.py    # Admin management routes
│   │   ├── auth_routes.py     # Authentication routes
│   │   ├── menu_routes.py     # Menu item routes
│   │   ├── category_routes.py # Category routes
│   │   └── order_routes.py    # Order and cart routes
│   ├── models.py         # Database models
│   ├── config.py         # Flask configuration
│   ├── app.py           # Main Flask application
│   └── seed.py          # Database seeding script
└── README.md            # Project documentation
```

## Database Schema

### Models
- **User** - User accounts with admin privileges
- **Category** - Food categories (Wings, Burgers, etc.)
- **MenuItem** - Individual menu items with pricing
- **Cart** - User shopping cart items
- **Order** - Customer orders
- **OrderItem** - Individual items within orders

### Relationships
- Users have many Orders and Cart items
- Categories have many MenuItems
- Orders have many OrderItems (many-to-many via OrderItem)
- MenuItems belong to Categories

## API Endpoints

### Public Endpoints
```
GET  /api/menu/           # Get all available menu items
GET  /api/categories/     # Get all categories
```

### Authentication Endpoints
```
POST /api/auth/login      # User login
POST /api/auth/register   # User registration
GET  /api/auth/me         # Get current user
```

### User Endpoints (Authentication Required)
```
GET  /api/orders/cart/{user_id}  # Get user cart
POST /api/orders/cart            # Add item to cart
PATCH /api/orders/cart/{id}      # Update cart quantity
DELETE /api/orders/cart/{id}     # Remove from cart
POST /api/orders/                # Create order
GET  /api/orders/                # Get user orders
```

### Admin Endpoints (Admin Authentication Required)
```
GET  /api/admin/dashboard        # Dashboard statistics
GET  /api/admin/users           # Get all users
POST /api/admin/menu-items      # Create menu item
PATCH /api/admin/menu-items/{id} # Update menu item
DELETE /api/admin/menu-items/{id} # Delete menu item
POST /api/admin/categories      # Create category
PATCH /api/admin/categories/{id} # Update category
DELETE /api/admin/categories/{id} # Delete category
PATCH /api/admin/orders/{id}/status # Update order status
```

## Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 14+
- Git

### Backend Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd kitchen
   ```

2. **Set up Python environment:**
   ```bash
   cd server
   pipenv install
   pipenv shell
   ```

3. **Initialize database:**
   ```bash
   flask db init
   flask db upgrade head
   python seed.py
   ```

4. **Run the server:**
   ```bash
   python app.py
   ```
   Server runs on `http://localhost:5000`

### Frontend Setup

1. **Install dependencies:**
   ```bash
   cd client
   npm install
   ```

2. **Start development server:**
   ```bash
   npm start
   ```
   Client runs on `http://localhost:3000`

## Form Validation

The application uses Formik with Yup validation schemas:

- **Login Form:** Username (3+ chars), Password (6+ chars)
- **Registration Form:** Email format validation, Password strength requirements
- **Admin Forms:** Comprehensive validation for menu items and categories
- **Real-time validation** with error messages
- **Data type validation** for numbers, emails, URLs

## Security Features

- JWT-based authentication system
- Admin-only route protection
- Input validation and sanitization
- CORS configuration for cross-origin requests
- Secure password handling
- Protected admin operations

## Deployment

The application is deployed on Render with:
- Automatic deployments from GitHub
- Environment variable configuration
- Production database setup
- Static file serving

## Development Notes

- Menu items are publicly accessible without authentication
- Cart operations require user login
- Admin operations require admin privileges
- All CRUD operations include proper error handling
- Responsive design works on mobile and desktop
- Green and white theme throughout the application

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.