/* eslint-disable linebreak-style */
import mongoose from 'mongoose';

const studentSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  age: {
    type: String,
  },
  department: {
    type: String,
  },
  targetExam: {
    type: String,
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
  },
  photo: {
    type: String,
  },
},
{
  timestamps: true,
});

const Students = mongoose.model('Students', studentSchema);

module.exports = Students;
