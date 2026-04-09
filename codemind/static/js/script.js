// ══════════════════════════════════════════════
// script.js — Pip-I.A v2
// ══════════════════════════════════════════════

let currentMode      = 'geral';
let history          = [];
let selectedImage    = null; // { base64, mimeType, name }
let chatSessions     = [];   // [{id, title, history}]
let currentSessionId = null;
let mascotMenuOpen   = false;
let speechTimeout    = null;

// ── FRASES DO MASCOTE ──
const PIP_PHRASES = [
  "Posso te ajudar! 🚀",
  "Vamos codar! 💻",
  "Tem dúvida? Me chame!",
  "Debug time! 🐛",
  "Aqui pra ajudar ✨",
  "Bora programar? ⚡",
];
const PIP_THINKING = ["Hmm... pensando 🤔", "Calculando... ⚙️", "Quase lá... 🔍"];
const PIP_DONE     = ["Pronto! 🎉", "Aqui está! ✅", "Tcharam! 🚀", "Feito! 😊"];

const SYSTEM_PROMPTS = {
  geral: `Você é Pip-I.A, um assistente de programação avançado em português do Brasil.
Você é especialista em todas as linguagens e tecnologias de programação.
Seja direto, didático e use exemplos de código quando relevante.
Formate o código em blocos de código com a linguagem especificada.`,
  debug: `Você é Pip-I.A no modo DEBUG.
Analise o código fornecido, identifique bugs, erros de lógica e problemas de performance.
Explique cada problema encontrado e forneça o código corrigido.
Seja detalhado e didático. Responda em português.`,
  explicar: `Você é Pip-I.A no modo EXPLICAR.
Explique o código fornecido linha por linha ou em blocos lógicos,
de forma clara e didática para um estudante.
Use analogias quando útil. Responda em português.`,
  gerar: `Você é Pip-I.A no modo GERAR CÓDIGO.
Crie código limpo, bem comentado e funcional com base na descrição do usuário.
Siga boas práticas e explique brevemente o que foi criado. Responda em português.`,
  revisar: `Você é Pip-I.A no modo REVISÃO.
Analise a qualidade do código: legibilidade, boas práticas, padrões,
possíveis melhorias e segurança. Dê uma nota de 0-10 e sugestões práticas.
Responda em português.`,
  sql: `Você é Pip-I.A no modo SQL.
Você é especialista em bancos de dados relacionais (MySQL, PostgreSQL, SQLite, SQL Server).
Ajude com queries, otimização, modelagem e problemas de banco de dados.
Responda em português.`,
  git: `Você é Pip-I.A no modo GIT.
Você é especialista em Git e versionamento.
Explique comandos, resolva conflitos, ensine fluxos de trabalho (gitflow, etc.) de forma prática.
Responda em português.`
};

// ══ TEMA ══
function toggleTheme() {
  document.body.classList.toggle('light');
  const isLight = document.body.classList.contains('light');
  const emoji   = isLight ? '☀️' : '🌙';
  document.getElementById('themeBtn').textContent       = emoji;
  const mb = document.getElementById('themeBtnMobile');
  if (mb) mb.textContent = emoji;
  localStorage.setItem('pip-theme', isLight ? 'light' : 'dark');
}

function loadTheme() {
  if (localStorage.getItem('pip-theme') === 'light') {
    document.body.classList.add('light');
    ['themeBtn','themeBtnMobile'].forEach(id => { const el = document.getElementById(id); if (el) el.textContent = '☀️'; });
  }
}

// ══ SIDEBAR MOBILE ══
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('sidebarOverlay').classList.toggle('open');
}

// ══ MASCOTE ══
function pipSay(text, duration = 3000) {
  if (mascotMenuOpen) return;
  const speech = document.getElementById('pipSpeech');
  speech.textContent = text;
  speech.classList.add('visible');
  if (speechTimeout) clearTimeout(speechTimeout);
  speechTimeout = setTimeout(() => {
    speech.classList.remove('visible');
    speechTimeout = null;
  }, duration);
}

function pipReact(emotion) {
  const mascot = document.getElementById('pipMascot');
  mascot.classList.remove('happy', 'thinking');
  void mascot.offsetWidth; // reflow
  mascot.classList.add(emotion);
  setTimeout(() => mascot.classList.remove(emotion), 1000);
}

function toggleMascotMenu() {
  const menu = document.getElementById('mascotMenu');
  const speech = document.getElementById('pipSpeech');
  mascotMenuOpen = !mascotMenuOpen;
  menu.style.display = mascotMenuOpen ? 'block' : 'none';
  if (mascotMenuOpen) {
    speech.classList.remove('visible');
    if (speechTimeout) {
      clearTimeout(speechTimeout);
      speechTimeout = null;
    }
  }
}

// Frase aleatória de vez em quando
setInterval(() => {
  if (!mascotMenuOpen && Math.random() > 0.6) {
    pipSay(PIP_PHRASES[Math.floor(Math.random() * PIP_PHRASES.length)], 2500);
  }
}, 15000);

// ══ MODOS ══
function setMode(btn, mode) {
  document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentMode = mode;
  showToast(`Modo: ${btn.textContent.trim()}`, 'success');
  pipSay(`Modo ${btn.textContent.trim()} ativado! ✨`);
}

// ══ IMAGEM ══
function handleImageSelect(event) {
  const file = event.target.files[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) { showToast('Apenas imagens!', 'error'); return; }
  if (file.size > 5 * 1024 * 1024) { showToast('Imagem muito grande (máx 5MB)', 'error'); return; }

  const reader = new FileReader();
  reader.onload = e => {
    const base64 = e.target.result.split(',')[1];
    selectedImage = { base64, mimeType: file.type, name: file.name };
    document.getElementById('imagePreviewThumb').src = e.target.result;
    document.getElementById('imagePreviewName').textContent = file.name;
    document.getElementById('imagePreviewBar').style.display = 'block';
    pipSay('Imagem carregada! 📸');
  };
  reader.readAsDataURL(file);
  event.target.value = ''; // reset
}

function removeImage() {
  selectedImage = null;
  document.getElementById('imagePreviewBar').style.display = 'none';
  document.getElementById('imagePreviewThumb').src = '';
}

// ══ CHAT ══
function clearChat() {
  if (history.length > 0) saveToHistory();
  history = [];
  currentSessionId = null;
  selectedImage = null;
  document.getElementById('imagePreviewBar').style.display = 'none';
  const msgs = document.getElementById('messages');
  msgs.innerHTML = `
    <div class="welcome" id="welcome">
      <div class="welcome-pip">
        <img src="../static/css/imgs/pip.png" alt="Pip-I.A" id="welcomePip">
        <div class="pip-bubble">Novo chat! 🎉</div>
      </div>
      <h2>Novo chat iniciado!</h2>
      <p>Como posso ajudar com programação?</p>
      <div class="welcome-chips">
        <div class="chip" onclick="sendChip('Como faço um loop em Python?')">Loop em Python</div>
        <div class="chip" onclick="sendChip('O que é uma API REST?')">O que é REST API?</div>
        <div class="chip" onclick="sendChip('Explique o que é Git e como usar')">Como usar Git?</div>
        <div class="chip" onclick="sendChip('Quais são as diferenças entre C e Java?')">C vs Java</div>
      </div>
    </div>`;
  pipReact('happy');
  pipSay('Novo chat! Vamos lá! 🚀');
}

function sendChip(text) {
  document.getElementById('userInput').value = text;
  sendMessage();
}

function handleKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
}

function autoResize(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 140) + 'px';
}

function removeWelcome() {
  const w = document.getElementById('welcome');
  if (w) w.remove();
}

function addMessage(role, text, imageDataUrl = null) {
  removeWelcome();
  const msgs = document.getElementById('messages');
  const div  = document.createElement('div');
  div.className = `msg ${role}`;
  const avatarEmoji = role === 'user' ? '👤' : '<img src="../static/css/imgs/pip_cabeça.png" style="height:auto;width:60px;">';
  const avatarClass = role === 'user' ? 'user-av' : 'ai-av';
  const imgHtml = (imageDataUrl && role === 'user')
    ? `<img class="msg-image" src="${imageDataUrl}" alt="Imagem enviada"/>` : '';
  div.innerHTML = `
    <div class="avatar ${avatarClass}">${avatarEmoji}</div>
    <div class="bubble">${imgHtml}${formatText(text)}</div>`;
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
    <div class="avatar ai-av"><img src="../static/css/imgs/pip_cabeça.png" style="height:auto;width:60px;"></div>
    <div class="bubble"><div class="typing"><span></span><span></span><span></span></div></div>`;
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
    return `<pre id="${id}"><button class="copy-btn" onclick="copyCode('${id}')">copiar</button><code class="${language}">${code.trim()}</code></pre>`;
  });
  safe = safe.replace(/`([^`]+)`/g, '<code>$1</code>');
  safe = safe.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  safe = safe.replace(/\n/g, '<br>');
  return safe;
}

function copyCode(id) {
  const pre  = document.getElementById(id);
  const code = pre.querySelector('code').innerText;
  navigator.clipboard.writeText(code).then(() => {
    showToast('Código copiado!', 'success');
    pipSay('Copiado! 📋');
  });
}

// ══ HISTÓRICO ══
function saveToHistory() {
  if (history.length === 0) return;
  const firstMsg = history[0]?.parts?.[0]?.text || 'Conversa';
  const title    = firstMsg.substring(0, 35) + (firstMsg.length > 35 ? '…' : '');

  if (currentSessionId) {
    const existingIndex = chatSessions.findIndex(s => s.id === currentSessionId);
    if (existingIndex !== -1) {
      chatSessions[existingIndex].history = [...history];
      chatSessions[existingIndex].title   = title;
      renderHistory();
      return;
    }
  }

  const session = { id: Date.now(), title, history: [...history] };
  currentSessionId = session.id;
  chatSessions.unshift(session);
  if (chatSessions.length > 10) chatSessions.pop();
  renderHistory();
}

function renderHistory() {
  const list = document.getElementById('historyList');
  if (chatSessions.length === 0) {
    list.innerHTML = '<p class="history-empty">Nenhuma conversa ainda</p>';
    return;
  }
  list.innerHTML = chatSessions.map(s => `
    <button class="history-item" onclick="loadSession(${s.id})" title="${s.title}">
      💬 ${s.title}
    </button>`).join('');
}

function loadSession(id) {
  const session = chatSessions.find(s => s.id === id);
  if (!session) return;

  if (currentSessionId !== session.id && history.length > 0) {
    saveToHistory();
  }

  currentSessionId = session.id;
  history = [...session.history];
  const msgs = document.getElementById('messages');
  msgs.innerHTML = '';
  history.forEach(h => {
    const role = h.role === 'user' ? 'user' : 'ai';
    const text = h.parts?.[0]?.text || '';
    addMessage(role, text);
  });
  showToast('Conversa carregada!', 'success');
  pipSay('Conversa restaurada! 📂');
  if (window.innerWidth <= 700) toggleSidebar();
}

// ══ ENVIO ══
async function sendMessage() {
  const input = document.getElementById('userInput');
  const text  = input.value.trim();
  const hasImage = !!selectedImage;

  if (!text && !hasImage) return;

  input.value = '';
  input.style.height = 'auto';
  document.getElementById('sendBtn').disabled = true;

  // Mostra mensagem do usuário com imagem se houver
  const previewUrl = hasImage
    ? `data:${selectedImage.mimeType};base64,${selectedImage.base64}` : null;
  addMessage('user', text || '📎 Imagem enviada', previewUrl);

  const typing = addTyping();
  pipReact('thinking');
  pipSay(PIP_THINKING[Math.floor(Math.random() * PIP_THINKING.length)], 8000);

  // Monta parts da mensagem atual
  const userParts = [];
  if (hasImage) {
    userParts.push({ inline_data: { mime_type: selectedImage.mimeType, data: selectedImage.base64 } });
  }
  if (text) userParts.push({ text });
  if (!text && hasImage) userParts.push({ text: 'Analise esta imagem e me ajude com ela.' });

  history.push({ role: 'user', parts: userParts });
  removeImage();

  try {
    const systemPrompt = SYSTEM_PROMPTS[currentMode];
    const contents = [
      { role: 'user',  parts: [{ text: systemPrompt }] },
      { role: 'model', parts: [{ text: 'Entendido! Estou pronto para ajudar como Pip-I.A.' }] },
      ...history
    ];

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents })
    });

    const data = await response.json();

    if (data.error) {
      typing.remove();
      addMessage('ai', `❌ Erro da API: ${data.error.message || JSON.stringify(data.error)}`);
      pipSay('Ops, algo deu errado 😅');
      return;
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sem resposta.';
    history.push({ role: 'model', parts: [{ text: reply }] });
    typing.remove();
    addMessage('ai', reply);
    pipReact('happy');
    pipSay(PIP_DONE[Math.floor(Math.random() * PIP_DONE.length)], 2000);

  } catch (err) {
    typing.remove();
    addMessage('ai', `❌ Erro de conexão: ${err.message}`);
    pipSay('Erro de conexão 😰');
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

// ══ INIT ══
loadTheme();
renderHistory();

// Mascote diz olá ao entrar
setTimeout(() => pipSay('Olá! Clique em mim! 👋', 3000), 1500);

// Fechar menu do mascote ao clicar fora
document.addEventListener('click', e => {
  const mascot = document.getElementById('pipMascot');
  const menu   = document.getElementById('mascotMenu');
  if (!mascot.contains(e.target) && !menu.contains(e.target) && mascotMenuOpen) {
    mascotMenuOpen = false;
    menu.style.display = 'none';
  }


});

// ══ RECONHECIMENTO DE VOZ ══
let recognition = null;
let isListening = false;

window.toggleVoice = function() {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    showToast('Seu navegador não suporta reconhecimento de voz', 'error');
    pipSay('Navegador sem suporte a voz 😕');
    return;
  }

  if (isListening) {
    recognition.stop();
    return;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.lang = 'pt-BR';
  recognition.interimResults = false;
  // false → onresult só dispara quando você PARA de falar
  recognition.maxAlternatives = 1;
  // maxAlternatives = número máximo de resultados possíveis que o sistema pode retornar - 1 = você quer apenas a melhor opção 

  const voiceBtn = document.getElementById('voiceBtn');

  recognition.onstart = () => {
    isListening = true;
    voiceBtn.classList.add('listening');
    pipSay('Ouvindo... 🎙️', 10000);
    showToast('Fale agora!', 'success');
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    document.getElementById('userInput').value = transcript;
    sendMessage();
  };

recognition.onerror = (event) => {
  switch (event.error) {
    case 'no-speech':
      pipSay('Não ouvi nada 😶');
      break;

    case 'not-allowed':
      pipSay('Permissão do microfone negada 🚫');
      break;

    default:
      showToast('Erro no microfone: ' + event.error, 'error');
      pipSay('Erro ao ouvir 😅');
  }
};

  recognition.onend = () => {
    isListening = false;
    voiceBtn.classList.remove('listening');
  };

  recognition.start();
}
