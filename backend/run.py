from app import create_app, db
from app.models.user import User
from app.models.categoria import Categoria
from app.models.conta import Conta
from app.models.despesas import Despesas
from app.models.receitas import Receitas
from app.models.meta import Meta
from app.models.limite_categoria import LimiteCategoria

app = create_app()

@app.shell_context_processor
def make_shell_context():
    return {
        'app': app,
        'db': db,
        'User': User,
        'Categoria': Categoria,
        'Conta': Conta,
        'Receitas': Receitas,
        'Despesas': Despesas,
        'Meta': Meta,
        'LimiteCategoria': LimiteCategoria
    }

if __name__ == '__main__':
    import os
    debug = os.getenv('FLASK_DEBUG', 'false').lower() == 'true'
    app.run(debug=debug, host='0.0.0.0', port=5000)
