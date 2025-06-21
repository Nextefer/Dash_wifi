document.getElementById("registerForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const fullName = document.getElementById("fullName").value.trim();
  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  const errorElem = document.getElementById("error");
  const successElem = document.getElementById("success");

  if (password !== confirmPassword) {
    errorElem.textContent = "Las contraseñas no coinciden.";
    return;
  }

  const hashedPassword = CryptoJS.SHA256(password).toString();

  const res = await fetch("http://localhost:3000/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fullName, username, email, password: hashedPassword })
  });

  const result = await res.json();

  if (result.success) {
    successElem.textContent = "¡Registro exitoso!";
    errorElem.textContent = "";
  } else {
    errorElem.textContent = result.message || "Error en el registro.";
    successElem.textContent = "";
  }
});
