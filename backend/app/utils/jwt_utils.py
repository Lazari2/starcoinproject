from flask_jwt_extended import create_access_token, decode_token
from datetime import timedelta

def generate_jwt(identity):
    expires = timedelta(hours=2)
    return create_access_token(identity=identity, expires_delta=expires)