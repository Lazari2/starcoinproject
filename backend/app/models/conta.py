from app import db
from datetime import datetime
from sqlalchemy.dialects.postgresql import UUID
import uuid

class Conta(db.Model):
    __tablename__ = 'conta'

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'), nullable=False)
    nome = db.Column(db.String(120), nullable=False)
    tipo = db.Column(db.String(50), nullable=False)  # 'corrente', 'poupanca', 'carteira', etc.
    descricao = db.Column(db.String(200), nullable=True)
    saldo = db.Column(db.Float, default=0.0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relacionamentos
    despesas = db.relationship('Despesas', backref='conta', lazy='dynamic')
    receitas = db.relationship('Receitas', backref='conta', lazy='dynamic')

    def __repr__(self):
        return f"<Conta {self.nome} ({self.tipo})>"

    def to_dict(self):
        return {
            'id': str(self.id),
            'user_id': str(self.user_id),
            'nome': self.nome,
            'tipo': self.tipo,
            'descricao': self.descricao,
            'saldo': self.saldo,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
