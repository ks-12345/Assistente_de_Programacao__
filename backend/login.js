function fazerLogin() {
  const emailDigitado = document.getElementById('email').value.trim();
  const senhaDigitada = document.getElementById('senha').value.trim();

  // Busca o que foi salvo no cadastro
  const emailSalvo = localStorage.getItem('emailCadastrado');
  const senhaSalva = localStorage.getItem('senhaCadastrada');

  if (emailDigitado === emailSalvo && senhaDigitada === senhaSalva) {
    window.location.href = '../frontend/index.html';
  } else {
    alert('E-mail ou senha incorretos!');
  }
}