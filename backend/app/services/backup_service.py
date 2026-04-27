from app.models.user import User
from app.models.categoria import Categoria
from app.models.conta import Conta
from app.models.receitas import Receitas
from app.models.despesas import Despesas
from app.models.meta import Meta
from app.models.limite_categoria import LimiteCategoria
from datetime import datetime


class BackupService:

    @staticmethod
    def gerar_backup(user_id):
        """Gera um backup completo dos dados do usuário em formato JSON"""
        user = User.query.get(user_id)
        if not user:
            raise ValueError("Usuário não encontrado.")

        categorias = Categoria.query.filter_by(user_id=user_id).all()
        contas = Conta.query.filter_by(user_id=user_id).all()
        receitas = Receitas.query.filter_by(user_id=user_id).all()
        despesas = Despesas.query.filter_by(user_id=user_id).all()
        metas = Meta.query.filter_by(user_id=user_id).all()
        limites = LimiteCategoria.query.filter_by(user_id=user_id).all()

        backup = {
            'backup_info': {
                'gerado_em': datetime.utcnow().isoformat(),
                'usuario': user.username,
                'email': user.email
            },
            'categorias': [c.to_dict() for c in categorias],
            'contas': [c.to_dict() for c in contas],
            'receitas': [r.to_dict() for r in receitas],
            'despesas': [d.to_dict() for d in despesas],
            'metas': [m.to_dict() for m in metas],
            'limites_categoria': [l.to_dict() for l in limites],
            'totais': {
                'categorias': len(categorias),
                'contas': len(contas),
                'receitas': len(receitas),
                'despesas': len(despesas),
                'metas': len(metas),
                'limites': len(limites)
            }
        }

        return backup
