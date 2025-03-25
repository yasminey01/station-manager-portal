
const mongoose = require('mongoose');

const stationSchema = new mongoose.Schema({
  nomStation: { type: String, required: true },
  adresseStation: { type: String, required: true },
  villeStation: { type: String, required: true },
  dateMiseEnService: { type: Date, required: true },
  latitude: { type: Number },
  longitude: { type: Number },
  telephone: { type: String },
  email: { type: String },
  horairesOuverture: { type: String },
  statut: { type: String, enum: ['actif', 'inactif'], default: 'actif' }
}, { timestamps: true });

module.exports = mongoose.model('Station', stationSchema);
