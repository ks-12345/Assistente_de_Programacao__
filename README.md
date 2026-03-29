# 🤖 Pip.IA — Assistente de Programação com IA

## 📌 Sobre este projeto

O **Pip.IA** é uma aplicação web construída em **Flask** que oferece um assistente de programação com inteligência artificial usando a API do **Google Gemini 2.5 Flash**.

O usuário faz cadastro/login, acessa um chat protegido por sessão e interage com o modelo para:
- depurar código,
- gerar trechos de código,
- explicar algoritmos,
- revisar código,
- tirar dúvidas sobre SQL e Git.

## ✨ Funcionalidades principais

- 🔐 Autenticação com cadastro e login
- 💬 Chat com IA para programação
- 🧠 Múltiplos modos de assistência (debug, explicar, gerar, revisar, SQL, Git)
- 📋 Cópia de texto com um clique
- 🗑️ Limpeza de chat sem recarregar a página
- 🔒 Chave de API armazenada no backend via `.env`

## 🛠️ Tecnologias utilizadas

- Python 3.10+
- Flask
- Requests
- python-dotenv
- HTML, CSS e JavaScript puro
- Google Gemini API

## 📁 Estrutura do projeto

```
codemind/
├── app.py
├── .env
├── users.json
├── requirements.txt
├── templates/
│   ├── base.html
│   ├── cadastro.html
│   ├── home.html
│   ├── index.html
│   └── login.html
└── static/
    ├── css/
    │   └── style.css
    └── js/
        └── script.js
```

> Observação: se você estiver editando a partir da raiz do repositório, entre na pasta `codemind/` antes de executar o projeto.

## 🚀 Como executar

### 1. Navegue para o diretório do projeto

```bash
cd codemind
```

### 2. Crie e ative um ambiente virtual

```bash
python -m venv venv
venv\Scripts\activate
```

### 3. Instale as dependências

```bash
pip install -r requirements.txt
```

### 4. Crie o arquivo `.env`

No diretório `codemind/`, crie um arquivo `.env` com o conteúdo:

```env
API_KEY=sua_chave_gemini_aqui
SECRET_KEY=uma_string_secreta
```

### 5. Execute o projeto

```bash
python app.py
```

A aplicação estará disponível em:

```
http://localhost:5000
```

## ✅ Dependências

```txt
flask>=3.0.0
requests>=2.31.0
python-dotenv>=1.0.0
```

## 🔒 Segurança

- A chave do Gemini deve ser mantida no arquivo `.env` do backend.
- Nunca exponha o `.env` no repositório.
- As senhas são armazenadas em texto simples no `users.json`; para produção, use hashing seguro (como `bcrypt`) e um banco de dados real.

## 🗒️ Observações

- O arquivo `users.json` é usado como armazenamento local de usuários.
- O app exige que `API_KEY` esteja presente no `.env` ou não iniciará.

## 📌 Sugestões de melhoria

- Hash de senha com `bcrypt`
- Persistência de histórico de conversas por usuário
- Banco de dados SQLite ou PostgreSQL
- Deploy em um serviço de nuvem

---

## 👨‍💻 Autor

Projeto desenvolvido como assistente de programação com IA.