from flask import Blueprint, request, jsonify
from models import User, db

user_bp = Blueprint('users', __name__, url_prefix='/api/users')

@user_bp.route('/', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([user.to_dict() for user in users])

@user_bp.route('/', methods=['POST'])
def create_user():
    data = request.get_json()
    user = User(
        username=data['username'],
        email=data['email'],
        password_hash=data['password']  # Hash this in production
    )
    db.session.add(user)
    db.session.commit()
    return jsonify(user.to_dict()), 201