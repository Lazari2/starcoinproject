from app import db
from app.models.meta import Meta
from datetime import datetime


class MetaService:

    @staticmethod
    def criar_meta(user_id, titulo, valor_alvo, descricao=None, data_limite=None):
        if valor_alvo <= 0:
            raise ValueError("O valor alvo deve ser maior que zero.")

        meta = Meta(
            user_id=user_id,
            titulo=titulo,
            descricao=descricao,
            valor_alvo=valor_alvo,
            valor_atual=0.0,
            data_limite=datetime.strptime(data_limite, '%Y-%m-%d').date() if isinstance(data_limite, str) and data_limite else data_limite,
            status='em_andamento'
        )
        db.session.add(meta)
        db.session.commit()
        return meta

    @staticmethod
    def listar_metas(user_id, status=None):
        query = Meta.query.filter_by(user_id=user_id)
        if status:
            query = query.filter_by(status=status)
        return query.order_by(Meta.created_at.desc()).all()

    @staticmethod
    def buscar_por_id(user_id, meta_id):
        return Meta.query.filter_by(id=meta_id, user_id=user_id).first()

    @staticmethod
    def atualizar_meta(user_id, meta_id, dados):
        meta = Meta.query.filter_by(id=meta_id, user_id=user_id).first()
        if not meta:
            raise ValueError("Meta não encontrada.")

        if 'titulo' in dados:
            meta.titulo = dados['titulo']
        if 'descricao' in dados:
            meta.descricao = dados['descricao']
        if 'valor_alvo' in dados:
            if dados['valor_alvo'] <= 0:
                raise ValueError("O valor alvo deve ser maior que zero.")
            meta.valor_alvo = dados['valor_alvo']
        if 'valor_atual' in dados:
            meta.valor_atual = dados['valor_atual']
            # Auto-concluir se atingiu a meta
            if meta.valor_atual >= meta.valor_alvo:
                meta.status = 'concluida'
        if 'data_limite' in dados:
            meta.data_limite = datetime.strptime(dados['data_limite'], '%Y-%m-%d').date() if isinstance(dados['data_limite'], str) and dados['data_limite'] else dados['data_limite']
        if 'status' in dados:
            if dados['status'] not in ('em_andamento', 'concluida', 'cancelada'):
                raise ValueError("Status inválido.")
            meta.status = dados['status']

        db.session.commit()
        return meta

    @staticmethod
    def deletar_meta(user_id, meta_id):
        meta = Meta.query.filter_by(id=meta_id, user_id=user_id).first()
        if not meta:
            raise ValueError("Meta não encontrada.")

        db.session.delete(meta)
        db.session.commit()
        return True
