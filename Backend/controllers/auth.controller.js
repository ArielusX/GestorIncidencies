require('dotenv').config();
const jwt = require('jsonwebtoken');
const Usuario = require('../models/User');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;


exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await Usuario.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
    return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

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
