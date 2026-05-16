"""
Script de seed para popular o banco Neon com dados de teste.
Execute: python seed.py
"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from datetime import date, datetime
from app import create_app, db
from app.models.user import User
from app.models.categoria import Categoria
from app.models.conta import Conta
from app.models.receitas import Receitas
from app.models.despesas import Despesas
from app.models.meta import Meta
from app.models.limite_categoria import LimiteCategoria
from app.models.memberProfile import MemberProfile

app = create_app()

def limpar_banco():
    with app.app_context():
        print("Limpando dados existentes...")
        LimiteCategoria.query.delete()
        Meta.query.delete()
        Despesas.query.delete()
        Receitas.query.delete()
        Conta.query.delete()
        Categoria.query.delete()
        MemberProfile.query.delete()
        User.query.delete()
        db.session.commit()
        print("Banco limpo.")

def seed():
    with app.app_context():
        print("Inserindo dados de teste...\n")

        # ── Usuários ────────────────────────────────────────────────────
        u1 = User(username="joao_silva", email="joao@exemplo.com")
        u1.set_password("senha123")

        u2 = User(username="maria_souza", email="maria@exemplo.com")
        u2.set_password("senha123")

        u3 = User(username="carlos_lima", email="carlos@exemplo.com")
        u3.set_password("senha123")

        db.session.add_all([u1, u2, u3])
        db.session.flush()
        print(f"Usuários: {u1.username}, {u2.username}, {u3.username}")

        # ── Perfis ──────────────────────────────────────────────────────
        db.session.add_all([
            MemberProfile(user_id=u1.id, age=28, weight=75.0, height=1.78, description="Desenvolvedor"),
            MemberProfile(user_id=u2.id, age=32, weight=60.0, height=1.65, description="Designer"),
            MemberProfile(user_id=u3.id, age=24, weight=80.0, height=1.82, description="Estudante"),
        ])
        db.session.flush()
        print("Perfis inseridos.")

        # ── Categorias ──────────────────────────────────────────────────
        cats_u1_receita = [
            Categoria(user_id=u1.id, nome="Salário",       tipo="receita", descricao="Renda mensal"),
            Categoria(user_id=u1.id, nome="Freelance",     tipo="receita", descricao="Trabalhos extras"),
            Categoria(user_id=u1.id, nome="Investimentos", tipo="receita", descricao="Dividendos e rendimentos"),
        ]
        cats_u1_despesa = [
            Categoria(user_id=u1.id, nome="Alimentação",   tipo="despesa", descricao="Supermercado e restaurantes"),
            Categoria(user_id=u1.id, nome="Transporte",    tipo="despesa", descricao="Combustível e transporte público"),
            Categoria(user_id=u1.id, nome="Moradia",       tipo="despesa", descricao="Aluguel e condomínio"),
            Categoria(user_id=u1.id, nome="Lazer",         tipo="despesa", descricao="Entretenimento e hobbies"),
            Categoria(user_id=u1.id, nome="Saúde",         tipo="despesa", descricao="Plano de saúde e farmácia"),
        ]

        cats_u2_receita = [
            Categoria(user_id=u2.id, nome="Salário",   tipo="receita"),
            Categoria(user_id=u2.id, nome="Aluguéis",  tipo="receita", descricao="Imóveis alugados"),
        ]
        cats_u2_despesa = [
            Categoria(user_id=u2.id, nome="Alimentação", tipo="despesa"),
            Categoria(user_id=u2.id, nome="Educação",    tipo="despesa", descricao="Cursos e livros"),
            Categoria(user_id=u2.id, nome="Vestuário",   tipo="despesa"),
        ]

        cats_u3_receita = [
            Categoria(user_id=u3.id, nome="Bolsa de Estudos", tipo="receita"),
            Categoria(user_id=u3.id, nome="Freelance",        tipo="receita"),
        ]
        cats_u3_despesa = [
            Categoria(user_id=u3.id, nome="Alimentação", tipo="despesa"),
            Categoria(user_id=u3.id, nome="Transporte",  tipo="despesa"),
            Categoria(user_id=u3.id, nome="Lazer",       tipo="despesa"),
        ]

        all_cats = (cats_u1_receita + cats_u1_despesa +
                    cats_u2_receita + cats_u2_despesa +
                    cats_u3_receita + cats_u3_despesa)
        db.session.add_all(all_cats)
        db.session.flush()
        print(f"Categorias inseridas: {len(all_cats)}")

        # ── Contas ──────────────────────────────────────────────────────
        contas_u1 = [
            Conta(user_id=u1.id, nome="Conta Corrente Itaú",    tipo="corrente",  saldo=3500.00),
            Conta(user_id=u1.id, nome="Poupança Itaú",          tipo="poupanca",  saldo=12000.00),
            Conta(user_id=u1.id, nome="Carteira",               tipo="carteira",  saldo=250.00),
        ]
        contas_u2 = [
            Conta(user_id=u2.id, nome="Conta Corrente Bradesco", tipo="corrente", saldo=5200.00),
            Conta(user_id=u2.id, nome="Investimentos XP",        tipo="investimento", saldo=45000.00),
        ]
        contas_u3 = [
            Conta(user_id=u3.id, nome="Nubank",   tipo="corrente", saldo=800.00),
            Conta(user_id=u3.id, nome="Carteira", tipo="carteira", saldo=120.00),
        ]
        all_contas = contas_u1 + contas_u2 + contas_u3
        db.session.add_all(all_contas)
        db.session.flush()
        print(f"Contas inseridas: {len(all_contas)}")

        # Atalhos para IDs
        c1_corrente, c1_poupanca, c1_carteira = contas_u1
        c2_corrente, c2_invest = contas_u2
        c3_nubank, c3_carteira = contas_u3

        cat1_sal, cat1_free, cat1_inv = cats_u1_receita
        cat1_ali, cat1_tra, cat1_mor, cat1_laz, cat1_sau = cats_u1_despesa
        cat2_sal, cat2_alug = cats_u2_receita
        cat2_ali, cat2_edu, cat2_ves = cats_u2_despesa
        cat3_bol, cat3_free = cats_u3_receita
        cat3_ali, cat3_tra, cat3_laz = cats_u3_despesa

        # ── Receitas ────────────────────────────────────────────────────
        receitas = [
            # João - Jan a Mai 2025
            Receitas(user_id=u1.id, descricao="Salário Janeiro",    valor=6500.00, data=date(2025, 1, 5),  id_categoria=cat1_sal.id,  id_conta=c1_corrente.id),
            Receitas(user_id=u1.id, descricao="Salário Fevereiro",  valor=6500.00, data=date(2025, 2, 5),  id_categoria=cat1_sal.id,  id_conta=c1_corrente.id),
            Receitas(user_id=u1.id, descricao="Salário Março",      valor=6500.00, data=date(2025, 3, 5),  id_categoria=cat1_sal.id,  id_conta=c1_corrente.id),
            Receitas(user_id=u1.id, descricao="Salário Abril",      valor=6500.00, data=date(2025, 4, 5),  id_categoria=cat1_sal.id,  id_conta=c1_corrente.id),
            Receitas(user_id=u1.id, descricao="Salário Maio",       valor=6800.00, data=date(2025, 5, 5),  id_categoria=cat1_sal.id,  id_conta=c1_corrente.id),
            Receitas(user_id=u1.id, descricao="Projeto site React", valor=1800.00, data=date(2025, 2, 18), id_categoria=cat1_free.id, id_conta=c1_corrente.id),
            Receitas(user_id=u1.id, descricao="API mobile app",     valor=2200.00, data=date(2025, 4, 22), id_categoria=cat1_free.id, id_conta=c1_corrente.id),
            Receitas(user_id=u1.id, descricao="Dividendos FIIs",    valor=320.00,  data=date(2025, 3, 15), id_categoria=cat1_inv.id,  id_conta=c1_poupanca.id),
            Receitas(user_id=u1.id, descricao="Dividendos FIIs",    valor=340.00,  data=date(2025, 4, 15), id_categoria=cat1_inv.id,  id_conta=c1_poupanca.id),

            # Maria
            Receitas(user_id=u2.id, descricao="Salário Janeiro",    valor=9000.00, data=date(2025, 1, 5),  id_categoria=cat2_sal.id,  id_conta=c2_corrente.id),
            Receitas(user_id=u2.id, descricao="Salário Fevereiro",  valor=9000.00, data=date(2025, 2, 5),  id_categoria=cat2_sal.id,  id_conta=c2_corrente.id),
            Receitas(user_id=u2.id, descricao="Salário Março",      valor=9000.00, data=date(2025, 3, 5),  id_categoria=cat2_sal.id,  id_conta=c2_corrente.id),
            Receitas(user_id=u2.id, descricao="Aluguel Apto Centro", valor=1800.00, data=date(2025, 1, 10), id_categoria=cat2_alug.id, id_conta=c2_corrente.id),
            Receitas(user_id=u2.id, descricao="Aluguel Apto Centro", valor=1800.00, data=date(2025, 2, 10), id_categoria=cat2_alug.id, id_conta=c2_corrente.id),
            Receitas(user_id=u2.id, descricao="Aluguel Apto Centro", valor=1800.00, data=date(2025, 3, 10), id_categoria=cat2_alug.id, id_conta=c2_corrente.id),

            # Carlos
            Receitas(user_id=u3.id, descricao="Bolsa FAPESP",       valor=2200.00, data=date(2025, 1, 1),  id_categoria=cat3_bol.id,  id_conta=c3_nubank.id),
            Receitas(user_id=u3.id, descricao="Bolsa FAPESP",       valor=2200.00, data=date(2025, 2, 1),  id_categoria=cat3_bol.id,  id_conta=c3_nubank.id),
            Receitas(user_id=u3.id, descricao="Bolsa FAPESP",       valor=2200.00, data=date(2025, 3, 1),  id_categoria=cat3_bol.id,  id_conta=c3_nubank.id),
            Receitas(user_id=u3.id, descricao="Design logo startup", valor=600.00,  data=date(2025, 2, 20), id_categoria=cat3_free.id, id_conta=c3_nubank.id),
            Receitas(user_id=u3.id, descricao="Edição de vídeo",    valor=450.00,  data=date(2025, 3, 25), id_categoria=cat3_free.id, id_conta=c3_nubank.id),
        ]
        db.session.add_all(receitas)
        db.session.flush()
        print(f"Receitas inseridas: {len(receitas)}")

        # ── Despesas ────────────────────────────────────────────────────
        despesas = [
            # João
            Despesas(user_id=u1.id, descricao="Supermercado Extra",     valor=480.00,  data=date(2025, 1, 8),  id_categoria=cat1_ali.id, id_conta=c1_corrente.id),
            Despesas(user_id=u1.id, descricao="iFood Janeiro",          valor=180.00,  data=date(2025, 1, 20), id_categoria=cat1_ali.id, id_conta=c1_corrente.id),
            Despesas(user_id=u1.id, descricao="Supermercado Extra",     valor=510.00,  data=date(2025, 2, 7),  id_categoria=cat1_ali.id, id_conta=c1_corrente.id),
            Despesas(user_id=u1.id, descricao="iFood Fevereiro",        valor=220.00,  data=date(2025, 2, 22), id_categoria=cat1_ali.id, id_conta=c1_corrente.id),
            Despesas(user_id=u1.id, descricao="Supermercado Março",     valor=490.00,  data=date(2025, 3, 6),  id_categoria=cat1_ali.id, id_conta=c1_corrente.id),
            Despesas(user_id=u1.id, descricao="Gasolina",               valor=250.00,  data=date(2025, 1, 15), id_categoria=cat1_tra.id, id_conta=c1_corrente.id),
            Despesas(user_id=u1.id, descricao="Uber Janeiro",           valor=90.00,   data=date(2025, 1, 25), id_categoria=cat1_tra.id, id_conta=c1_carteira.id),
            Despesas(user_id=u1.id, descricao="Gasolina Fevereiro",     valor=270.00,  data=date(2025, 2, 14), id_categoria=cat1_tra.id, id_conta=c1_corrente.id),
            Despesas(user_id=u1.id, descricao="Gasolina Março",         valor=260.00,  data=date(2025, 3, 12), id_categoria=cat1_tra.id, id_conta=c1_corrente.id),
            Despesas(user_id=u1.id, descricao="Aluguel Janeiro",        valor=1800.00, data=date(2025, 1, 5),  id_categoria=cat1_mor.id, id_conta=c1_corrente.id),
            Despesas(user_id=u1.id, descricao="Aluguel Fevereiro",      valor=1800.00, data=date(2025, 2, 5),  id_categoria=cat1_mor.id, id_conta=c1_corrente.id),
            Despesas(user_id=u1.id, descricao="Aluguel Março",          valor=1800.00, data=date(2025, 3, 5),  id_categoria=cat1_mor.id, id_conta=c1_corrente.id),
            Despesas(user_id=u1.id, descricao="Aluguel Abril",          valor=1800.00, data=date(2025, 4, 5),  id_categoria=cat1_mor.id, id_conta=c1_corrente.id),
            Despesas(user_id=u1.id, descricao="Condomínio",             valor=350.00,  data=date(2025, 1, 10), id_categoria=cat1_mor.id, id_conta=c1_corrente.id),
            Despesas(user_id=u1.id, descricao="Cinema + jantar",        valor=180.00,  data=date(2025, 1, 28), id_categoria=cat1_laz.id, id_conta=c1_carteira.id),
            Despesas(user_id=u1.id, descricao="Assinatura Netflix",     valor=45.00,   data=date(2025, 1, 1),  id_categoria=cat1_laz.id, id_conta=c1_corrente.id),
            Despesas(user_id=u1.id, descricao="Assinatura Netflix",     valor=45.00,   data=date(2025, 2, 1),  id_categoria=cat1_laz.id, id_conta=c1_corrente.id),
            Despesas(user_id=u1.id, descricao="Assinatura Netflix",     valor=45.00,   data=date(2025, 3, 1),  id_categoria=cat1_laz.id, id_conta=c1_corrente.id),
            Despesas(user_id=u1.id, descricao="Farmácia",               valor=120.00,  data=date(2025, 2, 10), id_categoria=cat1_sau.id, id_conta=c1_corrente.id),
            Despesas(user_id=u1.id, descricao="Plano de Saúde",        valor=280.00,  data=date(2025, 3, 1),  id_categoria=cat1_sau.id, id_conta=c1_corrente.id),

            # Maria
            Despesas(user_id=u2.id, descricao="Supermercado",           valor=650.00,  data=date(2025, 1, 9),  id_categoria=cat2_ali.id, id_conta=c2_corrente.id),
            Despesas(user_id=u2.id, descricao="Restaurante",            valor=320.00,  data=date(2025, 1, 18), id_categoria=cat2_ali.id, id_conta=c2_corrente.id),
            Despesas(user_id=u2.id, descricao="Supermercado",           valor=680.00,  data=date(2025, 2, 8),  id_categoria=cat2_ali.id, id_conta=c2_corrente.id),
            Despesas(user_id=u2.id, descricao="Curso UX Design",        valor=890.00,  data=date(2025, 1, 15), id_categoria=cat2_edu.id, id_conta=c2_corrente.id),
            Despesas(user_id=u2.id, descricao="Livros design",          valor=210.00,  data=date(2025, 2, 20), id_categoria=cat2_edu.id, id_conta=c2_corrente.id),
            Despesas(user_id=u2.id, descricao="Roupas Zara",            valor=480.00,  data=date(2025, 1, 22), id_categoria=cat2_ves.id, id_conta=c2_corrente.id),
            Despesas(user_id=u2.id, descricao="Calçados",               valor=320.00,  data=date(2025, 3, 10), id_categoria=cat2_ves.id, id_conta=c2_corrente.id),

            # Carlos
            Despesas(user_id=u3.id, descricao="RU Universitário",       valor=200.00,  data=date(2025, 1, 31), id_categoria=cat3_ali.id, id_conta=c3_nubank.id),
            Despesas(user_id=u3.id, descricao="Supermercado",           valor=280.00,  data=date(2025, 2, 28), id_categoria=cat3_ali.id, id_conta=c3_nubank.id),
            Despesas(user_id=u3.id, descricao="Supermercado",           valor=260.00,  data=date(2025, 3, 31), id_categoria=cat3_ali.id, id_conta=c3_nubank.id),
            Despesas(user_id=u3.id, descricao="Ônibus mensal",          valor=220.00,  data=date(2025, 1, 2),  id_categoria=cat3_tra.id, id_conta=c3_nubank.id),
            Despesas(user_id=u3.id, descricao="Ônibus mensal",          valor=220.00,  data=date(2025, 2, 2),  id_categoria=cat3_tra.id, id_conta=c3_nubank.id),
            Despesas(user_id=u3.id, descricao="Ônibus mensal",          valor=220.00,  data=date(2025, 3, 2),  id_categoria=cat3_tra.id, id_conta=c3_nubank.id),
            Despesas(user_id=u3.id, descricao="Spotify + shows",        valor=130.00,  data=date(2025, 1, 15), id_categoria=cat3_laz.id, id_conta=c3_carteira.id),
            Despesas(user_id=u3.id, descricao="Jogos Steam",            valor=95.00,   data=date(2025, 2, 14), id_categoria=cat3_laz.id, id_conta=c3_nubank.id),
        ]
        db.session.add_all(despesas)
        db.session.flush()
        print(f"Despesas inseridas: {len(despesas)}")

        # ── Metas ───────────────────────────────────────────────────────
        metas = [
            Meta(user_id=u1.id, titulo="Viagem para Europa",     descricao="Férias em Portugal e Espanha",  valor_alvo=15000.00, valor_atual=4500.00,  data_limite=date(2025, 12, 1), status="em_andamento"),
            Meta(user_id=u1.id, titulo="Reserva de emergência",  descricao="6 meses de despesas",           valor_alvo=20000.00, valor_atual=12000.00, data_limite=date(2025, 8, 1),  status="em_andamento"),
            Meta(user_id=u1.id, titulo="Notebook novo",          descricao="MacBook Pro M3",                valor_alvo=12000.00, valor_atual=12000.00, data_limite=date(2025, 3, 1),  status="concluida"),
            Meta(user_id=u2.id, titulo="Segundo imóvel",         descricao="Apartamento para investimento", valor_alvo=80000.00, valor_atual=45000.00, data_limite=date(2026, 6, 1),  status="em_andamento"),
            Meta(user_id=u2.id, titulo="Reforma apartamento",    descricao="Cozinha e banheiro",            valor_alvo=25000.00, valor_atual=8000.00,  data_limite=date(2025, 10, 1), status="em_andamento"),
            Meta(user_id=u3.id, titulo="Intercâmbio Canadá",     descricao="Curso de inglês 6 meses",       valor_alvo=18000.00, valor_atual=3200.00,  data_limite=date(2026, 1, 1),  status="em_andamento"),
            Meta(user_id=u3.id, titulo="Computador para estudos", descricao="PC gamer/trabalho",            valor_alvo=5000.00,  valor_atual=1200.00,  data_limite=date(2025, 9, 1),  status="em_andamento"),
        ]
        db.session.add_all(metas)
        db.session.flush()
        print(f"Metas inseridas: {len(metas)}")

        # ── Limites de Categoria ─────────────────────────────────────────
        limites = [
            # João - limites mensais 2025
            LimiteCategoria(user_id=u1.id, categoria_id=cat1_ali.id, valor_limite=600.00,  mes=1, ano=2025),
            LimiteCategoria(user_id=u1.id, categoria_id=cat1_ali.id, valor_limite=600.00,  mes=2, ano=2025),
            LimiteCategoria(user_id=u1.id, categoria_id=cat1_ali.id, valor_limite=600.00,  mes=3, ano=2025),
            LimiteCategoria(user_id=u1.id, categoria_id=cat1_tra.id, valor_limite=400.00,  mes=1, ano=2025),
            LimiteCategoria(user_id=u1.id, categoria_id=cat1_tra.id, valor_limite=400.00,  mes=2, ano=2025),
            LimiteCategoria(user_id=u1.id, categoria_id=cat1_tra.id, valor_limite=400.00,  mes=3, ano=2025),
            LimiteCategoria(user_id=u1.id, categoria_id=cat1_laz.id, valor_limite=300.00,  mes=1, ano=2025),
            LimiteCategoria(user_id=u1.id, categoria_id=cat1_laz.id, valor_limite=300.00,  mes=2, ano=2025),
            # Maria
            LimiteCategoria(user_id=u2.id, categoria_id=cat2_ali.id, valor_limite=800.00,  mes=1, ano=2025),
            LimiteCategoria(user_id=u2.id, categoria_id=cat2_ali.id, valor_limite=800.00,  mes=2, ano=2025),
            LimiteCategoria(user_id=u2.id, categoria_id=cat2_edu.id, valor_limite=1000.00, mes=1, ano=2025),
            LimiteCategoria(user_id=u2.id, categoria_id=cat2_ves.id, valor_limite=500.00,  mes=1, ano=2025),
            # Carlos
            LimiteCategoria(user_id=u3.id, categoria_id=cat3_ali.id, valor_limite=300.00,  mes=1, ano=2025),
            LimiteCategoria(user_id=u3.id, categoria_id=cat3_ali.id, valor_limite=300.00,  mes=2, ano=2025),
            LimiteCategoria(user_id=u3.id, categoria_id=cat3_ali.id, valor_limite=300.00,  mes=3, ano=2025),
            LimiteCategoria(user_id=u3.id, categoria_id=cat3_laz.id, valor_limite=150.00,  mes=1, ano=2025),
            LimiteCategoria(user_id=u3.id, categoria_id=cat3_laz.id, valor_limite=150.00,  mes=2, ano=2025),
        ]
        db.session.add_all(limites)
        db.session.commit()
        print(f"Limites de categoria inseridos: {len(limites)}")

        print("\nSeed concluído com sucesso!")
        print(f"  Usuários:    3  (senha: senha123)")
        print(f"  Perfis:      3")
        print(f"  Categorias:  {len(all_cats)}")
        print(f"  Contas:      {len(all_contas)}")
        print(f"  Receitas:    {len(receitas)}")
        print(f"  Despesas:    {len(despesas)}")
        print(f"  Metas:       {len(metas)}")
        print(f"  Limites:     {len(limites)}")


if __name__ == "__main__":
    modo = sys.argv[1] if len(sys.argv) > 1 else "seed"
    if modo == "limpar":
        limpar_banco()
    elif modo == "resetar":
        limpar_banco()
        seed()
    else:
        seed()
