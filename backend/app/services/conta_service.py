from app import db
from app.models.conta import Conta


class ContaService:

    @staticmethod
    def criar_conta(user_id, nome, tipo, descricao=None, saldo=0.0):
        conta = Conta(
            user_id=user_id,
            nome=nome,
            tipo=tipo,
            descricao=descricao,
            saldo=saldo
        )
        db.session.add(conta)
        db.session.commit()
        return conta

    @staticmethod
    def listar_contas(user_id):
        return Conta.query.filter_by(user_id=user_id).order_by(Conta.nome).all()

    @staticmethod
    def buscar_por_id(user_id, conta_id):
        return Conta.query.filter_by(id=conta_id, user_id=user_id).first()

    @staticmethod
    def atualizar_conta(user_id, conta_id, dados):
        conta = Conta.query.filter_by(id=conta_id, user_id=user_id).first()
        if not conta:
            raise ValueError("Conta não encontrada.")

        if 'nome' in dados:
            conta.nome = dados['nome']
        if 'tipo' in dados:
            conta.tipo = dados['tipo']
        if 'descricao' in dados:
            conta.descricao = dados['descricao']
        if 'saldo' in dados:
            conta.saldo = dados['saldo']

        db.session.commit()
        return conta

    @staticmethod
    def deletar_conta(user_id, conta_id):
        conta = Conta.query.filter_by(id=conta_id, user_id=user_id).first()
        if not conta:
            raise ValueError("Conta não encontrada.")

        db.session.delete(conta)
        db.session.commit()
        return True
