
const express = require('express');
const router = express.Router();
const Station = require('../models/station.model');

// Obtenir toutes les stations
router.get('/', async (req, res) => {
  try {
    const stations = await Station.find();
    res.json({ success: true, data: stations });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Obtenir une station par ID
router.get('/:id', async (req, res) => {
  try {
    const station = await Station.findById(req.params.id);
    if (!station) {
      return res.status(404).json({ success: false, error: 'Station non trouvée' });
    }
    res.json({ success: true, data: station });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Créer une nouvelle station
router.post('/', async (req, res) => {
  try {
    const newStation = new Station(req.body);
    const savedStation = await newStation.save();
    res.status(201).json({ success: true, data: savedStation });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Mettre à jour une station
router.put('/:id', async (req, res) => {
  try {
    const updatedStation = await Station.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    if (!updatedStation) {
      return res.status(404).json({ success: false, error: 'Station non trouvée' });
    }
    res.json({ success: true, data: updatedStation });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Supprimer une station
router.delete('/:id', async (req, res) => {
  try {
    const deletedStation = await Station.findByIdAndDelete(req.params.id);
    if (!deletedStation) {
      return res.status(404).json({ success: false, error: 'Station non trouvée' });
    }
    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
