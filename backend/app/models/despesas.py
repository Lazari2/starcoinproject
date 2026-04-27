from datetime import datetime
from app import db
from sqlalchemy.dialects.postgresql import UUID
import uuid

class Despesas(db.Model):
    __tablename__ = 'despesas'

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'), nullable=False)
    descricao = db.Column(db.String(200), nullable=True)
    valor = db.Column(db.Float, nullable=False)
    data = db.Column(db.Date, nullable=False)
    id_categoria = db.Column(UUID(as_uuid=True), db.ForeignKey('categoria.id'), nullable=True)
    id_conta = db.Column(UUID(as_uuid=True), db.ForeignKey('conta.id'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<Despesa {self.descricao} - R${self.valor}>"

    def to_dict(self):
        return {
            'id': str(self.id),
            'user_id': str(self.user_id),
            'descricao': self.descricao,
            'valor': self.valor,
            'data': self.data.isoformat() if self.data else None,
            'id_categoria': str(self.id_categoria) if self.id_categoria else None,
            'id_conta': str(self.id_conta) if self.id_conta else None,
            'categoria_nome': self.categoria.nome if self.categoria else None,
            'conta_nome': self.conta.nome if self.conta else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
