#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker
from werkzeug.security import generate_password_hash



# Local imports
from app import app
from models import db
from models import User, Order, OrderItem
if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Starting seed...")
        # Seed code goes here!
# Clear existing data
User.query.delete()
Order.query.delete()
OrderItem.query.delete()

# === USER & ORDER SEEDS (Leader's section) ===
user1 = User(
    username='john_doe',
    email='john@example.com',
    password_hash=generate_password_hash('password123')
)

user2 = User(
    username='jane_smith',
    email='jane@example.com',
    password_hash=generate_password_hash('password123')
)

db.session.add_all([user1, user2])
db.session.commit()

order1 = Order(
    user_id=user1.id,
    total_amount=25.99,
    status='completed'
)

db.session.add(order1)
db.session.commit()

print("Users and orders seeded!")

# === MENU & CATEGORY SEEDS (Teammate's section - DO NOT TOUCH) ===
# Teammate will add their seeds here
