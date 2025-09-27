from flask import Blueprint, request, jsonify
from models import MenuItem, Category, User, db

menu_bp = Blueprint('menu', __name__, url_prefix='/api/menu')

def check_admin(user_id):
    if not user_id:
        return False
    user = User.query.get(user_id)
    return user and user.is_admin

# Public route - no authentication required
@menu_bp.route('/', methods=['GET'])
def get_menu_items():
    try:
        items = MenuItem.query.filter_by(available=True).all()
        return jsonify([item.to_dict() for item in items])
    except Exception as e:
        return jsonify({'error': str(e), 'items': []}), 500

# Admin only routes
@menu_bp.route('/', methods=['POST'])
def create_menu_item():
    data = request.get_json()
    user_id = data.get('user_id')
    if not check_admin(user_id):
        return jsonify({'error': 'Admin access required'}), 403
    
    item = MenuItem(
        name=data['name'],
        description=data['description'],
        price=data['price'],
        category_id=data['category_id'],
        image_url=data.get('image_url')
    )
    db.session.add(item)
    db.session.commit()
    return jsonify(item.to_dict()), 201

@menu_bp.route('/<int:id>', methods=['PUT'])
def update_menu_item(id):
    data = request.get_json()
    user_id = data.get('user_id')
    if not check_admin(user_id):
        return jsonify({'error': 'Admin access required'}), 403
    
    item = MenuItem.query.get_or_404(id)
    item.name = data.get('name', item.name)
    item.description = data.get('description', item.description)
    item.price = data.get('price', item.price)
    item.category_id = data.get('category_id', item.category_id)
    item.image_url = data.get('image_url', item.image_url)
    item.available = data.get('available', item.available)
    
    db.session.commit()
    return jsonify(item.to_dict())

@menu_bp.route('/<int:id>', methods=['DELETE'])
def delete_menu_item(id):
    data = request.get_json()
    user_id = data.get('user_id')
    if not check_admin(user_id):
        return jsonify({'error': 'Admin access required'}), 403
    
    item = MenuItem.query.get_or_404(id)
    db.session.delete(item)
    db.session.commit()
    return '', 204