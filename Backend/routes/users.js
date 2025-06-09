const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Crear usuario (POST /api/users)
router.post("/", async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Validación básica
    if (!username || !email || !password || !role) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    // Comprobación de usuario ya existente
    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      return res.status(409).json({ message: "Usuario o email ya existe" });
    }

    // Crear y guardar usuario
    const newUser = new User({ username, email, password, role });
    await newUser.save();

    res.status(201).json({ message: "Usuario creado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error del servidor", error });
  }
});

// Obtener todos los usuarios
router.get("/", async (req, res) => {
  try {
    const usuarios = await User.find();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
});

// Obtener un usuario por ID
router.get("/:id", async (req, res) => {
  try {
    const usuario = await User.findById(req.params.id);
    if (!usuario)
      return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuario" });
  }
});

// Editar usuario
router.put("/:id", async (req, res) => {
  try {
    const usuarioActualizado = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!usuarioActualizado)
      return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(usuarioActualizado);
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar usuario", error });
  }
});

// Eliminar usuario
router.delete("/:id", async (req, res) => {
  try {
    const usuarioEliminado = await User.findByIdAndDelete(req.params.id);
    if (!usuarioEliminado)
      return res.status(404).json({ message: "Usuario no encontrado" });
    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar usuario" });
  }
});

module.exports = router;
