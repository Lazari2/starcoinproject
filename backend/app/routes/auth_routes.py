from flask import Blueprint, request, jsonify
from app.services.auth_service import AuthService
from flask_jwt_extended import jwt_required, get_jwt_identity

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data or not all(k in data for k in ('username', 'email', 'password', 'confirm_password')):
        return jsonify({'error': 'Missing required fields'}), 400
    try:
        user = AuthService.register_user(
            username=data['username'],
            email=data['email'],
            password=data['password'],
            confirm_password=data['confirm_password']
        )
        return jsonify({
            "message": "User created successfully", 
            "user": user.to_dict() 
        }), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    try:
        token = AuthService.login_user(
            email=data['email'],
            password=data['password']
        )
        return jsonify({"access_token": token}), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 401

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    return jsonify({"user_id": user_id}), 200