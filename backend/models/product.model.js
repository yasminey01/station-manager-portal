
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  nomProduit: { type: String, required: true },
  type: { type: String, required: true },
  date_ajout: { type: Date, default: Date.now },
  unite: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
