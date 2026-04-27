from app import db
from app.models.categoria import Categoria


class CategoriaService:

    @staticmethod
    def criar_categoria(user_id, nome, tipo, descricao=None):
        if tipo not in ('receita', 'despesa'):
            raise ValueError("Tipo deve ser 'receita' ou 'despesa'.")

        categoria = Categoria(
            user_id=user_id,
            nome=nome,
            tipo=tipo,
            descricao=descricao
        )
        db.session.add(categoria)
        db.session.commit()
        return categoria

    @staticmethod
    def listar_categorias(user_id, tipo=None):
        query = Categoria.query.filter_by(user_id=user_id)
        if tipo:
            query = query.filter_by(tipo=tipo)
        return query.order_by(Categoria.nome).all()

    @staticmethod
    def buscar_por_id(user_id, categoria_id):
        return Categoria.query.filter_by(id=categoria_id, user_id=user_id).first()

    @staticmethod
    def atualizar_categoria(user_id, categoria_id, dados):
        categoria = Categoria.query.filter_by(id=categoria_id, user_id=user_id).first()
        if not categoria:
            raise ValueError("Categoria não encontrada.")

        if 'nome' in dados:
            categoria.nome = dados['nome']
        if 'tipo' in dados:
            if dados['tipo'] not in ('receita', 'despesa'):
                raise ValueError("Tipo deve ser 'receita' ou 'despesa'.")
            categoria.tipo = dados['tipo']
        if 'descricao' in dados:
            categoria.descricao = dados['descricao']

        db.session.commit()
        return categoria

    @staticmethod
    def deletar_categoria(user_id, categoria_id):
        categoria = Categoria.query.filter_by(id=categoria_id, user_id=user_id).first()
        if not categoria:
            raise ValueError("Categoria não encontrada.")

        db.session.delete(categoria)
        db.session.commit()
        return True
