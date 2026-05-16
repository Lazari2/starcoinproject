# Star Coin Manager

Aplicação de gestão financeira pessoal com controle de receitas, despesas, metas e limites por categoria.

## Tecnologias

| Camada | Stack |
|--------|-------|
| Frontend | React 18, TypeScript, Vite, TailwindCSS, shadcn/ui |
| Backend | Python, Flask, SQLAlchemy, Flask-Migrate, Flask-JWT-Extended |
| Banco de dados | PostgreSQL 15 |
| Infra | Docker, Docker Compose |

## Estrutura do projeto

```
Star Coin Manager/
├── backend/   # API REST em Flask
└── frontend/  # Aplicação React
```

## Início rápido

### Pré-requisitos

- [Docker](https://www.docker.com/) e Docker Compose
- [Node.js](https://nodejs.org/) 18+
- Python 3.11+

### 1. Backend

```bash
cd backend

# Copiar e preencher as variáveis de ambiente
cp .env.example .env

# Subir o banco de dados
docker-compose up -d db

# Criar e ativar o ambiente virtual
python -m venv .venv
source .venv/bin/activate  # Linux/Mac
.venv\Scripts\Activate.ps1  # Windows

# Instalar dependências
pip install -r requirements.txt

# Aplicar migrations
flask db upgrade

# Iniciar o servidor (desenvolvimento)
python run.py
```

### 2. Frontend

```bash
cd frontend

# Copiar e preencher as variáveis de ambiente
cp .env.example .env

# Instalar dependências
npm install

# Iniciar o servidor de desenvolvimento
npm run dev
```

Acesse: [http://localhost:8080](http://localhost:8080)

## Documentação detalhada

- [Backend — API e configuração](backend/README.md)
- [Frontend — Interface e componentes](frontend/README.md)
