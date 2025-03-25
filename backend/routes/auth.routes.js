
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Employee = require('../models/employee.model');
const Attendance = require('../models/attendance.model');

// Connexion employé
router.post('/employee/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Vérifier que l'employé existe
    const employee = await Employee.findOne({ email });
    if (!employee) {
      return res.status(401).json({ 
        success: false, 
        error: 'Email ou mot de passe incorrect' 
      });
    }
    
    // Vérifier si l'employé est actif
    if (employee.status === 'inactif') {
      return res.status(401).json({ 
        success: false, 
        error: 'Compte désactivé' 
      });
    }
    
    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        error: 'Email ou mot de passe incorrect' 
      });
    }
    
    // Créer un token JWT
    const token = jwt.sign(
      { 
        id: employee._id, 
        email: employee.email, 
        role: employee.role 
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: '24h' }
    );
    
    res.json({ 
      success: true, 
      data: { 
        employee: {
          idEmployee: employee._id,
          firstName: employee.firstName,
          lastName: employee.lastName,
          email: employee.email,
          role: employee.role,
          isPresent: employee.isPresent
        }, 
        token 
      } 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Validation du token employé
router.post('/employee/validate', async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(401).json({ success: false, error: 'Token non fourni' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const employee = await Employee.findById(decoded.id);
    if (!employee) {
      return res.status(404).json({ success: false, error: 'Employé non trouvé' });
    }
    
    res.json({ 
      success: true, 
      data: { 
        employee: {
          idEmployee: employee._id,
          firstName: employee.firstName,
          lastName: employee.lastName,
          email: employee.email,
          role: employee.role,
          isPresent: employee.isPresent
        }
      } 
    });
  } catch (error) {
    console.error('Token validation error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Pointage d'entrée
router.post('/employees/:id/check-in', async (req, res) => {
  try {
    const employeeId = req.params.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ success: false, error: 'Employé non trouvé' });
    }
    
    // Vérifier si l'employé a déjà pointé aujourd'hui
    let attendance = await Attendance.findOne({
      employeeId: employeeId,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });
    
    const checkInTime = new Date();
    
    if (!attendance) {
      // Créer un nouvel enregistrement de présence
      attendance = new Attendance({
        employeeId: employeeId,
        date: today,
        checkIn: checkInTime.toISOString(),
        status: 'present'
      });
    } else if (!attendance.checkIn) {
      // Mettre à jour le pointage d'entrée
      attendance.checkIn = checkInTime.toISOString();
      attendance.status = 'present';
    } else {
      return res.status(400).json({ 
        success: false, 
        error: 'Vous avez déjà pointé votre entrée aujourd\'hui' 
      });
    }
    
    await attendance.save();
    
    // Mettre à jour le statut de l'employé
    employee.isPresent = true;
    employee.lastCheckIn = checkInTime;
    await employee.save();
    
    res.json({ 
      success: true, 
      data: {
        idEmployee: employee._id,
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        role: employee.role,
        isPresent: employee.isPresent
      } 
    });
  } catch (error) {
    console.error('Check-in error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Pointage de sortie
router.post('/employees/:id/check-out', async (req, res) => {
  try {
    const employeeId = req.params.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ success: false, error: 'Employé non trouvé' });
    }
    
    // Vérifier si l'employé a pointé son entrée aujourd'hui
    const attendance = await Attendance.findOne({
      employeeId: employeeId,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      },
      checkIn: { $ne: null }
    });
    
    if (!attendance) {
      return res.status(400).json({ 
        success: false, 
        error: 'Vous devez d\'abord pointer votre entrée' 
      });
    }
    
    if (attendance.checkOut) {
      return res.status(400).json({ 
        success: false, 
        error: 'Vous avez déjà pointé votre sortie aujourd\'hui' 
      });
    }
    
    const checkOutTime = new Date();
    attendance.checkOut = checkOutTime.toISOString();
    await attendance.save();
    
    // Mettre à jour le statut de l'employé
    employee.isPresent = false;
    employee.lastCheckOut = checkOutTime;
    await employee.save();
    
    res.json({ 
      success: true, 
      data: {
        idEmployee: employee._id,
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        role: employee.role,
        isPresent: employee.isPresent
      } 
    });
  } catch (error) {
    console.error('Check-out error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Récupérer les présences d'un employé
router.get('/attendance/:id', async (req, res) => {
  try {
    const employeeId = req.params.id;
    const { startDate, endDate } = req.query;
    
    const query = { employeeId: employeeId };
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const attendances = await Attendance.find(query).sort({ date: -1 });
    
    res.json({ success: true, data: attendances });
  } catch (error) {
    console.error('Get attendance error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
