# 🤖 Pip.IA — Assistente de Programação com Inteligência Artificial

<p align="center">
  <img src="imgs/robo.png" alt="Pip.IA" width="200"/>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Google%20Gemini-AI-blue?style=for-the-badge&logo=google" />
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />
</p>

---

## 📌 Sobre o Projeto

O **Pip.IA** é um assistente de programação com Inteligência Artificial desenvolvido como trabalho escolar. Ele utiliza a API do **Google Gemini** (via Google AI Studio) para responder perguntas sobre programação, depurar código, explicar conceitos, gerar código e muito mais — tudo em português.

---

## ✨ Funcionalidades

| Modo | Descrição |
|------|-----------|
| 💬 Chat Geral | Tire dúvidas gerais sobre programação |
| 🐛 Depurar Código | Encontra e corrige bugs no seu código |
| 📖 Explicar Código | Explica o código linha por linha |
| ⚡ Gerar Código | Cria código a partir de uma descrição |
| 🔍 Revisar Código | Analisa a qualidade do código com nota |
| 🗄️ SQL Helper | Ajuda com banco de dados e queries |
| 🌿 Git Helper | Ensina comandos e fluxos do Git |

---

## 🗂️ Estrutura do Projeto

```
📁 Assistente_de_Programacao/
├── 📁 backend/
│   ├── config.js           ← Chave da API (não enviado ao GitHub)
│   ├── config.example.js   ← Modelo do config.js
│   └── script.js           ← Lógica da IA e do chat
├── 📁 frontend/
│   ├── index.html          ← Estrutura da página
│   └── style.css           ← Estilo visual
├── 📁 imgs/
│   └── robo.png            ← Imagem do robô
├── .gitignore              ← Protege a chave da API
└── README.md               ← Este arquivo
```

---

## 🚀 Como Executar

### Pré-requisitos
- [VSCode](https://code.visualstudio.com/) instalado
- Extensão **Live Server** instalada no VSCode
- Conta Google para obter a API Key

### Passo a Passo

**1. Clone o repositório**
```bash
git clone https://github.com/seu-usuario/seu-repositorio.git
```

**2. Configure a API Key**

Copie o arquivo de exemplo e renomeie:
```bash
cp backend/config.example.js backend/config.js
```

Abra o `backend/config.js` e cole sua chave:
```js
const CONFIG = {
  apiKey: 'SUA_CHAVE_AQUI'
};
```

**3. Obtenha sua API Key gratuita**

Acesse [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey), faça login com sua conta Google e crie uma nova chave.

**4. Rode o projeto**

No VSCode, clique com o botão direito no `frontend/index.html` e selecione **"Open with Live Server"**.

---

## 🔐 Segurança

A chave da API fica salva apenas no arquivo `backend/config.js`, que está listado no `.gitignore` e **nunca é enviado ao GitHub**. Nunca compartilhe sua chave com outras pessoas.

---

## 🛠️ Tecnologias Utilizadas

- **HTML5** — Estrutura da página
- **CSS3** — Estilo e animações
- **JavaScript** — Lógica e integração com a IA
- **Google Gemini API** — Modelo de IA (via Google AI Studio)

---

## 📚 Referências

- [Google AI Studio](https://aistudio.google.com)
- [Documentação da API Gemini](https://ai.google.dev/docs)

---

## 👨‍💻 Autor

Desenvolvido como trabalho escolar.