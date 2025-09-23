from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy

from config import db

# Models go here!
# === USER & ORDER MODELS (Leader's section) ===
class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    
    orders = db.relationship('Order', backref='user', lazy=True)
    
    serialize_rules = ('-password_hash', '-orders.user')

class Order(db.Model, SerializerMixin):
    __tablename__ = 'orders'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    total_amount = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), default='pending')
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    
    order_items = db.relationship('OrderItem', backref='order', lazy=True)
    
    serialize_rules = ('-user.orders', '-order_items.order')

class OrderItem(db.Model, SerializerMixin):
    __tablename__ = 'order_items'
    
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Float, nullable=False)
    
    serialize_rules = ('-order.order_items',)
# === MENU & CATEGORY MODELS ===
class Category(db.Model, SerializerMixin):
    tablename = 'categories'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    description = db.Column(db.Text)

    menu_items = db.relationship('MenuItem', backref='category', lazy=True)

    serialize_rules = ('-menu_items.category',)

class MenuItem(db.Model, SerializerMixin):
    tablename = 'menu_items'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Float, nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)
    available = db.Column(db.Boolean, default=True)

    order_items = db.relationship('OrderItem', backref='menu_item', lazy=True)

    serialize_rules = ('-category.menu_items', '-order_items.menu_item')

