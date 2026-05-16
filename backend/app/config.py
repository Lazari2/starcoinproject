import os
from dotenv import load_dotenv

load_dotenv()

class Config:

    SQLALCHEMY_DATABASE_URI = os.getenv(
        'DATABASE_URL',
        "postgresql+psycopg2://{user}:{pw}@{host}:{port}/{db}".format(
            user=os.getenv('POSTGRES_USER'),
            pw=os.getenv('POSTGRES_PASSWORD'),
            host=os.getenv('POSTGRES_HOST', 'localhost'),
            port=os.getenv('POSTGRES_PORT', '5432'),
            db=os.getenv('POSTGRES_DB'),
        )
    )

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'fallback-secret-key')
