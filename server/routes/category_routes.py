from flask import Blueprint, request, jsonify
from models import Category, db

category_bp = Blueprint('categories', __name__, url_prefix='/api/categories')

@category_bp.route('/', methods=['GET'])
def get_categories():
    categories = Category.query.all()
    return jsonify([cat.to_dict() for cat in categories])

@category_bp.route('/', methods=['POST'])
def create_category():
    data = request.get_json()
    category = Category(
        name=data['name'],
        description=data.get('description')
    )
    db.session.add(category)
    db.session.commit()
    return jsonify({'id': category.id, 'name': category.name}), 201

@category_bp.route('/<int:id>', methods=['PUT'])
def update_category(id):
    category = Category.query.get_or_404(id)
    data = request.get_json()
    
    category.name = data['name']
    category.description = data.get('description')
    
    db.session.commit()
    return jsonify({'id': category.id, 'name': category.name})

@category_bp.route('/<int:id>', methods=['DELETE'])
def delete_category(id):
    category = Category.query.get_or_404(id)
    db.session.delete(category)
    db.session.commit()
    return '', 204