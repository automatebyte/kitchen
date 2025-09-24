from flask import Blueprint, request, jsonify
from models import Order, OrderItem, Cart, MenuItem, User, db

order_bp = Blueprint('orders', __name__, url_prefix='/api/orders')

@order_bp.route('/', methods=['GET'])
def get_orders():
    user_id = request.args.get('user_id')
    if user_id:
        orders = Order.query.filter_by(user_id=user_id).all()
    else:
        orders = Order.query.all()
    return jsonify([order.to_dict() for order in orders])

@order_bp.route('/', methods=['POST'])
def create_order():
    data = request.get_json()
    user_id = data.get('user_id')
    
    if not user_id:
        return jsonify({'error': 'User ID required'}), 400
    
    # Get cart items for user
    cart_items = Cart.query.filter_by(user_id=user_id).all()
    if not cart_items:
        return jsonify({'error': 'Cart is empty'}), 400
    
    # Create order
    order = Order(user_id=user_id)
    db.session.add(order)
    db.session.flush()  # Get order ID
    
    # Create order items from cart
    for cart_item in cart_items:
        order_item = OrderItem(
            order_id=order.id,
            menu_item_id=cart_item.menu_item_id,
            quantity=cart_item.quantity,
            price=cart_item.menu_item.price
        )
        db.session.add(order_item)
    
    # Calculate total and clear cart
    order.calculate_total()
    Cart.query.filter_by(user_id=user_id).delete()
    
    db.session.commit()
    return jsonify(order.to_dict()), 201

@order_bp.route('/<int:order_id>/status', methods=['PATCH'])
def update_order_status(order_id):
    data = request.get_json()
    user_id = data.get('user_id')
    
    # Check if user is admin
    user = User.query.get(user_id)
    if not user or not user.is_admin:
        return jsonify({'error': 'Admin access required'}), 403
    
    order = Order.query.get_or_404(order_id)
    order.status = data.get('status', order.status)
    db.session.commit()
    return jsonify(order.to_dict())

# Cart routes
@order_bp.route('/cart/<int:user_id>', methods=['GET'])
def get_cart(user_id):
    cart_items = Cart.query.filter_by(user_id=user_id).all()
    total = sum(item.quantity * item.menu_item.price for item in cart_items)
    return jsonify({
        'items': [item.to_dict() for item in cart_items],
        'total': total
    })

@order_bp.route('/cart', methods=['POST'])
def add_to_cart():
    data = request.get_json()
    user_id = data.get('user_id')
    menu_item_id = data.get('menu_item_id')
    quantity = data.get('quantity', 1)
    
    if not all([user_id, menu_item_id]):
        return jsonify({'error': 'User ID and Menu Item ID required'}), 400
    
    # Check if item exists in cart
    cart_item = Cart.query.filter_by(user_id=user_id, menu_item_id=menu_item_id).first()
    
    if cart_item:
        cart_item.quantity += quantity
    else:
        cart_item = Cart(user_id=user_id, menu_item_id=menu_item_id, quantity=quantity)
        db.session.add(cart_item)
    
    db.session.commit()
    return jsonify(cart_item.to_dict()), 201

@order_bp.route('/cart/<int:cart_id>', methods=['DELETE'])
def remove_from_cart(cart_id):
    cart_item = Cart.query.get_or_404(cart_id)
    db.session.delete(cart_item)
    db.session.commit()
    return '', 204