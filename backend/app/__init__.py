from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate

db = SQLAlchemy()
jwt = JWTManager()
migrate = Migrate()

def create_app(): 
    app = Flask(__name__)
    app.config.from_object('app.config.Config') 
    
    db.init_app(app)
    jwt.init_app(app) 
    migrate.init_app(app, db)
    
    with app.app_context():
        from .routes.auth_routes import auth_bp
    #Blueprints
        app.register_blueprint(auth_bp)

    return app