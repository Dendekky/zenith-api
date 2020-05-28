/* eslint-disable linebreak-style */
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
// import crypto from 'crypto';

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
  email: {
    type: String,
  },
  password: {
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

tutorSchema.pre('save', async function (next) {
  // Hash the password before saving the tutor model
  const tutor = this;
  if (tutor.isModified('password')) {
    tutor.password = await bcrypt.hash(tutor.password, 8);
  }
  next();
});

tutorSchema.methods.generateAuthToken = async function () {
  // Generate an auth token for the tutor
  const tutor = this;
  const payload = {
    email: tutor.email,
    _id: tutor._id,
    time: new Date(),
  };
  const token = jwt.sign(payload, process.env.JWT_KEY, {
    expiresIn: '6h',
  });
  await tutor.save();
  return token;
};

tutorSchema.statics.findByCredentials = async (email, password) => {
  // Search for a tutor by email and password.
  const tutor = await Tutors.findOne({ email });
  if (!tutor) {
    return tutor;
  }
  const isPasswordMatch = await bcrypt.compare(password, tutor.password);
  if (!isPasswordMatch) {
    return ({ password: isPasswordMatch });
  }
  return tutor;
};

// tutorSchema.methods.generateVerificationToken = function () {
//   const payload = {
//     tutorId: this._id,
//     token: crypto.randomBytes(20).toString('hex'),
//   };

//   return new Token(payload);
// };

// tutorSchema.methods.generatePasswordReset = function () {
//   this.resetPasswordToken = crypto.randomBytes(20).toString('hex');
//   this.resetPasswordExpires = Date.now() + 3600000; // expires in an hour
// };

const Tutors = mongoose.model('Tutors', tutorSchema);

module.exports = Tutors;
