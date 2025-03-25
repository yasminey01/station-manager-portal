
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Définir le schéma pour les entrées de stock
const stockEntrySchema = new mongoose.Schema({
  idProduct: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product',
    required: true
  },
  idFournisseur: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier'
  },
  dateEntree: { 
    type: Date, 
    required: true, 
    default: Date.now 
  },
  quantite: { 
    type: Number, 
    required: true 
  },
  prixAchat: { 
    type: Number, 
    required: true 
  }
}, { timestamps: true });

// Créer le modèle (s'il n'existe pas déjà)
const StockEntry = mongoose.models.StockEntry || mongoose.model('StockEntry', stockEntrySchema);

// Routes pour les entrées de stock
router.get('/', async (req, res) => {
  try {
    const stockEntries = await StockEntry.find()
      .populate('idProduct')
      .populate('idFournisseur');
    res.json({ success: true, data: stockEntries });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const stockEntry = await StockEntry.findById(req.params.id)
      .populate('idProduct')
      .populate('idFournisseur');
    if (!stockEntry) {
      return res.status(404).json({ success: false, error: 'Entrée de stock non trouvée' });
    }
    res.json({ success: true, data: stockEntry });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const newStockEntry = new StockEntry(req.body);
    const savedStockEntry = await newStockEntry.save();
    
    // Charger l'entrée de stock avec ses relations pour la réponse
    const populatedStockEntry = await StockEntry.findById(savedStockEntry._id)
      .populate('idProduct')
      .populate('idFournisseur');
      
    res.status(201).json({ success: true, data: populatedStockEntry });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updatedStockEntry = await StockEntry.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    .populate('idProduct')
    .populate('idFournisseur');
    
    if (!updatedStockEntry) {
      return res.status(404).json({ success: false, error: 'Entrée de stock non trouvée' });
    }
    res.json({ success: true, data: updatedStockEntry });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deletedStockEntry = await StockEntry.findByIdAndDelete(req.params.id);
    if (!deletedStockEntry) {
      return res.status(404).json({ success: false, error: 'Entrée de stock non trouvée' });
    }
    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/stats/stock-value', async (req, res) => {
  try {
    const stockValue = await StockEntry.aggregate([
      { $group: { _id: "$idProduct", total: { $sum: { $multiply: ["$quantite", "$prixAchat"] } } } }
    ]);
    
    res.json({
      success: true,
      data: stockValue
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
