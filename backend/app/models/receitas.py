from app import db
from datetime import datetime
from sqlalchemy.dialects.postgresql import UUID
import uuid

class Receitas(db.Model):
    __tablename__ = 'receitas'

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    descricao = db.Column(db.String(100), unique=True, nullable=True)
    valor= db.Column(db.Float, nullable= False)
    data = db.Column(db.Date, nullable = False)
    id_categoria = db.Column(UUID(as_uuid=True), db.ForeignKey('categoria.id'))
    id_conta = db.Column(UUID(as_uuid =True), db.ForeignKey('conta.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow)

    conta = db.relationship('Conta', foreign_keys=[id_conta])
    categoria = db.relationship('Categoria', foreign_keys=[id_categoria])
    def to_dict(self):
        return {
            'id': str(self.id),
            'descricao': self.descricao,
            'valor': self.valor
        }