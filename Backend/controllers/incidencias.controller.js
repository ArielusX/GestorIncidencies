const Incidencia = require('../models/Incidencia');

exports.getAll = async (req, res) => {
  const datos = await Incidencia.find();
  res.json(datos);
};

exports.create = async (req, res) => {
  const nueva = new Incidencia(req.body);
  await nueva.save();
  res.json(nueva);
};

exports.update = async (req, res) => {
  const actualizada = await Incidencia.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(actualizada);
};

exports.remove = async (req, res) => {
  await Incidencia.findByIdAndDelete(req.params.id);
  res.json({ message: 'Eliminada' });
};