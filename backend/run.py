from app import create_app, db
from app.models.user import User
from app.models.memberProfile import MemberProfile
from app.models.conta import Conta
from app.models.despesas import Despesas
from app.models.receitas import Receitas

app = create_app()

@app.shell_context_processor
def make_shell_context():
    return {
        'app': app,
        'db': db,
        'User': User,
        'MemberProfile': MemberProfile,
        'Receitas': Receitas,
        'Despesas': Despesas,
        'Conta': Conta,
        'Despesas': Despesas
        }

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)