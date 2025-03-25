
const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Middleware pour vérifier le token JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, error: 'Accès non autorisé' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, error: 'Token invalide ou expiré' });
    }
    req.user = user;
    next();
  });
};

// Middleware pour vérifier le rôle admin
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Accès restreint aux administrateurs' });
  }
  next();
};

// Route de connexion
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Vérifier que l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, error: 'Email ou mot de passe incorrect' });
    }
    
    // Vérifier si l'utilisateur est actif
    if (user.status === 'inactive') {
      return res.status(401).json({ success: false, error: 'Compte désactivé' });
    }
    
    // Vérifier le mot de passe
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Email ou mot de passe incorrect' });
    }
    
    // Mettre à jour la date de dernière connexion
    user.lastLogin = new Date();
    await user.save();
    
    // Créer un token JWT
    const token = jwt.sign(
      { 
        id: user._id, 
        email: user.email, 
        role: user.role 
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: '24h' }
    );
    
    // Renvoyer les données de l'utilisateur sans le mot de passe
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.json({ 
      success: true, 
      data: { 
        user: userResponse, 
        token 
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Obtenir tous les utilisateurs (admin uniquement)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Obtenir un utilisateur par ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    // Vérifier que l'utilisateur a accès à cette ressource
    if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
      return res.status(403).json({ success: false, error: 'Accès non autorisé' });
    }
    
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, error: 'Utilisateur non trouvé' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Créer un nouvel utilisateur (admin uniquement)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Vérifier si l'email existe déjà
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'Cet email est déjà utilisé' });
    }
    
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    
    // Ne pas renvoyer le mot de passe dans la réponse
    const userResponse = savedUser.toObject();
    delete userResponse.password;
    
    res.status(201).json({ success: true, data: userResponse });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Mettre à jour un utilisateur
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    // Vérifier que l'utilisateur a accès à cette ressource
    if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
      return res.status(403).json({ success: false, error: 'Accès non autorisé' });
    }
    
    const userId = req.params.id;
    
    // Si c'est l'utilisateur lui-même qui se met à jour, il ne peut pas changer son rôle
    if (req.user.id === userId && req.body.role && req.body.role !== req.user.role) {
      return res.status(403).json({ success: false, error: 'Vous ne pouvez pas changer votre propre rôle' });
    }
    
    // Si le mot de passe est modifié, le hacher
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      userId, 
      req.body, 
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!updatedUser) {
      return res.status(404).json({ success: false, error: 'Utilisateur non trouvé' });
    }
    
    res.json({ success: true, data: updatedUser });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Mettre à jour le mot de passe
router.put('/:id/password', authenticateToken, async (req, res) => {
  try {
    // Vérifier que l'utilisateur a accès à cette ressource
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ success: false, error: 'Accès non autorisé' });
    }
    
    const { currentPassword, newPassword } = req.body;
    
    // Vérifier l'ancien mot de passe
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'Utilisateur non trouvé' });
    }
    
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, error: 'Le mot de passe actuel est incorrect' });
    }
    
    // Mettre à jour avec le nouveau mot de passe
    user.password = newPassword;
    await user.save();
    
    res.json({ success: true, message: 'Mot de passe mis à jour avec succès' });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Supprimer un utilisateur (admin uniquement)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Vérifier qu'un admin ne se supprime pas lui-même
    if (req.user.id === req.params.id) {
      return res.status(400).json({ success: false, error: 'Vous ne pouvez pas supprimer votre propre compte' });
    }
    
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ success: false, error: 'Utilisateur non trouvé' });
    }
    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Changer le statut d'un utilisateur (activer/désactiver)
router.patch('/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    
    // Vérifier le statut fourni
    if (!['active', 'inactive'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Statut invalide' });
    }
    
    // Vérifier qu'un admin ne désactive pas son propre compte
    if (req.user.id === req.params.id && status === 'inactive') {
      return res.status(400).json({ success: false, error: 'Vous ne pouvez pas désactiver votre propre compte' });
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!updatedUser) {
      return res.status(404).json({ success: false, error: 'Utilisateur non trouvé' });
    }
    
    res.json({ success: true, data: updatedUser });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;
