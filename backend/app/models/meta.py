from app import db
from datetime import datetime
from sqlalchemy.dialects.postgresql import UUID
import uuid


class Meta(db.Model):
    __tablename__ = 'metas'

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'), nullable=False)
    titulo = db.Column(db.String(150), nullable=False)
    descricao = db.Column(db.String(300), nullable=True)
    valor_alvo = db.Column(db.Float, nullable=False)
    valor_atual = db.Column(db.Float, default=0.0)
    data_limite = db.Column(db.Date, nullable=True)
    status = db.Column(db.String(20), default='em_andamento')  # 'em_andamento', 'concluida', 'cancelada'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<Meta {self.titulo} - {self.status}>"

    def to_dict(self):
        return {
            'id': str(self.id),
            'user_id': str(self.user_id),
            'titulo': self.titulo,
            'descricao': self.descricao,
            'valor_alvo': self.valor_alvo,
            'valor_atual': self.valor_atual,
            'data_limite': self.data_limite.isoformat() if self.data_limite else None,
            'status': self.status,
            'progresso': round((self.valor_atual / self.valor_alvo * 100), 2) if self.valor_alvo > 0 else 0,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
