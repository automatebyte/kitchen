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

@app.route('/seed-db')
def seed_db():
    try:
        from models import User, Category, MenuItem
        
        # Create categories
        categories = [
            Category(name="Wings", description="Mouth tantalizing chicken wings"),
            Category(name="Burgers", description="Succulent beef burgers"),
            Category(name="Fries", description="Crispy combo fries")
        ]
        
        for category in categories:
            if not Category.query.filter_by(name=category.name).first():
                db.session.add(category)
        
        db.session.commit()
        
        # Create menu items
        menu_items = [
            MenuItem(name="Chicken Wings", description="6pc wings with fries", price=6.50, category_id=1, available=True),
            MenuItem(name="Beef Burger", description="Grilled beef burger with slaw", price=6.00, category_id=2, available=True),
            MenuItem(name="Combo Fries", description="Fries with minced beef topping", price=6.50, category_id=3, available=True)
        ]
        
        for item in menu_items:
            if not MenuItem.query.filter_by(name=item.name).first():
                db.session.add(item)
        
        db.session.commit()
        return 'Database seeded successfully!'
    except Exception as e:
        return f'Seed Error: {str(e)}'

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        # Auto-seed if no users exist
        from models import User
        if not User.query.first():
            import subprocess
            subprocess.run(['python', 'seed.py'])
    app.run(host='0.0.0.0', port=5000, debug=True)

