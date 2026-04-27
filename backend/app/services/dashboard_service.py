from app import db
from app.models.despesas import Despesas
from app.models.receitas import Receitas
from sqlalchemy import extract, func
from datetime import datetime


class DashboardService:

    @staticmethod
    def resumo_mensal(user_id, mes=None, ano=None):
        """Retorna total de receitas e despesas do mês"""
        if not mes:
            mes = datetime.utcnow().month
        if not ano:
            ano = datetime.utcnow().year

        total_receitas = db.session.query(
            func.coalesce(func.sum(Receitas.valor), 0)
        ).filter(
            Receitas.user_id == user_id,
            extract('month', Receitas.data) == mes,
            extract('year', Receitas.data) == ano
        ).scalar()

        total_despesas = db.session.query(
            func.coalesce(func.sum(Despesas.valor), 0)
        ).filter(
            Despesas.user_id == user_id,
            extract('month', Despesas.data) == mes,
            extract('year', Despesas.data) == ano
        ).scalar()

        saldo = float(total_receitas) - float(total_despesas)

        return {
            'mes': mes,
            'ano': ano,
            'total_receitas': float(total_receitas),
            'total_despesas': float(total_despesas),
            'saldo': round(saldo, 2)
        }

    @staticmethod
    def despesas_por_categoria(user_id, mes=None, ano=None):
        """Retorna despesas agrupadas por categoria"""
        if not mes:
            mes = datetime.utcnow().month
        if not ano:
            ano = datetime.utcnow().year

        from app.models.categoria import Categoria

        resultados = db.session.query(
            Categoria.nome,
            func.coalesce(func.sum(Despesas.valor), 0).label('total')
        ).join(
            Despesas, Despesas.id_categoria == Categoria.id
        ).filter(
            Despesas.user_id == user_id,
            extract('month', Despesas.data) == mes,
            extract('year', Despesas.data) == ano
        ).group_by(
            Categoria.nome
        ).all()

        return [
            {'categoria': nome, 'total': float(total)}
            for nome, total in resultados
        ]

    @staticmethod
    def evolucao_mensal(user_id, ano=None):
        """Retorna receitas e despesas mês a mês do ano"""
        if not ano:
            ano = datetime.utcnow().year

        meses = []
        for mes in range(1, 13):
            total_receitas = db.session.query(
                func.coalesce(func.sum(Receitas.valor), 0)
            ).filter(
                Receitas.user_id == user_id,
                extract('month', Receitas.data) == mes,
                extract('year', Receitas.data) == ano
            ).scalar()

            total_despesas = db.session.query(
                func.coalesce(func.sum(Despesas.valor), 0)
            ).filter(
                Despesas.user_id == user_id,
                extract('month', Despesas.data) == mes,
                extract('year', Despesas.data) == ano
            ).scalar()

            meses.append({
                'mes': mes,
                'receitas': float(total_receitas),
                'despesas': float(total_despesas),
                'saldo': round(float(total_receitas) - float(total_despesas), 2)
            })

        return {
            'ano': ano,
            'meses': meses
        }
