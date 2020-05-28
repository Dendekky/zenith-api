import multer from 'multer';

const storage = multer.diskStorage({
  filename(req, file, cb) {
    cb(null, file.originalname);
  },
});

exports.parseStudentImage = multer({ storage }).fields([
  {
    name: 'name',
  },
  {
    name: 'age',
  },
  {
    name: 'email',
  },
  {
    name: 'password',
  },
  {
    name: 'department',
  },
  {
    name: 'targetExam',
  },
  {
    name: 'phone',
  },
  {
    name: 'address',
  },
  {
    name: 'photo',
  },
]);

exports.parseTutorImage = multer({ storage }).fields([
  {
    name: 'name',
  },
  {
    name: 'age',
  },
  {
    name: 'email',
  },
  {
    name: 'password',
  },
  {
    name: 'department',
  },
  {
    name: 'subjects',
  },
  {
    name: 'phone',
  },
  {
    name: 'address',
  },
  {
    name: 'photo',
  },
]);
