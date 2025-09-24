# 🍽️ Mvule Catering Kitchen Hub

## What is this application?

**Mvule Catering Kitchen Hub** is a full-stack restaurant management system designed for Mvule Catering company. It's a comprehensive digital platform that allows restaurant staff and customers to manage menu items, categories, orders, and user accounts.

## 🎯 Purpose & Features

### **For Restaurant Staff:**
- **Menu Management**: Add, edit, delete menu items with images and descriptions
- **Category Management**: Organize menu items into categories (Wings, Burgers, Wraps, etc.)
- **Order Tracking**: View and manage customer orders
- **User Management**: Handle customer accounts and profiles

### **For Customers:**
- **Browse Menu**: View beautiful menu with food images and detailed descriptions
- **Search & Filter**: Find specific dishes or filter by category
- **Place Orders**: Create orders from available menu items
- **Account Management**: Register, login, and manage profile

## 🏗️ Technical Architecture

### **Backend (Flask/Python)**
- **Framework**: Flask with Flask-RESTful
- **Database**: SQLite with SQLAlchemy ORM
- **API**: RESTful endpoints for CRUD operations
- **Models**: User, Order, OrderItem, Category, MenuItem
- **Authentication**: User registration and login system

### **Frontend (React/JavaScript)**
- **Framework**: React 18 with React Router
- **Styling**: Modern CSS with gradient themes
- **Components**: Modular component architecture
- **State Management**: React hooks (useState, useEffect)
- **API Integration**: Fetch API for backend communication

## 📊 Database Schema

```
Users (id, username, email, password_hash, created_at)
├── Orders (id, user_id, total_amount, status, created_at)
    └── OrderItems (id, order_id, menu_item_id, quantity, price)

Categories (id, name, description)
└── MenuItems (id, name, description, price, category_id, available, image_url)
```

## 🍴 Current Menu Categories

1. **Wings** - Mouth tantalizing chicken wings with various flavors
2. **Wraps** - Delicious wraps with fresh ingredients  
3. **Burgers** - Succulent beef burgers grilled to perfection
4. **Fries** - Crispy combo fries with amazing toppings
5. **Small Bites** - Perfect appetizers and snacks
6. **Ribs** - Off the bone beef ribs served with fries

## 🚀 How to Run the Application

### Prerequisites
- Python 3.8+
- Node.js 14+
- npm or yarn

### Backend Setup
```bash
cd server
pip install flask flask-sqlalchemy flask-migrate flask-cors flask-restful sqlalchemy-serializer faker
flask db upgrade
python seed.py  # Load sample data
python app.py   # Runs on http://localhost:8080
```

### Frontend Setup
```bash
cd client
npm install
npm start       # Runs on http://localhost:3000
```

## 🌐 API Endpoints

### Menu Management
- `GET /api/menu/` - Get all menu items
- `POST /api/menu/` - Create new menu item
- `PUT /api/menu/<id>` - Update menu item
- `DELETE /api/menu/<id>` - Delete menu item

### Category Management
- `GET /api/categories/` - Get all categories
- `POST /api/categories/` - Create new category
- `PUT /api/categories/<id>` - Update category
- `DELETE /api/categories/<id>` - Delete category

### User Management
- `GET /api/users/` - Get all users
- `POST /api/users/` - Create new user

### Order Management
- `GET /api/orders/` - Get all orders
- `POST /api/orders/` - Create new order

## 🎨 Design Features

- **Modern UI**: Orange/amber gradient theme matching Mvule Catering branding
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Food Photography**: High-quality images from Unsplash
- **Professional Footer**: Company information and contact details
- **Search & Filter**: Easy menu navigation
- **CRUD Operations**: Full create, read, update, delete functionality

## 🔧 Key Technologies Used

**Backend:**
- Flask (Web framework)
- SQLAlchemy (ORM)
- Flask-Migrate (Database migrations)
- Flask-CORS (Cross-origin requests)
- SQLAlchemy-Serializer (JSON serialization)

**Frontend:**
- React (UI library)
- React Router (Navigation)
- Modern CSS (Styling)
- Fetch API (HTTP requests)

## 📱 User Experience

1. **Homepage**: Welcome to Mvule Catering with company information
2. **Menu Page**: Browse all menu items with search and category filters
3. **Categories Page**: Manage menu categories (admin feature)
4. **Orders Page**: View and manage orders
5. **Profile Page**: User account management
6. **Authentication**: Login and registration system

## 🎯 Business Value

This application helps Mvule Catering:
- **Digitize Operations**: Move from paper menus to digital management
- **Improve Efficiency**: Staff can quickly update menus and track orders
- **Enhance Customer Experience**: Beautiful, searchable menu interface
- **Scale Business**: Handle more orders with organized digital system
- **Brand Consistency**: Professional online presence matching company branding

## 🚀 Future Enhancements

- Online payment integration
- Real-time order tracking
- Inventory management
- Customer reviews and ratings
- Mobile app version
- Analytics dashboard
- Email notifications
- Multi-location support

---

**Mvule Catering Kitchen Hub** - Bringing digital excellence to culinary experiences! 🍽️✨