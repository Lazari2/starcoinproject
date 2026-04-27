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
    CORS(app)
    
    with app.app_context():
        # Import models para o migrate detectar
        from app.models import User, Categoria, Conta, Despesas, Receitas, Meta, LimiteCategoria

        # Import e registro dos Blueprints
        from .routes.auth_routes import auth_bp
        from .routes.categoria_routes import categoria_bp
        from .routes.conta_routes import conta_bp
        from .routes.receita_routes import receita_bp
        from .routes.despesa_routes import despesa_bp
        from .routes.meta_routes import meta_bp
        from .routes.limite_routes import limite_bp
        from .routes.dashboard_routes import dashboard_bp
        from .routes.backup_routes import backup_bp

        app.register_blueprint(auth_bp)
        app.register_blueprint(categoria_bp)
        app.register_blueprint(conta_bp)
        app.register_blueprint(receita_bp)
        app.register_blueprint(despesa_bp)
        app.register_blueprint(meta_bp)
        app.register_blueprint(limite_bp)
        app.register_blueprint(dashboard_bp)
        app.register_blueprint(backup_bp)

    return app
