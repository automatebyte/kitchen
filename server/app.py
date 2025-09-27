#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request
from flask_restful import Resource

# Local imports
import os
from config import app, db
from routes.user_routes import user_bp
from routes.order_routes import order_bp
from routes.menu_routes import menu_bp
from routes.category_routes import category_bp
from routes.admin_routes import admin_bp
from routes.auth_routes import auth_bp

app.register_blueprint(user_bp)
app.register_blueprint(order_bp)
app.register_blueprint(menu_bp)
app.register_blueprint(category_bp)
app.register_blueprint(admin_bp)
app.register_blueprint(auth_bp)

@app.route('/')
def index():
    return '<h1>Quick Bite API</h1>'

@app.route('/init-db')
def init_db():
    try:
        db.create_all()
        return 'Database initialized successfully!'
    except Exception as e:
        return f'Error: {str(e)}'

@app.route('/reset-db')
def reset_db():
    try:
        db.drop_all()
        db.create_all()
        return seed_db()
    except Exception as e:
        return f'Reset Error: {str(e)}'

@app.route('/seed-db')
def seed_db():
    try:
        from models import User, Category, MenuItem
        
        # Clear existing data
        MenuItem.query.delete()
        Category.query.delete()
        User.query.delete()
        
        # Create admin user
        admin = User(username='admin', email='admin@mvulecatering.com', is_admin=True)
        admin.set_password('admin123')
        db.session.add(admin)
        
        # Create sample user
        user = User(username='john_doe', email='john@example.com', is_admin=False)
        user.set_password('password123')
        db.session.add(user)
        
        # Create categories
        categories = [
            Category(name="Wings", description="Mouth tantalizing chicken wings"),
            Category(name="Burgers", description="Succulent beef burgers"),
            Category(name="Fries", description="Crispy combo fries")
        ]
        for cat in categories:
            db.session.add(cat)
        
        db.session.commit()
        
        # Create menu items
        menu_items = [
            MenuItem(name="Chicken Wings", description="6pc wings with fries", price=6.50, category_id=1, available=True),
            MenuItem(name="Beef Burger", description="Grilled beef burger with slaw", price=6.00, category_id=2, available=True),
            MenuItem(name="Combo Fries", description="Fries with minced beef topping", price=6.50, category_id=3, available=True)
        ]
        for item in menu_items:
            db.session.add(item)
        
        db.session.commit()
        return 'Database seeded successfully!'
    except Exception as e:
        return f'Seed Error: {str(e)}'

# Auto-seed database on startup
with app.app_context():
    db.create_all()
    from models import User, Category, MenuItem
    
    # Check if database is empty and seed it
    if not User.query.first():
        # Create admin user
        admin = User(username='admin', email='admin@mvulecatering.com', is_admin=True)
        admin.set_password('admin123')
        db.session.add(admin)
        
        # Create sample user
        user = User(username='john_doe', email='john@example.com', is_admin=False)
        user.set_password('password123')
        db.session.add(user)
        
        # Create categories
        categories = [
            Category(name="Wings", description="Mouth tantalizing chicken wings"),
            Category(name="Burgers", description="Succulent beef burgers"),
            Category(name="Fries", description="Crispy combo fries")
        ]
        for cat in categories:
            db.session.add(cat)
        
        db.session.commit()
        
        # Create menu items
        menu_items = [
            MenuItem(name="Chicken Wings", description="6pc wings with fries", price=6.50, category_id=1, available=True),
            MenuItem(name="Beef Burger", description="Grilled beef burger with slaw", price=6.00, category_id=2, available=True),
            MenuItem(name="Combo Fries", description="Fries with minced beef topping", price=6.50, category_id=3, available=True)
        ]
        for item in menu_items:
            db.session.add(item)
        
        db.session.commit()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

