const Incidencia = require('../models/Incidencia');

exports.getAll = async (req, res) => {
  const datos = await Incidencia.find();
  res.json(datos);
};
exports.getById = async (req, res) => {
  try {
    const incidencia = await Incidencia.findById(req.params.id);
    if (!incidencia) {
      return res.status(404).json({ message: 'Incidencia no encontrada' });
    }
    res.json(incidencia);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error al buscar la incidencia' });
  }
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