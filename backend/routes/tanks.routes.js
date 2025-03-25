
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Définir le schéma pour les citernes
const tankSchema = new mongoose.Schema({
  capacite: { type: Number, required: true },
  dateInstallation: { type: Date, required: true },
  typeCarburant: { type: String, required: true },
  statut: { type: String, required: true },
  idStation: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Station'
  },
  niveauActuel: { type: Number }
}, { timestamps: true });

// Créer le modèle (s'il n'existe pas déjà)
const Tank = mongoose.models.Tank || mongoose.model('Tank', tankSchema);

// Routes pour les citernes
router.get('/', async (req, res) => {
  try {
    const tanks = await Tank.find().populate('idStation');
    res.json({ success: true, data: tanks });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const tank = await Tank.findById(req.params.id).populate('idStation');
    if (!tank) {
      return res.status(404).json({ success: false, error: 'Citerne non trouvée' });
    }
    res.json({ success: true, data: tank });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const newTank = new Tank(req.body);
    const savedTank = await newTank.save();
    
    // Charger la citerne avec ses relations pour la réponse
    const populatedTank = await Tank.findById(savedTank._id).populate('idStation');
      
    res.status(201).json({ success: true, data: populatedTank });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updatedTank = await Tank.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('idStation');
    
    if (!updatedTank) {
      return res.status(404).json({ success: false, error: 'Citerne non trouvée' });
    }
    res.json({ success: true, data: updatedTank });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deletedTank = await Tank.findByIdAndDelete(req.params.id);
    if (!deletedTank) {
      return res.status(404).json({ success: false, error: 'Citerne non trouvée' });
    }
    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
