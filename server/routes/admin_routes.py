from flask import Blueprint, request, jsonify
from models import User, Order, MenuItem, Category, db

admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')

def check_admin(user_id):
    user = User.query.get(user_id)
    return user and user.is_admin

@admin_bp.route('/dashboard', methods=['GET'])
def admin_dashboard():
    user_id = request.args.get('user_id')
    if not check_admin(user_id):
        return jsonify({'error': 'Admin access required'}), 403
    
    stats = {
        'total_users': User.query.count(),
        'total_orders': Order.query.count(),
        'total_menu_items': MenuItem.query.count(),
        'pending_orders': Order.query.filter_by(status='pending').count(),
        'recent_orders': [order.to_dict() for order in Order.query.order_by(Order.created_at.desc()).limit(5)]
    }
    return jsonify(stats)

@admin_bp.route('/users', methods=['GET'])
def get_all_users():
    user_id = request.args.get('user_id')
    if not check_admin(user_id):
        return jsonify({'error': 'Admin access required'}), 403
    
    users = User.query.all()
    return jsonify([user.to_dict() for user in users])

@admin_bp.route('/users/<int:target_user_id>/admin', methods=['PATCH'])
def toggle_admin_status(target_user_id):
    user_id = request.get_json().get('user_id')
    if not check_admin(user_id):
        return jsonify({'error': 'Admin access required'}), 403
    
    target_user = User.query.get_or_404(target_user_id)
    target_user.is_admin = not target_user.is_admin
    db.session.commit()
    return jsonify(target_user.to_dict())

@admin_bp.route('/menu-items', methods=['POST'])
def create_menu_item():
    data = request.get_json()
    user_id = data.get('user_id')
    if not check_admin(user_id):
        return jsonify({'error': 'Admin access required'}), 403
    
    menu_item = MenuItem(
        name=data['name'],
        description=data.get('description'),
        price=data['price'],
        category_id=data['category_id'],
        image_url=data.get('image_url')
    )
    db.session.add(menu_item)
    db.session.commit()
    return jsonify(menu_item.to_dict()), 201

@admin_bp.route('/menu-items/<int:item_id>', methods=['PATCH'])
def update_menu_item(item_id):
    data = request.get_json()
    user_id = data.get('user_id')
    if not check_admin(user_id):
        return jsonify({'error': 'Admin access required'}), 403
    
    menu_item = MenuItem.query.get_or_404(item_id)
    menu_item.name = data.get('name', menu_item.name)
    menu_item.description = data.get('description', menu_item.description)
    menu_item.price = data.get('price', menu_item.price)
    menu_item.available = data.get('available', menu_item.available)
    menu_item.image_url = data.get('image_url', menu_item.image_url)
    
    db.session.commit()
    return jsonify(menu_item.to_dict())

@admin_bp.route('/categories', methods=['POST'])
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

@admin_bp.route('/categories/<int:category_id>', methods=['PATCH'])
def update_category(category_id):
    data = request.get_json()
    user_id = data.get('user_id')
    if not check_admin(user_id):
        return jsonify({'error': 'Admin access required'}), 403
    
    category = Category.query.get_or_404(category_id)
    category.name = data.get('name', category.name)
    category.description = data.get('description', category.description)
    db.session.commit()
    return jsonify(category.to_dict())

@admin_bp.route('/categories/<int:category_id>', methods=['DELETE'])
def delete_category(category_id):
    data = request.get_json()
    user_id = data.get('user_id')
    if not check_admin(user_id):
        return jsonify({'error': 'Admin access required'}), 403
    
    category = Category.query.get_or_404(category_id)
    # Check if category has menu items
    if category.menu_items:
        return jsonify({'error': 'Cannot delete category with existing menu items'}), 400
    
    db.session.delete(category)
    db.session.commit()
    return '', 204

@admin_bp.route('/menu-items/<int:item_id>', methods=['DELETE'])
def delete_menu_item(item_id):
    data = request.get_json()
    user_id = data.get('user_id')
    if not check_admin(user_id):
        return jsonify({'error': 'Admin access required'}), 403
    
    menu_item = MenuItem.query.get_or_404(item_id)
    db.session.delete(menu_item)
    db.session.commit()
    return '', 204

@admin_bp.route('/orders/<int:order_id>/approve', methods=['PATCH'])
def approve_order(order_id):
    data = request.get_json()
    user_id = data.get('user_id')
    if not check_admin(user_id):
        return jsonify({'error': 'Admin access required'}), 403
    
    order = Order.query.get_or_404(order_id)
    order.status = 'approved'
    db.session.commit()
    return jsonify(order.to_dict())

@admin_bp.route('/orders/<int:order_id>/reject', methods=['PATCH'])
def reject_order(order_id):
    data = request.get_json()
    user_id = data.get('user_id')
    if not check_admin(user_id):
        return jsonify({'error': 'Admin access required'}), 403
    
    order = Order.query.get_or_404(order_id)
    order.status = 'rejected'
    db.session.commit()
    return jsonify(order.to_dict())

@admin_bp.route('/orders/<int:order_id>/status', methods=['PATCH'])
def update_order_status_admin(order_id):
    data = request.get_json()
    user_id = data.get('user_id')
    status = data.get('status')
    if not check_admin(user_id):
        return jsonify({'error': 'Admin access required'}), 403
    
    order = Order.query.get_or_404(order_id)
    order.status = status
    db.session.commit()
    return jsonify(order.to_dict())

@admin_bp.route('/cleanup-admin', methods=['GET'])
def cleanup_admin():
    try:
        # Update existing admin user instead of deleting
        admin_user = User.query.filter_by(username='admin').first()
        if admin_user:
            admin_user.is_admin = True
            admin_user.set_password('admin123')
            db.session.commit()
            return jsonify({'message': 'Admin user updated successfully', 'user': admin_user.to_dict()})
        else:
            # Create new admin user if doesn't exist
            new_admin = User(
                username='admin',
                email='admin@mvulecatering.com',
                is_admin=True
            )
            new_admin.set_password('admin123')
            db.session.add(new_admin)
            db.session.commit()
            return jsonify({'message': 'Admin user created successfully', 'user': new_admin.to_dict()})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500