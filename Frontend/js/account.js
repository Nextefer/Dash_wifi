// Verificar si el usuario está autenticado
const user = JSON.parse(localStorage.getItem('user'));

if (!user) {
  window.location.href = 'login.html';
} else {
  // Mostrar información de usuario
  document.getElementById('fullName').textContent = user.fullName || 'No disponible';
  document.getElementById('username').textContent = user.username || 'No disponible';
  document.getElementById('email').textContent = user.email || 'No disponible';
}

// Logout
document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('user');
  window.location.href = 'login.html';
});
