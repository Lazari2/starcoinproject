from app import db
from datetime import datetime
from sqlalchemy.dialects.postgresql import UUID
import uuid

class MemberProfile(db.Model):
    __tablename__ = 'member_profile'

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'), nullable=False, unique=True)
    age = db.Column(db.Integer)
    weight = db.Column(db.Float)
    height = db.Column(db.Float)
    description = db.Column(db.String(120))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', foreign_keys=[user_id])

    def __repr__(self):
        return f'<MemberProfile {self.user_id}>'