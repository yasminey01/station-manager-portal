
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Définir le schéma pour les fournisseurs
const supplierSchema = new mongoose.Schema({
  nomFournisseur: { type: String, required: true },
  adresseFournisseur: { type: String, required: true },
  telephoneFournisseur: { type: String, required: true },
  emailFournisseur: { type: String },
  typeFournisseur: { type: String },
  contactFournisseur: { type: String }
}, { timestamps: true });

// Créer le modèle (s'il n'existe pas déjà)
const Supplier = mongoose.models.Supplier || mongoose.model('Supplier', supplierSchema);

// Routes pour les fournisseurs
router.get('/', async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    res.json({ success: true, data: suppliers });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res.status(404).json({ success: false, error: 'Fournisseur non trouvé' });
    }
    res.json({ success: true, data: supplier });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const newSupplier = new Supplier(req.body);
    const savedSupplier = await newSupplier.save();
    res.status(201).json({ success: true, data: savedSupplier });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updatedSupplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedSupplier) {
      return res.status(404).json({ success: false, error: 'Fournisseur non trouvé' });
    }
    res.json({ success: true, data: updatedSupplier });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deletedSupplier = await Supplier.findByIdAndDelete(req.params.id);
    if (!deletedSupplier) {
      return res.status(404).json({ success: false, error: 'Fournisseur non trouvé' });
    }
    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
