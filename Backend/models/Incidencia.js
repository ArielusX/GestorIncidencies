const mongoose = require('mongoose');

const incidenciaSchema = new mongoose.Schema({
  titulo: String,
  descripcion: String,
  estado: String,
  prioridad: String,
  usuarioCreador: String,
  tecnico: String,
  fechaCreacion: { type: Date, default: Date.now },
  solucion: String,
  fechaSolucion: {
    type: Date,
    default: null,
  },
  
});

module.exports = mongoose.model('Incidencia', incidenciaSchema);
