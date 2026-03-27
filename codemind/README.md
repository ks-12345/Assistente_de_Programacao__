# 🧠 CodeMind

> Assistente de programação com IA, construído com Flask + Gemini API.

![Python](https://img.shields.io/badge/Python-3.10+-blue?logo=python)
![Flask](https://img.shields.io/badge/Flask-3.x-black?logo=flask)
![Gemini](https://img.shields.io/badge/Gemini-2.5--Flash-orange?logo=google)

---

## 📋 Sobre o Projeto

O **CodeMind** é uma aplicação web de chat com inteligência artificial focada em programação. O usuário faz login, escolhe um modo de IA (debug, explicar, gerar código, etc.) e conversa com o modelo Gemini 2.5 Flash diretamente pelo navegador.

A API Key do Gemini fica configurada no servidor via `.env`, sem necessidade de o usuário inserir nenhuma chave.

---

## ✨ Funcionalidades

- 🔐 **Autenticação** — cadastro e login com e-mail e senha
- 💬 **Chat em tempo real** com histórico de conversa por sessão
- 🎛️ **7 modos de IA** especializados:
  - **Geral** — assistente geral de programação
  - **Debug** — analisa e corrige bugs
  - **Explicar** — explica código linha a linha
  - **Gerar** — gera código a partir de descrição
  - **Revisar** — avalia qualidade e boas práticas
  - **SQL** — auxilia com bancos de dados relacionais
  - **Git** — explica comandos e fluxos de versionamento
- 📋 **Cópia de código** com um clique
- 🗑️ **Limpar chat** sem recarregar a página

---

## 🛠️ Tecnologias

| Camada | Tecnologia |
|---|---|
| Backend | Python 3, Flask |
| IA | Google Gemini 2.5 Flash |
| Frontend | HTML, CSS, JavaScript puro |
| Autenticação | Flask Session |
| Dados de usuários | JSON local (`users.json`) |
| Variáveis de ambiente | python-dotenv |

---

## 📁 Estrutura do Projeto

```
codemind/
├── app.py                  # Servidor Flask e rotas
├── .env                    # Variáveis de ambiente (não versionar)
├── .env.example            # Exemplo de configuração
├── users.json              # Banco de dados de usuários (auto-gerado)
├── requirements.txt        # Dependências Python
├── templates/
│   ├── base.html           # Layout base
│   ├── index.html          # Página principal do chat
│   ├── login.html          # Página de login
│   └── cadastro.html       # Página de cadastro
└── static/
    ├── css/
    │   └── style.css       # Estilos da aplicação
    └── js/
        └── script.js       # Lógica do frontend
```

---

## 🚀 Como Rodar

### Pré-requisitos

- Python 3.10 ou superior
- Uma chave de API do Google Gemini ([obter gratuitamente](https://aistudio.google.com/app/apikey))

### Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/codemind.git
cd codemind

# 2. Crie e ative o ambiente virtual
python -m venv venv
source venv/bin/activate      # Linux/macOS
venv\Scripts\activate         # Windows

# 3. Instale as dependências
pip install -r requirements.txt

# 4. Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env e insira sua API Key
```

### Configuração do `.env`

```env
API_KEY=sua_chave_gemini_aqui
SECRET_KEY=uma_string_secreta_aleatoria
```

### Executar

```bash
python app.py
```

Acesse em: **http://localhost:5000**

---

## 📦 Dependências

```txt
flask
requests
python-dotenv
```

Instale com:

```bash
pip install flask requests python-dotenv
```

Ou gere o `requirements.txt`:

```bash
pip freeze > requirements.txt
```

---

## 🔒 Segurança

- A API Key **nunca é exposta ao frontend** — toda comunicação com o Gemini passa pelo backend
- As senhas são armazenadas em texto plano no `users.json` — para produção, recomenda-se usar hash (ex: `bcrypt`) e um banco de dados real
- O `users.json` e o `.env` **não devem ser versionados** — adicione ao `.gitignore`

### `.gitignore` recomendado

```
.env
users.json
venv/
__pycache__/
*.pyc 
```

---

## 🗺️ Próximos Passos (ideias)

- [ ] Hash de senhas com `bcrypt`
- [ ] Banco de dados (SQLite ou PostgreSQL) no lugar do `users.json`
- [ ] Histórico de conversas persistente por usuário
- [ ] Suporte a upload de arquivos de código
- [ ] Deploy no Railway, Render ou Fly.io

---

## 📄 Licença

Este projeto está sob a licença MIT. Sinta-se livre para usar, modificar e distribuir.