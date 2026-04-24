from app import db
from app.models.user import User
from app.utils.jwt_utils import generate_jwt
from app.models.memberProfile import MemberProfile
from werkzeug.security import generate_password_hash, check_password_hash
from app.utils.exceptions import AppError, UserAlreadyExistsError, InvalidCredentialsError

class AuthService:

    @staticmethod
    def register_user(username, email, password, confirm_password):
        if password != confirm_password:
            raise InvalidCredentialsError("Passwords do not match.") 
        
        if User.query.filter_by(username=username).first():
            raise UserAlreadyExistsError("Username already exists.")
        if User.query.filter_by(email=email).first():
            raise UserAlreadyExistsError("Email already exists.")

        user = User(username=username, email=email)
        user.set_password(password)
        db.session.add(user)

        db.session.flush()

        new_profile = MemberProfile(
            id=user.id, 
            user_id=user.id
        )
        db.session.add(new_profile)
        try:
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            print(f"Erro ao registrar usuário e perfil: {e}")
            raise AppError("Erro ao criar conta.", 500)
            
        return user

    @staticmethod
    def login_user(email, password):
        user = User.query.filter_by(email=email).first()
        if not user or not user.check_password(password):
            raise ValueError("Invalid email or password.")

        token = generate_jwt(user.id)
        return token