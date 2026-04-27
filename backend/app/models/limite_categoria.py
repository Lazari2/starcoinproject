from app import db
from datetime import datetime
from sqlalchemy.dialects.postgresql import UUID
import uuid


class LimiteCategoria(db.Model):
    __tablename__ = 'limites_categoria'

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'), nullable=False)
    categoria_id = db.Column(UUID(as_uuid=True), db.ForeignKey('categoria.id'), nullable=False)
    valor_limite = db.Column(db.Float, nullable=False)
    mes = db.Column(db.Integer, nullable=False)  
    ano = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    __table_args__ = (
        db.UniqueConstraint('user_id', 'categoria_id', 'mes', 'ano', name='uq_limite_user_cat_mes_ano'),
    )

    def __repr__(self):
        return f"<LimiteCategoria cat={self.categoria_id} limite=R${self.valor_limite} {self.mes}/{self.ano}>"

    def to_dict(self):
        return {
            'id': str(self.id),
            'user_id': str(self.user_id),
            'categoria_id': str(self.categoria_id),
            'categoria_nome': self.categoria.nome if self.categoria else None,
            'valor_limite': self.valor_limite,
            'mes': self.mes,
            'ano': self.ano,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
