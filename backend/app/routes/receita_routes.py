from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.receita_service import ReceitaService

receita_bp = Blueprint('receita', __name__, url_prefix='/api/receitas')


@receita_bp.route('', methods=['POST'])
@jwt_required()
def criar_receita():
    user_id = get_jwt_identity()
    data = request.get_json()

    if not data or 'descricao' not in data or 'valor' not in data or 'data' not in data:
        return jsonify({'error': 'Campos obrigatórios: descricao, valor, data'}), 400

    try:
        receita = ReceitaService.criar_receita(
            user_id=user_id,
            descricao=data['descricao'],
            valor=data['valor'],
            data=data['data'],
            id_categoria=data.get('id_categoria'),
            id_conta=data.get('id_conta')
        )
        return jsonify({'message': 'Receita registrada com sucesso', 'receita': receita.to_dict()}), 201
    except ValueError as e:
        return jsonify({'error': str(e)}), 400


@receita_bp.route('', methods=['GET'])
@jwt_required()
def listar_receitas():
    user_id = get_jwt_identity()
    mes = request.args.get('mes', type=int)
    ano = request.args.get('ano', type=int)

    receitas = ReceitaService.listar_receitas(user_id, mes=mes, ano=ano)
    return jsonify({'receitas': [r.to_dict() for r in receitas]}), 200


@receita_bp.route('/<receita_id>', methods=['GET'])
@jwt_required()
def buscar_receita(receita_id):
    user_id = get_jwt_identity()
    receita = ReceitaService.buscar_por_id(user_id, receita_id)

    if not receita:
        return jsonify({'error': 'Receita não encontrada'}), 404

    return jsonify({'receita': receita.to_dict()}), 200


@receita_bp.route('/<receita_id>', methods=['PUT'])
@jwt_required()
def atualizar_receita(receita_id):
    user_id = get_jwt_identity()
    data = request.get_json()

    try:
        receita = ReceitaService.atualizar_receita(user_id, receita_id, data)
        return jsonify({'message': 'Receita atualizada com sucesso', 'receita': receita.to_dict()}), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 400


@receita_bp.route('/<receita_id>', methods=['DELETE'])
@jwt_required()
def deletar_receita(receita_id):
    user_id = get_jwt_identity()

    try:
        ReceitaService.deletar_receita(user_id, receita_id)
        return jsonify({'message': 'Receita deletada com sucesso'}), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
