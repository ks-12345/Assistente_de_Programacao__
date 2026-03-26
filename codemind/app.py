import os
from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

API_KEY = "AIzaSyAvFevopBuD6hramH3PMv956YHBiyPWRjs"  # 🔒 fixa no backend

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    contents = data.get('contents')

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={API_KEY}"

    response = requests.post(url, json={
        "contents": contents
    })

    return jsonify(response.json())

if __name__ == '__main__':
    app.run(debug=True)
# Arquivo simples para armazenar usuários
USERS_FILE = 'users.json'

def load_users():
    if os.path.exists(USERS_FILE):
        with open(USERS_FILE, 'r') as f:
            return json.load(f)
    return {}

def save_users(users):
    with open(USERS_FILE, 'w') as f:
        json.dump(users, f)

# ── ROTAS DE AUTENTICAÇÃO ──

@app.route('/')
def index():
    if 'email' not in session:
        return redirect(url_for('login'))
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email', '').strip()
        senha = request.form.get('senha', '').strip()
        users = load_users()

        if email in users and users[email] == senha:
            session['email'] = email
            return redirect(url_for('index'))
        else:
            return render_template('login.html', erro='E-mail ou senha incorretos!')

    return render_template('login.html')

@app.route('/cadastro', methods=['GET', 'POST'])
def cadastro():
    if request.method == 'POST':
        email    = request.form.get('email', '').strip()
        senha    = request.form.get('senha', '').strip()
        repsenha = request.form.get('confirmarSenha', '').strip()

        if not email or not senha or not repsenha:
            return render_template('cadastro.html', erro='Preencha todos os campos!')

        if senha != repsenha:
            return render_template('cadastro.html', erro='As senhas não coincidem!')

        users = load_users()
        if email in users:
            return render_template('cadastro.html', erro='Este e-mail já está cadastrado!')

        users[email] = senha
        save_users(users)
        return redirect(url_for('login') + '?sucesso=1')

    return render_template('cadastro.html')

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))

# ── ROTA DA IA (proxy para Gemini) ──

@app.route('/api/chat', methods=['POST'])
def chat():
    if 'email' not in session:
        return jsonify({'error': 'Não autorizado'}), 401

    data       = request.get_json()
    api_key    = data.get('apiKey')
    contents   = data.get('contents')

    if not api_key or not contents:
        return jsonify({'error': 'Dados inválidos'}), 400

    try:
        resp = requests.post(
            f'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}',
            json={'contents': contents},
            timeout=30
        )
        return jsonify(resp.json())
    except requests.exceptions.Timeout:
        return jsonify({'error': {'message': 'Tempo limite excedido. Tente novamente.'}}), 504
    except Exception as e:
        return jsonify({'error': {'message': str(e)}}), 500

if __name__ == '__main__':
    app.run(debug=True)
import os
import json
import requests
from flask import Flask, request, jsonify, session, redirect, url_for, render_template
from dotenv import load_dotenv

# ── CONFIG ──
load_dotenv()

app = Flask(__name__)
app.secret_key = 'super_secret_key'  # necessário para login

API_KEY = os.getenv("API_KEY")  # 🔒 chave segura

USERS_FILE = 'users.json'

# ── FUNÇÕES DE USUÁRIO ──

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
def index():
    if 'email' not in session:
        return redirect(url_for('login'))
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email', '').strip()
        senha = request.form.get('senha', '').strip()
        users = load_users()

        if email in users and users[email] == senha:
            session['email'] = email
            return redirect(url_for('index'))
        else:
            return render_template('login.html', erro='E-mail ou senha incorretos!')

    return render_template('login.html')

@app.route('/cadastro', methods=['GET', 'POST'])
def cadastro():
    if request.method == 'POST':
        email    = request.form.get('email', '').strip()
        senha    = request.form.get('senha', '').strip()
        repsenha = request.form.get('confirmarSenha', '').strip()

        if not email or not senha or not repsenha:
            return render_template('cadastro.html', erro='Preencha todos os campos!')

        if senha != repsenha:
            return render_template('cadastro.html', erro='As senhas não coincidem!')

        users = load_users()
        if email in users:
            return render_template('cadastro.html', erro='Este e-mail já está cadastrado!')

        users[email] = senha
        save_users(users)
        return redirect(url_for('login') + '?sucesso=1')

    return render_template('cadastro.html')

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))

# ── ROTA DA IA (SEGURA) ──

@app.route('/api/chat', methods=['POST'])
def chat():
    if 'email' not in session:
        return jsonify({'error': 'Não autorizado'}), 401

    data = request.get_json()
    contents = data.get('contents')

    if not contents:
        return jsonify({'error': 'Dados inválidos'}), 400

    try:
        resp = requests.post(
            f'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={API_KEY}',
            json={'contents': contents},
            timeout=30
        )
        return jsonify(resp.json())

    except requests.exceptions.Timeout:
        return jsonify({'error': {'message': 'Tempo limite excedido.'}}), 504

    except Exception as e:
        return jsonify({'error': {'message': str(e)}}), 500

# ── START ──

if __name__ == '__main__':
    app.run(debug=True)