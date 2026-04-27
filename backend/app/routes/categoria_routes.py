from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.categoria_service import CategoriaService

categoria_bp = Blueprint('categoria', __name__, url_prefix='/api/categorias')


@categoria_bp.route('', methods=['POST'])
@jwt_required()
def criar_categoria():
    user_id = get_jwt_identity()
    data = request.get_json()

    if not data or 'nome' not in data or 'tipo' not in data:
        return jsonify({'error': 'Campos obrigatórios: nome, tipo'}), 400

    try:
        categoria = CategoriaService.criar_categoria(
            user_id=user_id,
            nome=data['nome'],
            tipo=data['tipo'],
            descricao=data.get('descricao')
        )
        return jsonify({'message': 'Categoria criada com sucesso', 'categoria': categoria.to_dict()}), 201
    except ValueError as e:
        return jsonify({'error': str(e)}), 400


@categoria_bp.route('', methods=['GET'])
@jwt_required()
def listar_categorias():
    user_id = get_jwt_identity()
    tipo = request.args.get('tipo')

    categorias = CategoriaService.listar_categorias(user_id, tipo=tipo)
    return jsonify({'categorias': [c.to_dict() for c in categorias]}), 200


@categoria_bp.route('/<categoria_id>', methods=['GET'])
@jwt_required()
def buscar_categoria(categoria_id):
    user_id = get_jwt_identity()
    categoria = CategoriaService.buscar_por_id(user_id, categoria_id)

    if not categoria:
        return jsonify({'error': 'Categoria não encontrada'}), 404

    return jsonify({'categoria': categoria.to_dict()}), 200


@categoria_bp.route('/<categoria_id>', methods=['PUT'])
@jwt_required()
def atualizar_categoria(categoria_id):
    user_id = get_jwt_identity()
    data = request.get_json()

    try:
        categoria = CategoriaService.atualizar_categoria(user_id, categoria_id, data)
        return jsonify({'message': 'Categoria atualizada com sucesso', 'categoria': categoria.to_dict()}), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 400


@categoria_bp.route('/<categoria_id>', methods=['DELETE'])
@jwt_required()
def deletar_categoria(categoria_id):
    user_id = get_jwt_identity()

    try:
        CategoriaService.deletar_categoria(user_id, categoria_id)
        return jsonify({'message': 'Categoria deletada com sucesso'}), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
