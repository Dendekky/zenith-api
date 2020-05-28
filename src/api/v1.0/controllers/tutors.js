import { check, body, validationResult } from 'express-validator';
import Tutors from '../models/tutors';
import { parseTutorImage } from '../config/multerconfig';
import { uploadImage } from '../config/cloudinaryconfig';

exports.createTutor = [
  check('name').isLength({ min: 3 }).withMessage('Please input a name'),
  body('phone').isLength({ min: 3 }).withMessage('Please input a phone number'),
  check('department').isLength({ min: 3 }).withMessage('Please input the department'),

  (req, res) => {
    parseTutorImage(req, res, async (err) => {
      const {
        name, age, email, password, department, subjects, phone, address,
      } = req.body;
      if (err) {
        return res.status(500).send(err);
      }
      const errors = validationResult(req.body);
      if (!errors.isEmpty()) {
        res.status(406).send({
          errors: errors.array(),
        });
      } else {
        try {
          const file = req.files.photo[0].path;
          const image = await uploadImage(file);
          const photo = image.url;
          const tutor = new Tutors({
            name, age, email, password, department, subjects, phone, address, photo,
          });
          const registeredTutor = await Tutors.findOne({ email });
          if (registeredTutor) {
            return res.status(409).send({ error: 'Tutor with this email already exists' });
          }
          tutor.save((err) => {
            if (err) {
              return res.status(500).send({
                error: 'Internal server error',
              });
            }
            res.status(201).send({
              success: 'Tutor saved',
            });
          });
        } catch (err) { res.status(500).send({ error: err.message }); }
      }
    });
  },
];

exports.tutorLogin = [
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
        const tutor = await Tutors.findByCredentials(email, password);
        if (!tutor) {
          return res
            .status(401)
            .send({ error: 'Login failed! Incorrect email' });
        }
        if (!tutor.password) {
          return res
            .status(401)
            .send({ error: 'Login failed! Incorrect password' });
        }
        // if (!tutor.isVerified) {
        //   return res
        //     .status(401)
        //     .send({ error: 'Your account has not been verified.' });
        // }
        const token = await tutor.generateAuthToken();
        res.status(200).send({ tutor, token });
      } catch (error) {
        res.status(500).send(error.message);
      }
    }
  },
];

exports.getAllTutors = (req, res) => Tutors.find({}, (err, posts) => {
  if (err) {
    res.status(500).send({
      status: 500,
      message: 'Internal server error',
    });
  }
  res.status(200).send({
    status: 200,
    posts,
  });
});

exports.getTutor = (req, res) => Tutors.findOne({ _id: req.params.id })
  .populate('comments')
  .then((post) => {
    if (!post) {
      return res.status(500).send({
        message: 'Internal server error',
      });
    }
    return res.status(200).json(post);
  })
  .catch((err) => {
    res.json(err);
  });

exports.updateTutor = [
  check('title').isLength({ min: 3 }).withMessage('Please input a title'),
  body('category').isLength({ min: 3 }).withMessage('input category'),
  check('body').isLength({ min: 3 }).withMessage('Please input the blog'),

  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(406).send({
        errors: errors.array(),
        status: 406,
      });
    } else {
      Tutors.findByIdAndUpdate(
        req.params.id, req.body,
        { upsert: true }, (err, post) => {
          if (err) {
            res.status(500).send({
              message: 'Internal server error',
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

exports.deleteTutor = (req, res) => Tutors.findByIdAndRemove(req.params.id, (err, del) => {
  if (err) {
    res.status(500).send({
      message: 'Internal server error',
    });
  }
  res.status(200).send({
    message: 'post deleted',
  });
});
