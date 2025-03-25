
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Définir le schéma pour les pompes
const pumpSchema = new mongoose.Schema({
  nomPompe: { type: String, required: true },
  numero: { type: Number },
  statut: { type: String, required: true },
  debit: { type: Number, required: true },
  idStation: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Station'
  }
}, { timestamps: true });

// Créer le modèle (s'il n'existe pas déjà)
const Pump = mongoose.models.Pump || mongoose.model('Pump', pumpSchema);

// Routes pour les pompes
router.get('/', async (req, res) => {
  try {
    const pumps = await Pump.find().populate('idStation');
    res.json({ success: true, data: pumps });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const pump = await Pump.findById(req.params.id).populate('idStation');
    if (!pump) {
      return res.status(404).json({ success: false, error: 'Pompe non trouvée' });
    }
    res.json({ success: true, data: pump });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const newPump = new Pump(req.body);
    const savedPump = await newPump.save();
    
    // Charger la pompe avec ses relations pour la réponse
    const populatedPump = await Pump.findById(savedPump._id).populate('idStation');
      
    res.status(201).json({ success: true, data: populatedPump });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updatedPump = await Pump.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('idStation');
    
    if (!updatedPump) {
      return res.status(404).json({ success: false, error: 'Pompe non trouvée' });
    }
    res.json({ success: true, data: updatedPump });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deletedPump = await Pump.findByIdAndDelete(req.params.id);
    if (!deletedPump) {
      return res.status(404).json({ success: false, error: 'Pompe non trouvée' });
    }
    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
