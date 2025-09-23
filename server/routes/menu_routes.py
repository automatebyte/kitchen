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
        category_id=data['category_id']
    )
    db.session.add(item)
    db.session.commit()
    return jsonify(item.to_dict()), 201