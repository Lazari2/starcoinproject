from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.dashboard_service import DashboardService

dashboard_bp = Blueprint('dashboard', __name__, url_prefix='/api/dashboard')


@dashboard_bp.route('/resumo', methods=['GET'])
@jwt_required()
def resumo_mensal():
    """Retorna resumo financeiro do mês (total receitas, despesas e saldo)"""
    user_id = get_jwt_identity()
    mes = request.args.get('mes', type=int)
    ano = request.args.get('ano', type=int)

    resumo = DashboardService.resumo_mensal(user_id, mes=mes, ano=ano)
    return jsonify(resumo), 200


@dashboard_bp.route('/despesas-por-categoria', methods=['GET'])
@jwt_required()
def despesas_por_categoria():
    """Retorna despesas agrupadas por categoria para gráfico de pizza"""
    user_id = get_jwt_identity()
    mes = request.args.get('mes', type=int)
    ano = request.args.get('ano', type=int)

    dados = DashboardService.despesas_por_categoria(user_id, mes=mes, ano=ano)
    return jsonify({'dados': dados}), 200


@dashboard_bp.route('/evolucao-mensal', methods=['GET'])
@jwt_required()
def evolucao_mensal():
    """Retorna evolução de receitas e despesas mês a mês para gráfico de barras/linhas"""
    user_id = get_jwt_identity()
    ano = request.args.get('ano', type=int)

    dados = DashboardService.evolucao_mensal(user_id, ano=ano)
    return jsonify(dados), 200
