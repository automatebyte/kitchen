from flask import Blueprint, request, jsonify
from models import MenuItem, db

menu_bp = Blueprint('menu', __name__, url_prefix='/api/menu')

@menu_bp.route('/', methods=['GET'])
def get_menu_items():
    items = MenuItem.query.all()
    return jsonify([item.to_dict() for item in items])

@menu_bp.route('/', methods=['POST'])
def create_menu_item():
    data = request.get_json()
    item = MenuItem(
        name=data['name'],
        description=data['description'],
        price=data['price'],
        category_id=data['category_id'],
        image_url=data.get('image_url')
    )
    db.session.add(item)
    db.session.commit()
    return jsonify({'id': item.id, 'name': item.name}), 201

@menu_bp.route('/<int:id>', methods=['PUT'])
def update_menu_item(id):
    item = MenuItem.query.get_or_404(id)
    data = request.get_json()
    
    item.name = data['name']
    item.description = data['description']
    item.price = data['price']
    item.category_id = data['category_id']
    item.image_url = data.get('image_url')
    
    db.session.commit()
    return jsonify({'id': item.id, 'name': item.name})

@menu_bp.route('/<int:id>', methods=['DELETE'])
def delete_menu_item(id):
    item = MenuItem.query.get_or_404(id)
    db.session.delete(item)
    db.session.commit()
    return '', 204