
const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  idCard: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String, required: true },
  gender: { type: String, enum: ['homme', 'femme'], required: true },
  birthDate: { type: Date, required: true },
  address: { type: String, required: true },
  nationality: { type: String, required: true },
  cnssNumber: { type: String },
  salary: { type: Number, required: true },
  contractType: { type: String, required: true },
  status: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);
