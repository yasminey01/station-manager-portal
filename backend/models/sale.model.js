
const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  idPompe: { type: mongoose.Schema.Types.ObjectId, ref: 'Pump' },
  idEmployee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
  quantiteVente: { type: Number, required: true },
  dateVente: { type: Date, required: true, default: Date.now },
  modePaiement: { type: String, enum: ['Espèces', 'Carte', 'Virement'], required: true },
  montant: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Sale', saleSchema);
