from app import db
from app.models.limite_categoria import LimiteCategoria
from app.models.despesas import Despesas
from sqlalchemy import extract, func


class LimiteService:

    @staticmethod
    def criar_limite(user_id, categoria_id, valor_limite, mes, ano):
        if valor_limite <= 0:
            raise ValueError("O valor limite deve ser maior que zero.")
        if mes < 1 or mes > 12:
            raise ValueError("Mês inválido (1-12).")

        # Verificar se já existe limite para esta categoria/mês/ano
        existente = LimiteCategoria.query.filter_by(
            user_id=user_id,
            categoria_id=categoria_id,
            mes=mes,
            ano=ano
        ).first()

        if existente:
            raise ValueError("Já existe um limite definido para esta categoria neste mês/ano.")

        limite = LimiteCategoria(
            user_id=user_id,
            categoria_id=categoria_id,
            valor_limite=valor_limite,
            mes=mes,
            ano=ano
        )
        db.session.add(limite)
        db.session.commit()
        return limite

    @staticmethod
    def listar_limites(user_id, mes=None, ano=None):
        query = LimiteCategoria.query.filter_by(user_id=user_id)
        if mes:
            query = query.filter_by(mes=mes)
        if ano:
            query = query.filter_by(ano=ano)
        return query.all()

    @staticmethod
    def buscar_por_id(user_id, limite_id):
        return LimiteCategoria.query.filter_by(id=limite_id, user_id=user_id).first()

    @staticmethod
    def atualizar_limite(user_id, limite_id, dados):
        limite = LimiteCategoria.query.filter_by(id=limite_id, user_id=user_id).first()
        if not limite:
            raise ValueError("Limite não encontrado.")

        if 'valor_limite' in dados:
            if dados['valor_limite'] <= 0:
                raise ValueError("O valor limite deve ser maior que zero.")
            limite.valor_limite = dados['valor_limite']
        if 'mes' in dados:
            limite.mes = dados['mes']
        if 'ano' in dados:
            limite.ano = dados['ano']

        db.session.commit()
        return limite

    @staticmethod
    def deletar_limite(user_id, limite_id):
        limite = LimiteCategoria.query.filter_by(id=limite_id, user_id=user_id).first()
        if not limite:
            raise ValueError("Limite não encontrado.")

        db.session.delete(limite)
        db.session.commit()
        return True

    @staticmethod
    def verificar_limites(user_id, mes, ano):
        """Retorna os limites com o gasto atual de cada categoria"""
        limites = LimiteCategoria.query.filter_by(
            user_id=user_id, mes=mes, ano=ano
        ).all()

        resultado = []
        for limite in limites:
            gasto_atual = db.session.query(func.coalesce(func.sum(Despesas.valor), 0)).filter(
                Despesas.user_id == user_id,
                Despesas.id_categoria == limite.categoria_id,
                extract('month', Despesas.data) == mes,
                extract('year', Despesas.data) == ano
            ).scalar()

            resultado.append({
                **limite.to_dict(),
                'gasto_atual': float(gasto_atual),
                'percentual_usado': round((float(gasto_atual) / limite.valor_limite * 100), 2) if limite.valor_limite > 0 else 0,
                'estourado': float(gasto_atual) > limite.valor_limite
            })

        return resultado
