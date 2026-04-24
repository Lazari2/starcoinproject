class AppError(Exception):
    def __init__(self, message, status_code=500):
        super().__init__(message)
        self.message = message
        self.status_code = status_code

class UserAlreadyExistsError(AppError):
    def __init__(self, message="Usuário ou email já existe.", status_code=409):
        super().__init__(message, status_code)

class InvalidCredentialsError(AppError):
    def __init__(self, message="Email ou senha inválidos.", status_code=401):
        super().__init__(message, status_code)