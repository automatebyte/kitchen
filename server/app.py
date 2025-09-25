#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request
from flask_restful import Resource

# Local imports
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
    return '<h1>Kitchen Hub API</h1>'

if __name__ == '__main__':
    app.run(port=5000, debug=True)

