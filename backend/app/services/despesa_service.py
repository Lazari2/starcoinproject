from app import db
from app.models.despesas import Despesas
from datetime import datetime


class DespesaService:

    @staticmethod
    def criar_despesa(user_id, descricao, valor, data, id_categoria=None, id_conta=None):
        if valor <= 0:
            raise ValueError("O valor deve ser maior que zero.")

        despesa = Despesas(
            user_id=user_id,
            descricao=descricao,
            valor=valor,
            data=datetime.strptime(data, '%Y-%m-%d').date() if isinstance(data, str) else data,
            id_categoria=id_categoria,
            id_conta=id_conta
        )
        db.session.add(despesa)
        db.session.commit()
        return despesa

    @staticmethod
    def listar_despesas(user_id, mes=None, ano=None):
        query = Despesas.query.filter_by(user_id=user_id)

        if mes and ano:
            from sqlalchemy import extract
            query = query.filter(
                extract('month', Despesas.data) == mes,
                extract('year', Despesas.data) == ano
            )

        return query.order_by(Despesas.data.desc()).all()

    @staticmethod
    def buscar_por_id(user_id, despesa_id):
        return Despesas.query.filter_by(id=despesa_id, user_id=user_id).first()

    @staticmethod
    def atualizar_despesa(user_id, despesa_id, dados):
        despesa = Despesas.query.filter_by(id=despesa_id, user_id=user_id).first()
        if not despesa:
            raise ValueError("Despesa não encontrada.")

        if 'descricao' in dados:
            despesa.descricao = dados['descricao']
        if 'valor' in dados:
            if dados['valor'] <= 0:
                raise ValueError("O valor deve ser maior que zero.")
            despesa.valor = dados['valor']
        if 'data' in dados:
            despesa.data = datetime.strptime(dados['data'], '%Y-%m-%d').date() if isinstance(dados['data'], str) else dados['data']
        if 'id_categoria' in dados:
            despesa.id_categoria = dados['id_categoria']
        if 'id_conta' in dados:
            despesa.id_conta = dados['id_conta']

        db.session.commit()
        return despesa

    @staticmethod
    def deletar_despesa(user_id, despesa_id):
        despesa = Despesas.query.filter_by(id=despesa_id, user_id=user_id).first()
        if not despesa:
            raise ValueError("Despesa não encontrada.")

        db.session.delete(despesa)
        db.session.commit()
        return True
