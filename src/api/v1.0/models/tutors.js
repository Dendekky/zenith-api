/* eslint-disable linebreak-style */
import mongoose from 'mongoose';

const tutorSchema = mongoose.Schema({
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
  subjects: {
    type: Array,
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

const Tutors = mongoose.model('Tutors', tutorSchema);

module.exports = Tutors;
