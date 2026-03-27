import os
import json
import requests
from flask import Flask, request, jsonify, session, redirect, url_for, render_template
from dotenv import load_dotenv

# ── CONFIG ──
# Garante que o .env é carregado do diretório correto, com override
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '.env'), override=True)

app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY", "super_secret_key")

API_KEY = os.getenv("API_KEY")

# Validação na inicialização — falha rápido se a chave não foi carregada
if not API_KEY:
    raise RuntimeError("API_KEY não encontrada! Verifique seu arquivo .env")
USERS_FILE = 'users.json'

# ── FUNÇÕES ──
def load_users():
    if os.path.exists(USERS_FILE):
        with open(USERS_FILE, 'r') as f:
            return json.load(f)
    return {}

def save_users(users):
    with open(USERS_FILE, 'w') as f:
        json.dump(users, f)

# ── ROTAS ──

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/')
def index():
    if 'email' not in session:
        return redirect(url_for('login'))
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        senha = request.form.get('senha')
        users = load_users()

        if email in users and users[email] == senha:
            session['email'] = email
            return redirect(url_for('index'))
        else:
            return render_template('login.html', erro='Login inválido')

    return render_template('login.html')

@app.route('/cadastro', methods=['GET', 'POST'])
def cadastro():
    if request.method == 'POST':
        email = request.form.get('email')
        senha = request.form.get('senha')
        repsenha = request.form.get('confirmarSenha')

        if senha != repsenha:
            return render_template('cadastro.html', erro='Senhas não coincidem')

        users = load_users()

        if email in users:
            return render_template('cadastro.html', erro='Usuário já existe')

        users[email] = senha
        save_users(users)

        return redirect(url_for('login'))

    return render_template('cadastro.html')


@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))

# ── API IA ──

@app.route('/api/chat', methods=['POST'])
def chat():
    if 'email' not in session:
        return jsonify({'error': 'Não autorizado'}), 401

    data = request.get_json()
    contents = data.get('contents')

    try:
        resp = requests.post(
            f'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={API_KEY}',
            json={'contents': contents}
        )
        return jsonify(resp.json())
    except Exception as e:
        return jsonify({'error': str(e)})

# ── START ──

if __name__ == '__main__':
    app.run(debug=True)