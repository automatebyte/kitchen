#!/usr/bin/env python3

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os

# Create Flask app
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///simple_app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize extensions
db = SQLAlchemy(app)
CORS(app)

# Models
class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    orders = db.relationship('Order', backref='user', lazy=True)

    def to_dict(self):
        return {'id': self.id, 'username': self.username, 'email': self.email}

class Order(db.Model):
    __tablename__ = 'orders'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    total_amount = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), default='pending')
    items = db.relationship('OrderItem', backref='order', lazy=True)

    def to_dict(self):
        return {
            'id': self.id, 'user_id': self.user_id, 'total_amount': self.total_amount,
            'status': self.status, 'items': [item.to_dict() for item in self.items]
        }

class OrderItem(db.Model):
    __tablename__ = 'order_items'
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    menu_item_id = db.Column(db.Integer, db.ForeignKey('menu_items.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Float, nullable=False)
    menu_item = db.relationship('MenuItem', backref='order_items')

    def to_dict(self):
        return {
            'id': self.id, 'menu_item_id': self.menu_item_id, 'quantity': self.quantity,
            'price': self.price, 'menu_item': self.menu_item.to_dict() if self.menu_item else None
        }

class Category(db.Model):
    __tablename__ = 'categories'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    description = db.Column(db.Text)
    menu_items = db.relationship('MenuItem', backref='category', lazy=True)

    def to_dict(self):
        return {'id': self.id, 'name': self.name, 'description': self.description}

class MenuItem(db.Model):
    __tablename__ = 'menu_items'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Float, nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)
    available = db.Column(db.Boolean, default=True)
    image_url = db.Column(db.String(255))

    def to_dict(self):
        return {
            'id': self.id, 'name': self.name, 'description': self.description,
            'price': self.price, 'category_id': self.category_id, 'available': self.available,
            'image_url': self.image_url, 'category': {'name': self.category.name} if self.category else None
        }

# Routes
@app.route('/')
def index():
    return '<h1>Mvule Catering Kitchen Hub API</h1>'

@app.route('/api/menu/', methods=['GET'])
def get_menu_items():
    items = MenuItem.query.all()
    return jsonify([item.to_dict() for item in items])

@app.route('/api/menu/', methods=['POST'])
def create_menu_item():
    data = request.get_json()
    item = MenuItem(
        name=data['name'], description=data['description'], price=data['price'],
        category_id=data['category_id'], image_url=data.get('image_url')
    )
    db.session.add(item)
    db.session.commit()
    return jsonify(item.to_dict()), 201

@app.route('/api/menu/<int:id>', methods=['PUT'])
def update_menu_item(id):
    item = MenuItem.query.get_or_404(id)
    data = request.get_json()
    item.name = data['name']
    item.description = data['description']
    item.price = data['price']
    item.category_id = data['category_id']
    item.image_url = data.get('image_url')
    db.session.commit()
    return jsonify(item.to_dict())

@app.route('/api/menu/<int:id>', methods=['DELETE'])
def delete_menu_item(id):
    item = MenuItem.query.get_or_404(id)
    db.session.delete(item)
    db.session.commit()
    return '', 204

@app.route('/api/categories/', methods=['GET'])
def get_categories():
    categories = Category.query.all()
    return jsonify([cat.to_dict() for cat in categories])

@app.route('/api/categories/', methods=['POST'])
def create_category():
    data = request.get_json()
    category = Category(name=data['name'], description=data.get('description'))
    db.session.add(category)
    db.session.commit()
    return jsonify(category.to_dict()), 201

@app.route('/api/categories/<int:id>', methods=['PUT'])
def update_category(id):
    category = Category.query.get_or_404(id)
    data = request.get_json()
    category.name = data['name']
    category.description = data.get('description')
    db.session.commit()
    return jsonify(category.to_dict())

@app.route('/api/categories/<int:id>', methods=['DELETE'])
def delete_category(id):
    category = Category.query.get_or_404(id)
    db.session.delete(category)
    db.session.commit()
    return '', 204

# Initialize database and seed data
def init_db():
    with app.app_context():
        db.create_all()
        
        # Check if data already exists
        if Category.query.count() > 0:
            return
            
        # Create categories
        categories = [
            Category(name="Wings", description="Mouth tantalizing chicken wings with various flavors"),
            Category(name="Wraps", description="Delicious wraps with fresh ingredients"),
            Category(name="Burgers", description="Succulent beef burgers grilled to perfection"),
            Category(name="Fries", description="Crispy combo fries with amazing toppings"),
            Category(name="Small Bites", description="Perfect appetizers and snacks"),
            Category(name="Ribs", description="Off the bone beef ribs served with fries")
        ]
        
        for category in categories:
            db.session.add(category)
        db.session.commit()
        
        # Create menu items
        menu_items = [
            MenuItem(name="Mouth Tantalizing Chicken Wings", description="Served with fries | 6pc", price=6.50, category_id=1, image_url="https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=300&fit=crop"),
            MenuItem(name="Duo Wings", description="2 Flavours | 12pc", price=12.50, category_id=1, image_url="https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400&h=300&fit=crop"),
            MenuItem(name="Trio Wings", description="3 Flavours | 18pc", price=18.50, category_id=1, image_url="https://images.unsplash.com/photo-1608039755401-742074f0548d?w=400&h=300&fit=crop"),
            MenuItem(name="Ronikkies Chicken Wrap", description="Homemade tortilla, shredded chicken, bbq sauce or hot sauce, coleslaw, pickled cucumbers", price=4.50, category_id=2, image_url="https://images.unsplash.com/photo-1565299585323-38174c4a6471?w=400&h=300&fit=crop"),
            MenuItem(name="Big Mac Wrap", description="Homemade tortilla, ground beef, special sauce, lettuce, caramelized onions, pickled cucumber", price=4.50, category_id=2, image_url="https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=300&fit=crop"),
            MenuItem(name="Mvule Smash Burger", description="Succulent beef burgers grilled to perfection with slaw and a choice of our amazing sauces", price=6.00, category_id=3, image_url="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop"),
            MenuItem(name="Mvule Combo Fries", description="Enjoy a tasty combo of crinkle fries topped with minced beef or chicken, creamy sauce, and BBQ sauce", price=6.50, category_id=4, image_url="https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop"),
            MenuItem(name="Beef Samosas", description="Crispy pastry filled with spiced beef", price=0.50, category_id=5, image_url="https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop"),
            MenuItem(name="Chicken Samosas", description="Crispy pastry filled with seasoned chicken", price=0.60, category_id=5, image_url="https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop"),
            MenuItem(name="Chips", description="Crispy golden chips", price=1.50, category_id=5, image_url="https://images.unsplash.com/photo-1518013431117-eb1465fa5752?w=400&h=300&fit=crop"),
            MenuItem(name="Masala Chips", description="Spiced chips with masala seasoning", price=2.00, category_id=5, image_url="https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=400&h=300&fit=crop"),
            MenuItem(name="Mvule Beef Ribs", description="Off the bone beef ribs served with fries. Choice of sauces: Caramelized Onions, BBQ Sauce, or Secret Hot Sauce", price=8.50, category_id=6, image_url="https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop")
        ]
        
        for item in menu_items:
            db.session.add(item)
        db.session.commit()
        print("✅ Database initialized with Mvule Catering menu!")

if __name__ == '__main__':
    init_db()
    print("🚀 Starting Mvule Catering Kitchen Hub...")
    app.run(port=5000, debug=True)