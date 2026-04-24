from app import db
from datetime import datetime
from sqlalchemy.dialects.postgresql import UUID
import uuid

class Conta(db.Model):
    __tablename__ = 'conta'

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    nome = db.Column(db.String(120), nullable=False)
    tipo = db.Column(db.String(120), nullable=False) 
    descricao = db.Column(db.String(100), unique=True, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<Conta {self.nome} ({self.tipo})>"
    