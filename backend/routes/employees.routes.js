
const express = require('express');
const router = express.Router();
const Employee = require('../models/employee.model');

// Obtenir tous les employés
router.get('/', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json({ success: true, data: employees });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Obtenir un employé par ID
router.get('/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ success: false, error: 'Employé non trouvé' });
    }
    res.json({ success: true, data: employee });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Créer un nouvel employé
router.post('/', async (req, res) => {
  try {
    const newEmployee = new Employee(req.body);
    const savedEmployee = await newEmployee.save();
    res.status(201).json({ success: true, data: savedEmployee });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Mettre à jour un employé
router.put('/:id', async (req, res) => {
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    if (!updatedEmployee) {
      return res.status(404).json({ success: false, error: 'Employé non trouvé' });
    }
    res.json({ success: true, data: updatedEmployee });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Supprimer un employé
router.delete('/:id', async (req, res) => {
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
    if (!deletedEmployee) {
      return res.status(404).json({ success: false, error: 'Employé non trouvé' });
    }
    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
