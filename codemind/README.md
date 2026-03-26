# CodeMind — versão Flask (Python)

## Como rodar

### 1. Instale as dependências
```bash
pip install -r requirements.txt
```

### 2. Rode o servidor
```bash
python app.py
```

### 3. Acesse no navegador
```
http://localhost:5000
```

---

## Estrutura do projeto
```
codemind/
├── app.py              ← Backend Python (Flask)
├── requirements.txt    ← Dependências
├── users.json          ← Usuários cadastrados (criado automaticamente)
├── templates/
│   ├── base.html       ← Layout base
│   ├── login.html      ← Página de login
│   ├── cadastro.html   ← Página de cadastro
│   └── index.html      ← Chat principal
└── static/
    ├── css/style.css   ← Estilos
    └── js/script.js    ← Lógica do chat
```

---

## O que mudou em relação ao original?

| Antes (JS puro)                        | Agora (Flask + Python)                          |
|----------------------------------------|-------------------------------------------------|
| `localStorage` para salvar usuário     | `session` do Flask (servidor)                   |
| Chama Gemini API direto do browser     | Backend Python faz a chamada (mais seguro)      |
| `config.js` com chave exposta          | Chave informada pelo usuário na interface       |
| Arquivos HTML soltos                   | Templates Jinja2 com herança (`base.html`)      |
| Sem cadastro real                      | `users.json` salva usuários no servidor         |

---

## Obter API Key
Acesse https://aistudio.google.com/app/apikey e crie uma chave gratuita.
