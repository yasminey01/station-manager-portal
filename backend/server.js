
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

// Routes
const stationsRoutes = require('./routes/stations.routes');
const employeesRoutes = require('./routes/employees.routes');
const salesRoutes = require('./routes/sales.routes');
const productsRoutes = require('./routes/products.routes');
const suppliersRoutes = require('./routes/suppliers.routes');
const stockEntriesRoutes = require('./routes/stockEntries.routes');
const pumpsRoutes = require('./routes/pumps.routes');
const tanksRoutes = require('./routes/tanks.routes');
const usersRoutes = require('./routes/users.routes');
const authRoutes = require('./routes/auth.routes'); // Ajouté

// Charger les variables d'environnement
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Connection à MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connecté à MongoDB'))
  .catch(err => console.error('Erreur de connexion à MongoDB', err));

// Routes API
app.use('/api/stations', stationsRoutes);
app.use('/api/employees', employeesRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/suppliers', suppliersRoutes);
app.use('/api/stock-entries', stockEntriesRoutes);
app.use('/api/pumps', pumpsRoutes);
app.use('/api/tanks', tanksRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/auth', authRoutes); // Ajouté

// Route de base
app.get('/', (req, res) => {
  res.send('API de StationManager est opérationnelle');
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
