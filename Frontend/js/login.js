document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;

  // Hash de la contraseña con CryptoJS
  const hashedPassword = CryptoJS.SHA256(password).toString();

  try {
    const res = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password: hashedPassword })
    });

    const result = await res.json();

    if (result.success) {
      // Guardar info en localStorage para sesión
      localStorage.setItem('user', JSON.stringify({ username: result.username, fullName: result.fullName, email: result.email }));
      window.location.href = 'dashboard.html'; // Redirigir
    } else {
      document.getElementById('error').textContent = result.message;
    }
  } catch (error) {
    document.getElementById('error').textContent = 'Error de conexión al servidor.';
    console.error(error);
  }
});
