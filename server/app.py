#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request
from flask_restful import Resource

# Local imports
from config import app, db, api
# Add your model imports
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models import User, Order, OrderItem



# Views go here!

@app.route('/')
def index():
    return '<h1>Project Server</h1>'

# User routes
class Register(Resource):
    def post(self):
        data = request.get_json()
        
        if User.query.filter_by(username=data['username']).first():
            return {'message': 'Username already exists'}, 400
            
        user = User(
            username=data['username'],
            email=data['email'],
            password_hash=generate_password_hash(data['password'])
        )
        
        db.session.add(user)
        db.session.commit()
        
        return {'message': 'User created successfully'}, 201

class Login(Resource):
    def post(self):
        data = request.get_json()
        user = User.query.filter_by(username=data['username']).first()
        
        if user and check_password_hash(user.password_hash, data['password']):
            access_token = create_access_token(identity=user.id)
            return {'access_token': access_token}, 200
            
        return {'message': 'Invalid credentials'}, 401

class Orders(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        orders = Order.query.filter_by(user_id=user_id).all()
        return [order.to_dict() for order in orders], 200
    
    @jwt_required()
    def post(self):
        user_id = get_jwt_identity()
        data = request.get_json()
        
        order = Order(
            user_id=user_id,
            total_amount=data['total_amount'],
            status='pending'
        )
        
        db.session.add(order)
        db.session.commit()
        
        return order.to_dict(), 201

# Register routes
api.add_resource(Register, '/register')
api.add_resource(Login, '/login')
api.add_resource(Orders, '/orders')

if __name__ == '__main__':
    app.run(port=5555, debug=True)

