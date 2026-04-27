from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.meta_service import MetaService

meta_bp = Blueprint('meta', __name__, url_prefix='/api/metas')


@meta_bp.route('', methods=['POST'])
@jwt_required()
def criar_meta():
    user_id = get_jwt_identity()
    data = request.get_json()

    if not data or 'titulo' not in data or 'valor_alvo' not in data:
        return jsonify({'error': 'Campos obrigatórios: titulo, valor_alvo'}), 400

    try:
        meta = MetaService.criar_meta(
            user_id=user_id,
            titulo=data['titulo'],
            valor_alvo=data['valor_alvo'],
            descricao=data.get('descricao'),
            data_limite=data.get('data_limite')
        )
        return jsonify({'message': 'Meta criada com sucesso', 'meta': meta.to_dict()}), 201
    except ValueError as e:
        return jsonify({'error': str(e)}), 400


@meta_bp.route('', methods=['GET'])
@jwt_required()
def listar_metas():
    user_id = get_jwt_identity()
    status = request.args.get('status')

    metas = MetaService.listar_metas(user_id, status=status)
    return jsonify({'metas': [m.to_dict() for m in metas]}), 200


@meta_bp.route('/<meta_id>', methods=['GET'])
@jwt_required()
def buscar_meta(meta_id):
    user_id = get_jwt_identity()
    meta = MetaService.buscar_por_id(user_id, meta_id)

    if not meta:
        return jsonify({'error': 'Meta não encontrada'}), 404

    return jsonify({'meta': meta.to_dict()}), 200


@meta_bp.route('/<meta_id>', methods=['PUT'])
@jwt_required()
def atualizar_meta(meta_id):
    user_id = get_jwt_identity()
    data = request.get_json()

    try:
        meta = MetaService.atualizar_meta(user_id, meta_id, data)
        return jsonify({'message': 'Meta atualizada com sucesso', 'meta': meta.to_dict()}), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 400


@meta_bp.route('/<meta_id>', methods=['DELETE'])
@jwt_required()
def deletar_meta(meta_id):
    user_id = get_jwt_identity()

    try:
        MetaService.deletar_meta(user_id, meta_id)
        return jsonify({'message': 'Meta deletada com sucesso'}), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
