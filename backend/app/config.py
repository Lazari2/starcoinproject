import os
from dotenv import load_dotenv

load_dotenv()

_db_url = os.getenv('DATABASE_URL')
if not _db_url:
    raise RuntimeError("DATABASE_URL nao configurada. Defina a variavel de ambiente DATABASE_URL.")

# Neon retorna URLs com 'postgresql://', psycopg2 exige 'postgresql+psycopg2://'
if _db_url.startswith('postgresql://'):
    _db_url = _db_url.replace('postgresql://', 'postgresql+psycopg2://', 1)

class Config:
    SQLALCHEMY_DATABASE_URI = _db_url
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    _jwt_secret = os.getenv('JWT_SECRET_KEY')
    if not _jwt_secret:
        raise RuntimeError("JWT_SECRET_KEY nao configurada. Defina a variavel de ambiente JWT_SECRET_KEY.")
    JWT_SECRET_KEY = _jwt_secret
