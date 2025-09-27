from flask import Blueprint, request, jsonify
from models import Category, User, db

category_bp = Blueprint('categories', __name__, url_prefix='/api/categories')

def check_admin(user_id):
    if not user_id:
        return False
    user = User.query.get(user_id)
    return user and user.is_admin

# Public route - no authentication required
@category_bp.route('/', methods=['GET'])
def get_categories():
    categories = Category.query.all()
    return jsonify([cat.to_dict() for cat in categories])

# Admin only routes
@category_bp.route('/', methods=['POST'])
def create_category():
    data = request.get_json()
    user_id = data.get('user_id')
    if not check_admin(user_id):
        return jsonify({'error': 'Admin access required'}), 403
    
    category = Category(
        name=data['name'],
        description=data.get('description')
    )
    db.session.add(category)
    db.session.commit()
    return jsonify(category.to_dict()), 201

@category_bp.route('/<int:id>', methods=['PUT'])
def update_category(id):
    data = request.get_json()
    user_id = data.get('user_id')
    if not check_admin(user_id):
        return jsonify({'error': 'Admin access required'}), 403
    
    category = Category.query.get_or_404(id)
    category.name = data.get('name', category.name)
    category.description = data.get('description', category.description)
    
    db.session.commit()
    return jsonify(category.to_dict())

@category_bp.route('/<int:id>', methods=['DELETE'])
def delete_category(id):
    data = request.get_json()
    user_id = data.get('user_id')
    if not check_admin(user_id):
        return jsonify({'error': 'Admin access required'}), 403
    
    category = Category.query.get_or_404(id)
    # Check if category has menu items
    if category.menu_items:
        return jsonify({'error': 'Cannot delete category with existing menu items'}), 400
    
    db.session.delete(category)
    db.session.commit()
    return '', 204