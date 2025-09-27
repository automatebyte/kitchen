# Quick Bite Restaurant Management System

A full-stack restaurant management system with public menu access, user cart functionality, and comprehensive admin management.

## Features

### Public Access
- **Public Menu Viewing**: Anyone can browse the menu without authentication
- **Category Filtering**: Filter menu items by categories
- **Search Functionality**: Search menu items by name or description

### User Features
- **User Registration & Login**: Secure authentication system
- **Shopping Cart**: Add items to cart (requires login)
- **Order Management**: Place and track orders
- **Order History**: View past orders

### Admin Features
- **Admin Dashboard**: Comprehensive overview with statistics
- **Menu Management**: Add, edit, delete menu items
- **Category Management**: Manage food categories
- **Order Management**: Update order status, approve/reject orders
- **User Management**: View all registered users

## Setup Instructions

### Backend Setup

1. **Navigate to server directory**:
   ```bash
   cd server
   ```

2. **Install dependencies**:
   ```bash
   pipenv install
   pipenv shell
   ```

3. **Initialize database**:
   ```bash
   flask db init
   flask db upgrade head
   ```

4. **Seed the database**:
   ```bash
   python seed.py
   ```

5. **Run the server**:
   ```bash
   python app.py
   ```

   Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to client directory**:
   ```bash
   cd client
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```

   Client will run on `http://localhost:3000`

## Default Admin Account

After seeding the database, you can login with:
- **Username**: `admin`
- **Password**: `admin123`

## API Endpoints

### Public Endpoints (No Authentication Required)
- `GET /api/menu/` - Get all available menu items
- `GET /api/categories/` - Get all categories

### User Endpoints (Authentication Required)
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/orders/cart/{user_id}` - Get user's cart
- `POST /api/orders/cart` - Add item to cart
- `POST /api/orders/` - Create order from cart

### Admin Endpoints (Admin Authentication Required)
- `GET /api/admin/dashboard` - Admin dashboard stats
- `GET /api/admin/users` - Get all users
- `POST /api/admin/menu-items` - Create menu item
- `PATCH /api/admin/menu-items/{id}` - Update menu item
- `DELETE /api/admin/menu-items/{id}` - Delete menu item
- `POST /api/admin/categories` - Create category
- `PATCH /api/admin/categories/{id}` - Update category
- `DELETE /api/admin/categories/{id}` - Delete category
- `PATCH /api/admin/orders/{id}/status` - Update order status

## Project Structure

```
kitchen/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── context/       # React context
├── server/                # Flask backend
│   ├── routes/           # API routes
│   ├── models.py         # Database models
│   ├── app.py           # Flask application
│   └── seed.py          # Database seeding
└── README.md
```

## Technologies Used

### Backend
- Flask (Python web framework)
- SQLAlchemy (ORM)
- Flask-RESTful (REST API)
- Flask-CORS (Cross-origin requests)
- JWT (Authentication)

### Frontend
- React (JavaScript library)
- React Router (Client-side routing)
- Context API (State management)
- CSS3 (Styling)

## Usage

1. **Public Menu Access**: Visit `/menu` to browse available items
2. **User Registration**: Create an account to add items to cart
3. **Shopping**: Add items to cart and place orders
4. **Admin Access**: Login as admin to manage the restaurant

## Security Features

- JWT-based authentication
- Admin-only routes protection
- Input validation
- CORS configuration
- Password hashing (in production)

## Development Notes

- Menu items are publicly accessible for viewing
- Cart operations require user authentication
- Admin operations require admin privileges
- All CRUD operations are properly secured
- Responsive design for mobile and desktop