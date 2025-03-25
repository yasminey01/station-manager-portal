
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  role: { type: String, enum: ['admin', 'manager', 'employee'], required: true },
  telephone: { type: String },
  photoUrl: { type: String },
  password: { type: String, required: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  lastLogin: { type: Date }
}, { timestamps: true });

// Méthode pour hasher le mot de passe avant de sauvegarder
userSchema.pre('save', async function(next) {
  // Seulement hacher le mot de passe s'il a été modifié ou est nouveau
  if (!this.isModified('password')) return next();
  
  try {
    // Générer un salt
    const salt = await bcrypt.genSalt(10);
    // Hacher le mot de passe avec le salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Méthode pour comparer les mots de passe
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
