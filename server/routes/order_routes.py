from flask import Blueprint, request, jsonify
from models import Order, OrderItem, db

order_bp = Blueprint('orders', __name__, url_prefix='/api/orders')

@order_bp.route('/', methods=['GET'])
def get_orders():
    orders = Order.query.all()
    return jsonify([order.to_dict() for order in orders])

@order_bp.route('/', methods=['POST'])
def create_order():
    data = request.get_json()
    order = Order(
        user_id=data['user_id'],
        total_amount=data['total_amount']
    )
    db.session.add(order)
    db.session.commit()
    return jsonify(order.to_dict()), 201