from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.limite_service import LimiteService

limite_bp = Blueprint('limite', __name__, url_prefix='/api/limites')


@limite_bp.route('', methods=['POST'])
@jwt_required()
def criar_limite():
    user_id = get_jwt_identity()
    data = request.get_json()

    campos = ['categoria_id', 'valor_limite', 'mes', 'ano']
    if not data or not all(k in data for k in campos):
        return jsonify({'error': f'Campos obrigatórios: {", ".join(campos)}'}), 400

    try:
        limite = LimiteService.criar_limite(
            user_id=user_id,
            categoria_id=data['categoria_id'],
            valor_limite=data['valor_limite'],
            mes=data['mes'],
            ano=data['ano']
        )
        return jsonify({'message': 'Limite criado com sucesso', 'limite': limite.to_dict()}), 201
    except ValueError as e:
        return jsonify({'error': str(e)}), 400


@limite_bp.route('', methods=['GET'])
@jwt_required()
def listar_limites():
    user_id = get_jwt_identity()
    mes = request.args.get('mes', type=int)
    ano = request.args.get('ano', type=int)

    limites = LimiteService.listar_limites(user_id, mes=mes, ano=ano)
    return jsonify({'limites': [l.to_dict() for l in limites]}), 200


@limite_bp.route('/verificar', methods=['GET'])
@jwt_required()
def verificar_limites():
    """Retorna limites com gasto atual e se foi estourado"""
    user_id = get_jwt_identity()
    mes = request.args.get('mes', type=int)
    ano = request.args.get('ano', type=int)

    if not mes or not ano:
        return jsonify({'error': 'Parâmetros obrigatórios: mes, ano'}), 400

    resultado = LimiteService.verificar_limites(user_id, mes, ano)
    return jsonify({'limites': resultado}), 200


@limite_bp.route('/<limite_id>', methods=['GET'])
@jwt_required()
def buscar_limite(limite_id):
    user_id = get_jwt_identity()
    limite = LimiteService.buscar_por_id(user_id, limite_id)

    if not limite:
        return jsonify({'error': 'Limite não encontrado'}), 404

    return jsonify({'limite': limite.to_dict()}), 200


@limite_bp.route('/<limite_id>', methods=['PUT'])
@jwt_required()
def atualizar_limite(limite_id):
    user_id = get_jwt_identity()
    data = request.get_json()

    try:
        limite = LimiteService.atualizar_limite(user_id, limite_id, data)
        return jsonify({'message': 'Limite atualizado com sucesso', 'limite': limite.to_dict()}), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 400


@limite_bp.route('/<limite_id>', methods=['DELETE'])
@jwt_required()
def deletar_limite(limite_id):
    user_id = get_jwt_identity()

    try:
        LimiteService.deletar_limite(user_id, limite_id)
        return jsonify({'message': 'Limite deletado com sucesso'}), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
