from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.conta_service import ContaService

conta_bp = Blueprint('conta', __name__, url_prefix='/api/contas')


@conta_bp.route('', methods=['POST'])
@jwt_required()
def criar_conta():
    user_id = get_jwt_identity()
    data = request.get_json()

    if not data or 'nome' not in data or 'tipo' not in data:
        return jsonify({'error': 'Campos obrigatórios: nome, tipo'}), 400

    try:
        conta = ContaService.criar_conta(
            user_id=user_id,
            nome=data['nome'],
            tipo=data['tipo'],
            descricao=data.get('descricao'),
            saldo=data.get('saldo', 0.0)
        )
        return jsonify({'message': 'Conta criada com sucesso', 'conta': conta.to_dict()}), 201
    except ValueError as e:
        return jsonify({'error': str(e)}), 400


@conta_bp.route('', methods=['GET'])
@jwt_required()
def listar_contas():
    user_id = get_jwt_identity()
    contas = ContaService.listar_contas(user_id)
    return jsonify({'contas': [c.to_dict() for c in contas]}), 200


@conta_bp.route('/<conta_id>', methods=['GET'])
@jwt_required()
def buscar_conta(conta_id):
    user_id = get_jwt_identity()
    conta = ContaService.buscar_por_id(user_id, conta_id)

    if not conta:
        return jsonify({'error': 'Conta não encontrada'}), 404

    return jsonify({'conta': conta.to_dict()}), 200


@conta_bp.route('/<conta_id>', methods=['PUT'])
@jwt_required()
def atualizar_conta(conta_id):
    user_id = get_jwt_identity()
    data = request.get_json()

    try:
        conta = ContaService.atualizar_conta(user_id, conta_id, data)
        return jsonify({'message': 'Conta atualizada com sucesso', 'conta': conta.to_dict()}), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 400


@conta_bp.route('/<conta_id>', methods=['DELETE'])
@jwt_required()
def deletar_conta(conta_id):
    user_id = get_jwt_identity()

    try:
        ContaService.deletar_conta(user_id, conta_id)
        return jsonify({'message': 'Conta deletada com sucesso'}), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
