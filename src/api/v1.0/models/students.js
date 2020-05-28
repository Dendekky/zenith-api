/* eslint-disable linebreak-style */
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
// import crypto from 'crypto';

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

studentSchema.pre('save', async function (next) {
  // Hash the password before saving the student model
  const student = this;
  if (student.isModified('password')) {
    student.password = await bcrypt.hash(student.password, 8);
  }
  next();
});

studentSchema.methods.generateAuthToken = async function () {
  // Generate an auth token for the student
  const student = this;
  const payload = {
    email: student.email,
    _id: student._id,
    time: new Date(),
  };
  const token = jwt.sign(payload, process.env.JWT_KEY, {
    expiresIn: '6h',
  });
  await student.save();
  return token;
};

studentSchema.statics.findByCredentials = async (email, password) => {
  // Search for a student by email and password.
  const student = await Students.findOne({ email });
  if (!student) {
    return student;
  }
  const isPasswordMatch = await bcrypt.compare(password, student.password);
  if (!isPasswordMatch) {
    return ({ password: isPasswordMatch });
  }
  return student;
};

// studentSchema.methods.generateVerificationToken = function () {
//   const payload = {
//     studentId: this._id,
//     token: crypto.randomBytes(20).toString('hex'),
//   };

//   return new Token(payload);
// };

// studentSchema.methods.generatePasswordReset = function () {
//   this.resetPasswordToken = crypto.randomBytes(20).toString('hex');
//   this.resetPasswordExpires = Date.now() + 3600000; // expires in an hour
// };

const Students = mongoose.model('Students', studentSchema);

module.exports = Students;
