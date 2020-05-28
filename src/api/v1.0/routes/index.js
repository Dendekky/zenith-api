/* eslint-disable linebreak-style */
import {
  createTutor, getTutor, getAllTutors, updateTutor, deleteTutor
} from '../controllers/tutors';
import {
  createStudent, getStudent, getAllStudents, updateStudent, deleteStudent
} from '../controllers/students';
import { login } from '../controllers/admin';
import { checkAuth } from '../middlewares/auth';

module.exports = (app) => {
  app.get('/api', (req, res) => res.status(200).send({
    message: 'Welcome to the  Zenith API!',
  }));

  app.post('/api/login', login);
  // app.post('/api/register', authController.register);
  // app.get('/api/users', authController.userList);
  app.post('/api/student', createStudent);
  app.get('/api/student', getAllStudents);
  app.get('/api/student/:id', getStudent);
  app.put('/api/student/:id', updateStudent);
  app.delete('/api/student/:id', checkAuth, deleteStudent);

  app.get('/api/tutor', getAllTutors);
  app.post('/api/tutor', createTutor);
  app.get('/api/tutor/:id', getTutor);
  app.put('/api/tutor/:id', updateTutor);
  app.delete('/api/tutor/:id', checkAuth, deleteTutor);

  app.get('/api/checkToken', checkAuth, (req, res) => {
    res.sendStatus(200);
  });
};
