import { check, body, validationResult } from 'express-validator';
import Students from '../models/students';
import { parseStudentImage } from '../config/multerconfig';
import { uploadImage } from '../config/cloudinaryconfig';


const createStudent = [
  check('name').isLength({ min: 3 }).withMessage('Please input a name'),
  body('phone').isLength({ min: 3 }).withMessage('Please input a phone number'),
  check('department').isLength({ min: 3 }).withMessage('Please input the department'),

  (req, res) => {
    parseStudentImage(req, res, async (err) => {
      const {
        name, age, email, password, department, targetExam, phone, address,
      } = req.body;
      if (err) {
        return res.status(500).send(err);
      }
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(406).send({
          errors: errors.array(),
        });
      } else {
        try {
          const file = req.files.photo[0].path;
          const image = await uploadImage(file);
          const photo = image.url;
          const student = new Students({
            name, age, email, password, department, targetExam, phone, address, photo,
          });
          const registeredStudent = await Students.findOne({ email });
          if (registeredStudent) {
            return res.status(409).send({ error: 'Student with this email already exists' });
          }
          student.save((err) => {
            if (err) {
              return res.status(500).send({
                error: 'Internal server error',
              });
            }
            res.status(201).send({
              success: 'saved to student',
            });
          });
        } catch (err) { res.status(500).send({ error: err.message }); }
      }
    });
  },
];

const studentLogin = [
  body('email')
    .isEmail()
    .withMessage('Type in an actual email')
    .normalizeEmail(),
  check('password')
    .isLength({ min: 4 })
    .withMessage('must be at least 4 characters long'),
  async (req, res) => {
    const errors = await validationResult(req);
    if (!errors.isEmpty()) {
      res.status(406).send({
        errors: errors.array(),
      });
    } else {
      try {
        const { email, password } = req.body;
        const student = await Students.findByCredentials(email, password);
        if (!student) {
          return res
            .status(401)
            .send({ error: 'Login failed! Incorrect email' });
        }
        if (!student.password) {
          return res
            .status(401)
            .send({ error: 'Login failed! Incorrect password' });
        }
        // if (!student.isVerified) {
        //   return res
        //     .status(401)
        //     .send({ error: 'Your account has not been verified.' });
        // }
        const token = await student.generateAuthToken();
        res.status(200).send({ student, token });
      } catch (error) {
        res.status(500).send(error.message);
      }
    }
  },
];

const getAllStudents = (req, res) => Students.find({}, (err, students) => {
  if (err) {
    res.status(500).send({
      error: 'Internal server error',
    });
  }
  res.status(200).send({
    students,
  });
});


const getStudent = (req, res) => Students.findById(req.params.id, (err, student) => {
  if (err) {
    res.status(500).send({
      error: 'Internal server error',
    });
  }
  res.status(200).send({
    student,
  });
});


const updateStudent = [
  check('name').isLength({ min: 3 }).withMessage('Please input a name'),
  body('phone').isLength({ min: 3 }).withMessage('Please input a phone number'),
  check('department').isLength({ min: 3 }).withMessage('Please input the department'),

  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(406).send({
        errors: errors.array(),
      });
    } else {
      Students.findByIdAndUpdate(
        req.params.id, req.body,
        { upsert: true }, (err, student) => {
          if (err) {
            res.status(500).send({
              error: 'Internal server error',
            });
          }
          res.status(201).send({
            message: 'update successful',
          });
        },
      );
    }
  },
];

const deleteStudent = (req, res) => Students.findByIdAndRemove(req.params.id, (err, del) => {
  if (err) {
    res.status(500).send({
      error: 'Internal server error',
    });
  }
  res.status(200).send({
    message: 'student deleted',
  });
});


module.exports = {
  createStudent,
  studentLogin,
  getAllStudents,
  getStudent,
  updateStudent,
  deleteStudent,
};
