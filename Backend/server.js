const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const uri = 'mongodb+srv://aimars123:chavoloco@cluster1.sfuh0e3.mongodb.net/wifi_dashboard?retryWrites=true&w=majority';


const app = express();
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(uri)
  .then(() => console.log('Conectado a MongoDB Atlas'))
  .catch((error) => console.error('Error al conectar a MongoDB:', error));

// Importar modelo
const User = require('./models/Users');

// Endpoint de latencia
app.get('/ping', (req, res) => {
  res.send('pong');
});

// Registro
app.post('/api/register', async (req, res) => {
  const { fullName, username, email, password } = req.body;
  try {
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.json({ success: false, message: 'Usuario o correo ya registrado.' });
    }
    const newUser = new User({ fullName, username, email, password });
    await newUser.save();
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body; // password ya viene hasheado desde frontend
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.json({ success: false, message: 'Usuario no encontrado' });
    }
    if (user.password !== password) {
      return res.json({ success: false, message: 'Contraseña incorrecta' });
    }
    res.json({ success: true, fullName: user.fullName, username: user.username , email: user.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
});

app.listen(3000, () => {
  console.log('Servidor escuchando en http://localhost:3000');
});
