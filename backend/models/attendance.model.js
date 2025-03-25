
const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  employeeId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Employee', 
    required: true 
  },
  date: { 
    type: Date, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['present', 'absent', 'late'], 
    default: 'absent' 
  },
  checkIn: { 
    type: String 
  },
  checkOut: { 
    type: String 
  },
  comments: { 
    type: String,
    default: ''
  }
}, { 
  timestamps: true 
});

// Index pour accélérer les recherches par employé et date
attendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
