# Star Coin Manager — Backend

API REST construída com Flask e PostgreSQL para gerenciamento financeiro pessoal.

## Tecnologias

- **Python 3.11**
- **Flask 3.0** — framework web
- **SQLAlchemy** — ORM
- **Flask-Migrate** — migrações de banco
- **Flask-JWT-Extended** — autenticação via token JWT
- **PostgreSQL 15** — banco de dados
- **psycopg2** — driver de conexão

## Configuração

### Variáveis de ambiente

Copie `.env.example` para `.env` e preencha:

```env
POSTGRES_USER=seu_usuario
POSTGRES_PASSWORD=sua_senha
POSTGRES_DB=starcoin
POSTGRES_HOST=localhost
POSTGRES_PORT=5433
JWT_SECRET_KEY=chave-secreta-longa-e-aleatoria
FLASK_DEBUG=false
```

### Instalação

```bash
# Ambiente virtual
python -m venv .venv
.venv\Scripts\Activate.ps1      # Windows
source .venv/bin/activate        # Linux/Mac

# Dependências
pip install -r requirements.txt

# Banco de dados (Docker)
docker-compose up -d db

# Migrations
flask db upgrade

# Servidor de desenvolvimento
python run.py
```

### Produção (Docker Compose completo)

```bash
docker-compose up -d
```

Sobe o banco e o backend juntos. Aplicar migrations manualmente após o primeiro deploy:

```bash
docker-compose exec backend flask db upgrade
```

## Endpoints da API

### Autenticação — `/api/auth`

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/auth/register` | Cadastrar novo usuário |
| POST | `/api/auth/login` | Login e obtenção do token JWT |
| GET | `/api/auth/me` | Dados do usuário autenticado |

> Todas as rotas abaixo exigem o header: `Authorization: Bearer <token>`

### Categorias — `/api/categorias`

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/categorias` | Listar categorias (filtro: `?tipo=receita\|despesa`) |
| POST | `/api/categorias` | Criar categoria |
| PUT | `/api/categorias/<id>` | Atualizar categoria |
| DELETE | `/api/categorias/<id>` | Excluir categoria |

### Contas — `/api/contas`

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/contas` | Listar contas |
| POST | `/api/contas` | Criar conta |
| PUT | `/api/contas/<id>` | Atualizar conta |
| DELETE | `/api/contas/<id>` | Excluir conta |

### Receitas — `/api/receitas`

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/receitas` | Listar (filtros: `?mes=&ano=`) |
| POST | `/api/receitas` | Criar receita |
| PUT | `/api/receitas/<id>` | Atualizar |
| DELETE | `/api/receitas/<id>` | Excluir |

### Despesas — `/api/despesas`

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/despesas` | Listar (filtros: `?mes=&ano=`) |
| POST | `/api/despesas` | Criar despesa |
| PUT | `/api/despesas/<id>` | Atualizar |
| DELETE | `/api/despesas/<id>` | Excluir |

### Metas — `/api/metas`

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/metas` | Listar metas |
| POST | `/api/metas` | Criar meta |
| PUT | `/api/metas/<id>` | Atualizar |
| DELETE | `/api/metas/<id>` | Excluir |

### Limites — `/api/limites`

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/limites` | Listar limites (filtros: `?mes=&ano=`) |
| GET | `/api/limites/verificar` | Limites com gastos e percentual do mês |
| POST | `/api/limites` | Criar limite |
| PUT | `/api/limites/<id>` | Atualizar |
| DELETE | `/api/limites/<id>` | Excluir |

### Dashboard — `/api/dashboard`

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/dashboard/resumo` | Totais do mês (receitas, despesas, saldo) |
| GET | `/api/dashboard/despesas-por-categoria` | Gastos agrupados por categoria |
| GET | `/api/dashboard/evolucao-mensal` | Evolução dos últimos 12 meses |

### Backup — `/api/backup`

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/backup` | Exportar todos os dados do usuário em JSON |
