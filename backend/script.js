// ══════════════════════════════════════════════
// script.js — CodeMind Assistente de Programação
// Autor: Trabalho Escolar
// Descrição: Lógica da IA e do chat
// ══════════════════════════════════════════════

// ── VARIÁVEIS GLOBAIS ──
let apiKey      = CONFIG.apiKey;  // Chave da API do Google AI Studio
let currentMode = 'geral';   // Modo atual da IA
let history     = [];        // Histórico de mensagens da conversa

// ══════════════════════════════
// PROMPTS — Instruções para a IA
// Cada modo dá um "papel" diferente à IA
// ══════════════════════════════
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

// ══════════════════════════════
// FUNÇÃO: Salvar API Key
// ══════════════════════════════
function saveApiKey() {
  const val = document.getElementById('apiKeyInput').value.trim();

  if (!val) {
    showToast('Digite uma API Key válida!', 'error');
    return;
  }

  apiKey = val;

  // Atualiza o indicador de status na interface
  document.getElementById('statusDot').classList.remove('offline');
  document.getElementById('statusText').textContent = 'Conectado';
  document.getElementById('sendBtn').disabled = false;

  showToast('API Key salva! Pode começar.', 'success');
}

// ══════════════════════════════
// FUNÇÃO: Trocar modo da IA
// ══════════════════════════════
function setMode(btn, mode) {
  // Remove destaque de todos os botões
  document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));

  // Destaca o botão clicado
  btn.classList.add('active');
  currentMode = mode;

  showToast(`Modo: ${btn.textContent.trim()}`, 'success');
}

// ══════════════════════════════
// FUNÇÃO: Limpar conversa
// ══════════════════════════════
function clearChat() {
  history = []; // Reseta o histórico

  const msgs = document.getElementById('messages');
  msgs.innerHTML = `
    <div class="welcome" id="welcome">
      <div class="welcome-icon">
      <img src="../imgs/pip.png" alt="logo do pip" ></div>
      <h2>Pip.IA está pronto!</h2>
      <p>Novo chat iniciado. Como posso ajudar com programação?</p>
      <div class="welcome-chips">
        <div class="chip" onclick="sendChip('Como faço um loop em Python?')">Loop em Python</div>
        <div class="chip" onclick="sendChip('O que é uma API REST?')">O que é REST API?</div>
        <div class="chip" onclick="sendChip('Explique o que é Git e como usar')">Como usar Git?</div>
        <div class="chip" onclick="sendChip('Quais são as diferenças entre C e Java?')">C vs Java</div>
      </div>
    </div>`;
}

// ══════════════════════════════
// FUNÇÃO: Enviar chip de atalho
// ══════════════════════════════
function sendChip(text) {
  document.getElementById('userInput').value = text;
  sendMessage();
}

// ══════════════════════════════
// FUNÇÃO: Tecla Enter envia mensagem
// ══════════════════════════════
function handleKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault(); // Evita quebra de linha
    sendMessage();
  }
}

// ══════════════════════════════
// FUNÇÃO: Auto-redimensionar textarea
// ══════════════════════════════
function autoResize(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 140) + 'px';
}

// ══════════════════════════════
// FUNÇÃO: Remover tela de boas-vindas
// ══════════════════════════════
function removeWelcome() {
  const w = document.getElementById('welcome');
  if (w) w.remove();
}

// ══════════════════════════════
// FUNÇÃO: Adicionar mensagem no chat
// ══════════════════════════════
function addMessage(role, text) {
  removeWelcome();

  const msgs = document.getElementById('messages');
  const div  = document.createElement('div');
  div.className = `msg ${role}`;

  const avatarEmoji = role === 'user' ? '👤' : '🧠';
  const avatarClass = role === 'user' ? 'user-av' : 'ai-av';

  div.innerHTML = `
    <div class="avatar ${avatarClass}">${avatarEmoji}</div>
    <div class="bubble">${formatText(text)}</div>
  `;

  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight; // Rola para baixo
  return div;
}

// ══════════════════════════════
// FUNÇÃO: Mostrar animação "IA digitando..."
// ══════════════════════════════
function addTyping() {
  removeWelcome();

  const msgs = document.getElementById('messages');
  const div  = document.createElement('div');
  div.className = 'msg ai';
  div.id = 'typing-indicator';

  div.innerHTML = `
    <div class="avatar ai-av">
    <img id="logo" src="../imgs/pip_cabeça.png" alt="logo do pip" >
    </div>
    <div class="bubble">
      <div class="typing">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  `;

  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
  return div;
}

// ══════════════════════════════
// FUNÇÃO: Formatar texto da IA
// Converte markdown básico para HTML
// ══════════════════════════════
function formatText(text) {
  // 1. Escapa caracteres HTML especiais (segurança)
  let safe = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // 2. Blocos de código (```linguagem ... ```)
  safe = safe.replace(/```(\w+)?\n?([\s\S]*?)```/g, (_, lang, code) => {
    const language = lang || 'code';
    const id = 'code-' + Math.random().toString(36).substr(2, 6);
    return `<pre id="${id}">
      <button class="copy-btn" onclick="copyCode('${id}')">copiar</button>
      <code class="${language}">${code.trim()}</code>
    </pre>`;
  });

  // 3. Código inline (`codigo`)
  safe = safe.replace(/`([^`]+)`/g, '<code>$1</code>');

  // 4. Negrito (**texto**)
  safe = safe.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // 5. Quebras de linha
  safe = safe.replace(/\n/g, '<br>');

  return safe;
}

// ══════════════════════════════
// FUNÇÃO: Copiar código para área de transferência
// ══════════════════════════════
function copyCode(id) {
  const pre  = document.getElementById(id);
  const code = pre.querySelector('code').innerText;

  navigator.clipboard.writeText(code).then(() => {
    showToast('Código copiado!', 'success');
  });
}

// ══════════════════════════════
// FUNÇÃO PRINCIPAL: Enviar mensagem para a IA
// ══════════════════════════════
async function sendMessage() {
  // Verifica se a API Key foi configurada
  if (!apiKey) {
    showToast('Conecte sua API Key primeiro!', 'error');
    return;
  }

  const input = document.getElementById('userInput');
  const text  = input.value.trim();
  if (!text) return; // Ignora mensagens vazias

  // Limpa o campo de texto
  input.value = '';
  input.style.height = 'auto';
  document.getElementById('sendBtn').disabled = true;

  // Exibe a mensagem do usuário e a animação de digitação
  addMessage('user', text);
  const typing = addTyping();

  // Adiciona ao histórico (formato exigido pela API Gemini)
  history.push({ role: 'user', parts: [{ text }] });

  try {
    // Monta as mensagens com o prompt do sistema no início
    const systemPrompt      = SYSTEM_PROMPTS[currentMode];
    const messagesWithSystem = [
      { role: 'user',  parts: [{ text: systemPrompt }] },
      { role: 'model', parts: [{ text: 'Entendido! Estou pronto para ajudar como CodeMind.' }] },
      ...history
    ];

    // ── Chama a API do Google Gemini ──
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: messagesWithSystem })
      }
    );

    const data = await response.json();

    // Trata erros retornados pela API
    if (data.error) {
      typing.remove();
      addMessage('ai', `❌ Erro da API: ${data.error.message}`);
      return;
    }

    // Extrai o texto da resposta
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sem resposta.';

    // Adiciona resposta da IA ao histórico
    history.push({ role: 'model', parts: [{ text: reply }] });

    // Remove animação e exibe a resposta
    typing.remove();
    addMessage('ai', reply);

  } catch (err) {
    // Erro de rede ou outro erro inesperado
    typing.remove();
    addMessage('ai', `❌ Erro de conexão: ${err.message}. Verifique sua API Key e conexão.`);

  } finally {
    // Reativa o botão e foca no input
    document.getElementById('sendBtn').disabled = false;
    document.getElementById('userInput').focus();
  }
}

// ══════════════════════════════
// FUNÇÃO: Exibir notificação (toast)
// ══════════════════════════════
function showToast(msg, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className   = `toast ${type} show`;

  // Esconde após 2,5 segundos
  setTimeout(() => toast.classList.remove('show'), 2500);
}

// ══════════════════════════════
// INICIALIZAÇÃO — Roda ao carregar a página
// Se já tem chave fixa, atualiza o status automaticamente
// ══════════════════════════════
window.addEventListener('DOMContentLoaded', () => {
  if (apiKey && apiKey !== 'SUA_CHAVE_AQUI') {
    const dot  = document.getElementById('statusDot');
    const text = document.getElementById('statusText');
    const btn  = document.getElementById('sendBtn');

    if (dot)  dot.classList.remove('offline');
    if (text) text.textContent = 'Conectado';
    if (btn)  btn.disabled = false;
  }
});