// ══════════════════════════════════════════════
// script.js — CodeMind (versão Flask)
// ══════════════════════════════════════════════

let apiKey      = ''
let currentMode = 'geral';
let history     = [];

const SYSTEM_PROMPTS = {
  geral: `Você é CodeMind, um assistente de programação avançado em português do Brasil.
Você é especialista em todas as linguagens e tecnologias de programação.
Seja direto, didático e use exemplos de código quando relevante.
Formate o código em blocos de código com a linguagem especificada.`,

  debug: `Você é CodeMind no modo DEBUG.
Analise o código fornecido, identifique bugs, erros de lógica e problemas de performance.
Explique cada problema encontrado e forneça o código corrigido.
Seja detalhado e didático. Responda em português.`,

  explicar: `Você é CodeMind no modo EXPLICAR.
Explique o código fornecido linha por linha ou em blocos lógicos,
de forma clara e didática para um estudante.
Use analogias quando útil. Responda em português.`,

  gerar: `Você é CodeMind no modo GERAR CÓDIGO.
Crie código limpo, bem comentado e funcional com base na descrição do usuário.
Siga boas práticas e explique brevemente o que foi criado. Responda em português.`,

  revisar: `Você é CodeMind no modo REVISÃO.
Analise a qualidade do código: legibilidade, boas práticas, padrões,
possíveis melhorias e segurança. Dê uma nota de 0-10 e sugestões práticas.
Responda em português.`,

  sql: `Você é CodeMind no modo SQL.
Você é especialista em bancos de dados relacionais (MySQL, PostgreSQL, SQLite, SQL Server).
Ajude com queries, otimização, modelagem e problemas de banco de dados.
Responda em português.`,

  git: `Você é CodeMind no modo GIT.
Você é especialista em Git e versionamento.
Explique comandos, resolva conflitos, ensine fluxos de trabalho (gitflow, etc.) de forma prática.
Responda em português.`
};

// ── Salvar API Key ──
function saveApiKey() {
  const val = document.getElementById('apiKeyInput').value.trim();
  if (!val) { showToast('Digite uma API Key válida!', 'error'); return; }

  apiKey = val;
  document.getElementById('statusDot').classList.remove('offline');
  document.getElementById('statusText').textContent = 'Conectado';
  document.getElementById('sendBtn').disabled = false;
  showToast('API Key salva! Pode começar.', 'success');
}

// ── Trocar modo ──
function setMode(btn, mode) {
  document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentMode = mode;
  showToast(`Modo: ${btn.textContent.trim()}`, 'success');
}

// ── Limpar chat ──
function clearChat() {
  history = [];
  const msgs = document.getElementById('messages');
  msgs.innerHTML = `
    <div class="welcome" id="welcome">
      <div class="welcome-icon">🧠</div>
      <h2>Novo chat iniciado!</h2>
      <p>Como posso ajudar com programação?</p>
      <div class="welcome-chips">
        <div class="chip" onclick="sendChip('Como faço um loop em Python?')">Loop em Python</div>
        <div class="chip" onclick="sendChip('O que é uma API REST?')">O que é REST API?</div>
        <div class="chip" onclick="sendChip('Explique o que é Git e como usar')">Como usar Git?</div>
        <div class="chip" onclick="sendChip('Quais são as diferenças entre C e Java?')">C vs Java</div>
      </div>
    </div>`;
}

function sendChip(text) {
  document.getElementById('userInput').value = text;
  sendMessage();
}

function handleKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
}

function autoResize(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 140) + 'px';
}

function removeWelcome() {
  const w = document.getElementById('welcome');
  if (w) w.remove();
}

function addMessage(role, text) {
  removeWelcome();
  const msgs = document.getElementById('messages');
  const div  = document.createElement('div');
  div.className = `msg ${role}`;
  const avatarEmoji = role === 'user' ? '👤' : '🧠';
  const avatarClass = role === 'user' ? 'user-av' : 'ai-av';
  div.innerHTML = `
    <div class="avatar ${avatarClass}">${avatarEmoji}</div>
    <div class="bubble">${formatText(text)}</div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
  return div;
}

function addTyping() {
  removeWelcome();
  const msgs = document.getElementById('messages');
  const div  = document.createElement('div');
  div.className = 'msg ai';
  div.id = 'typing-indicator';
  div.innerHTML = `
    <div class="avatar ai-av">🧠</div>
    <div class="bubble">
      <div class="typing"><span></span><span></span><span></span></div>
    </div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
  return div;
}

function formatText(text) {
  let safe = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  safe = safe.replace(/```(\w+)?\n?([\s\S]*?)```/g, (_, lang, code) => {
    const language = lang || 'code';
    const id = 'code-' + Math.random().toString(36).substr(2, 6);
    return `<pre id="${id}">
      <button class="copy-btn" onclick="copyCode('${id}')">copiar</button>
      <code class="${language}">${code.trim()}</code>
    </pre>`;
  });
  safe = safe.replace(/`([^`]+)`/g, '<code>$1</code>');
  safe = safe.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  safe = safe.replace(/\n/g, '<br>');
  return safe;
}

function copyCode(id) {
  const pre  = document.getElementById(id);
  const code = pre.querySelector('code').innerText;
  navigator.clipboard.writeText(code).then(() => showToast('Código copiado!', 'success'));
}

// ── FUNÇÃO PRINCIPAL — chama o backend Flask ──
async function sendMessage() {
  if (!apiKey) { showToast('Conecte sua API Key primeiro!', 'error'); return; }

  const input = document.getElementById('userInput');
  const text  = input.value.trim();
  if (!text) return;

  input.value = '';
  input.style.height = 'auto';
  document.getElementById('sendBtn').disabled = true;

  addMessage('user', text);
  const typing = addTyping();

  history.push({ role: 'user', parts: [{ text }] });

  try {
    const systemPrompt = SYSTEM_PROMPTS[currentMode];
    const contents = [
      { role: 'user',  parts: [{ text: systemPrompt }] },
      { role: 'model', parts: [{ text: 'Entendido! Estou pronto para ajudar como CodeMind.' }] },
      ...history
    ];

    // ← Chama o backend Python, não a API diretamente
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents })
    });

    const data = await response.json();

    if (data.error) {
      typing.remove();
      addMessage('ai', `❌ Erro da API: ${data.error.message}`);
      return;
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sem resposta.';
    history.push({ role: 'model', parts: [{ text: reply }] });
    typing.remove();
    addMessage('ai', reply);

  } catch (err) {
    typing.remove();
    addMessage('ai', `❌ Erro de conexão: ${err.message}`);
  } finally {
    document.getElementById('sendBtn').disabled = false;
    document.getElementById('userInput').focus();
  }
}

function showToast(msg, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className   = `toast ${type} show`;
  setTimeout(() => toast.classList.remove('show'), 2500);
}
