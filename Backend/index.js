/*require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Rutas
const incidenciaRoutes = require('./routes/incidencias.routes');

const app = express();
app.use(cors());
app.use(express.json());

// Conexión MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error MongoDB:', err));

// Rutas
app.use('/api/incidencias', incidenciaRoutes);

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
*/
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const incidenciaRoutes = require('./routes/incidencias.routes');



const app = express();
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));

app.use('/api/auth', authRoutes);
app.use('/api/incidencias', incidenciaRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en puerto ${PORT}`);
});