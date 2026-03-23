function fazerCadastro() {
  // Lê os valores DENTRO da função
  const email    = document.getElementById('email').value.trim();
  const senha    = document.getElementById('senha').value.trim();
  const repsenha = document.getElementById('confirmarSenha').value.trim();

  // 1. Verifica se algum campo está vazio
  if (email === '' || senha === '' || repsenha === '') {
    alert('Preencha todos os campos!');
    return;
  }

  // 2. Verifica se as senhas coincidem
  if (senha !== repsenha) {
    alert('As senhas não coincidem!');
    return;
  }

  // Salva no navegador
  localStorage.setItem('emailCadastrado', email);
  localStorage.setItem('senhaCadastrada', senha);

  // 3. Tudo certo — redireciona para o login
  alert('Cadastro realizado com sucesso!');
  window.location.href = '../frontend/login.html';
}