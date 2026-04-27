from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.backup_service import BackupService

backup_bp = Blueprint('backup', __name__, url_prefix='/api/backup')


@backup_bp.route('', methods=['GET'])
@jwt_required()
def gerar_backup():
    """Gera e retorna backup completo dos dados do usuário em JSON"""
    user_id = get_jwt_identity()

    try:
        backup = BackupService.gerar_backup(user_id)
        return jsonify(backup), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
