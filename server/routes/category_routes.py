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
    return jsonify(category.to_dict()), 201