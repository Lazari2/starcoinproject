from app import db
from app.models.receitas import Receitas
from datetime import datetime


class ReceitaService:

    @staticmethod
    def criar_receita(user_id, descricao, valor, data, id_categoria=None, id_conta=None):
        if valor <= 0:
            raise ValueError("O valor deve ser maior que zero.")

        receita = Receitas(
            user_id=user_id,
            descricao=descricao,
            valor=valor,
            data=datetime.strptime(data, '%Y-%m-%d').date() if isinstance(data, str) else data,
            id_categoria=id_categoria,
            id_conta=id_conta
        )
        db.session.add(receita)
        db.session.commit()
        return receita

    @staticmethod
    def listar_receitas(user_id, mes=None, ano=None):
        query = Receitas.query.filter_by(user_id=user_id)

        if mes and ano:
            from sqlalchemy import extract
            query = query.filter(
                extract('month', Receitas.data) == mes,
                extract('year', Receitas.data) == ano
            )

        return query.order_by(Receitas.data.desc()).all()

    @staticmethod
    def buscar_por_id(user_id, receita_id):
        return Receitas.query.filter_by(id=receita_id, user_id=user_id).first()

    @staticmethod
    def atualizar_receita(user_id, receita_id, dados):
        receita = Receitas.query.filter_by(id=receita_id, user_id=user_id).first()
        if not receita:
            raise ValueError("Receita não encontrada.")

        if 'descricao' in dados:
            receita.descricao = dados['descricao']
        if 'valor' in dados:
            if dados['valor'] <= 0:
                raise ValueError("O valor deve ser maior que zero.")
            receita.valor = dados['valor']
        if 'data' in dados:
            receita.data = datetime.strptime(dados['data'], '%Y-%m-%d').date() if isinstance(dados['data'], str) else dados['data']
        if 'id_categoria' in dados:
            receita.id_categoria = dados['id_categoria']
        if 'id_conta' in dados:
            receita.id_conta = dados['id_conta']

        db.session.commit()
        return receita

    @staticmethod
    def deletar_receita(user_id, receita_id):
        receita = Receitas.query.filter_by(id=receita_id, user_id=user_id).first()
        if not receita:
            raise ValueError("Receita não encontrada.")

        db.session.delete(receita)
        db.session.commit()
        return True
