from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.despesa_service import DespesaService

despesa_bp = Blueprint('despesa', __name__, url_prefix='/api/despesas')


@despesa_bp.route('', methods=['POST'])
@jwt_required()
def criar_despesa():
    user_id = get_jwt_identity()
    data = request.get_json()

    if not data or 'descricao' not in data or 'valor' not in data or 'data' not in data:
        return jsonify({'error': 'Campos obrigatórios: descricao, valor, data'}), 400

    try:
        despesa = DespesaService.criar_despesa(
            user_id=user_id,
            descricao=data['descricao'],
            valor=data['valor'],
            data=data['data'],
            id_categoria=data.get('id_categoria'),
            id_conta=data.get('id_conta')
        )
        return jsonify({'message': 'Despesa registrada com sucesso', 'despesa': despesa.to_dict()}), 201
    except ValueError as e:
        return jsonify({'error': str(e)}), 400


@despesa_bp.route('', methods=['GET'])
@jwt_required()
def listar_despesas():
    user_id = get_jwt_identity()
    mes = request.args.get('mes', type=int)
    ano = request.args.get('ano', type=int)

    despesas = DespesaService.listar_despesas(user_id, mes=mes, ano=ano)
    return jsonify({'despesas': [d.to_dict() for d in despesas]}), 200


@despesa_bp.route('/<despesa_id>', methods=['GET'])
@jwt_required()
def buscar_despesa(despesa_id):
    user_id = get_jwt_identity()
    despesa = DespesaService.buscar_por_id(user_id, despesa_id)

    if not despesa:
        return jsonify({'error': 'Despesa não encontrada'}), 404

    return jsonify({'despesa': despesa.to_dict()}), 200


@despesa_bp.route('/<despesa_id>', methods=['PUT'])
@jwt_required()
def atualizar_despesa(despesa_id):
    user_id = get_jwt_identity()
    data = request.get_json()

    try:
        despesa = DespesaService.atualizar_despesa(user_id, despesa_id, data)
        return jsonify({'message': 'Despesa atualizada com sucesso', 'despesa': despesa.to_dict()}), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 400


@despesa_bp.route('/<despesa_id>', methods=['DELETE'])
@jwt_required()
def deletar_despesa(despesa_id):
    user_id = get_jwt_identity()

    try:
        DespesaService.deletar_despesa(user_id, despesa_id)
        return jsonify({'message': 'Despesa deletada com sucesso'}), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
