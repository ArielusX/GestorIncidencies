require('dotenv').config();
const jwt = require('jsonwebtoken');
const Usuario = require('../models/User');

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await Usuario.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    // En producción usa bcrypt para comparar hash
    if (user.password !== password) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Crear token JWT
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      username: user.username,
      email: user.email,
      role: user.role,
      token
    });

  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
