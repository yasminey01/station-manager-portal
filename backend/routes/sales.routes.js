
const express = require('express');
const router = express.Router();
const Sale = require('../models/sale.model');

// Obtenir toutes les ventes
router.get('/', async (req, res) => {
  try {
    const sales = await Sale.find()
      .populate('idPompe')
      .populate('idEmployee');
    res.json({ success: true, data: sales });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Obtenir une vente par ID
router.get('/:id', async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id)
      .populate('idPompe')
      .populate('idEmployee');
    if (!sale) {
      return res.status(404).json({ success: false, error: 'Vente non trouvée' });
    }
    res.json({ success: true, data: sale });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Créer une nouvelle vente
router.post('/', async (req, res) => {
  try {
    const newSale = new Sale(req.body);
    const savedSale = await newSale.save();
    
    // Charger la vente avec les relations pour la réponse
    const populatedSale = await Sale.findById(savedSale._id)
      .populate('idPompe')
      .populate('idEmployee');
      
    res.status(201).json({ success: true, data: populatedSale });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Mettre à jour une vente
router.put('/:id', async (req, res) => {
  try {
    const updatedSale = await Sale.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    )
    .populate('idPompe')
    .populate('idEmployee');
    
    if (!updatedSale) {
      return res.status(404).json({ success: false, error: 'Vente non trouvée' });
    }
    res.json({ success: true, data: updatedSale });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Supprimer une vente
router.delete('/:id', async (req, res) => {
  try {
    const deletedSale = await Sale.findByIdAndDelete(req.params.id);
    if (!deletedSale) {
      return res.status(404).json({ success: false, error: 'Vente non trouvée' });
    }
    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Obtenir des statistiques sur les ventes
router.get('/stats/summary', async (req, res) => {
  try {
    const totalSales = await Sale.countDocuments();
    const totalRevenue = await Sale.aggregate([
      { $group: { _id: null, total: { $sum: "$montant" } } }
    ]);
    
    const salesByPaymentMethod = await Sale.aggregate([
      { $group: { _id: "$modePaiement", count: { $sum: 1 }, total: { $sum: "$montant" } } }
    ]);
    
    res.json({
      success: true,
      data: {
        totalSales,
        totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
        salesByPaymentMethod
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
