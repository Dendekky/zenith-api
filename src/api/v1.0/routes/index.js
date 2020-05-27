/* eslint-disable linebreak-style */
import {
  createPost, getPost, getAllPosts, updatePost, deletePost, createComment
} from '../controllers/tutors';
import { checkAuth } from '../middlewares/auth'

const authController = require('../controllers').admin;
const draftController = require('../controllers').blogdrafts;

module.exports = (app) => {
  app.get('/api', (req, res) => res.status(200).send({
    message: 'Welcome to the  Zenith API!',
  }));

  app.post('/api/login', authController.login);
  // app.post('/api/register', authController.register);
  // app.get('/api/users', authController.userList);
  // Drafts routes
  app.post('/api/draft', draftController.createDraft);
  app.get('/api/draft/:id', draftController.getDraft);
  app.put('/api/draft/:id', draftController.updateDraft);
  app.delete('/api/draft/:id', draftController.deleteDraft);
  app.get('/api/draft', checkAuth, draftController.getAllDrafts);
  // Posts routes
  app.get('/api/post', getAllPosts);
  app.post('/api/post', createPost);
  app.get('/api/post/:id', getPost);
  app.put('/api/post/:id', updatePost);
  app.delete('/api/post/:id', deletePost);
  // Comment routes
  app.post('/api/comment', createComment);

  app.get('/api/checkToken', checkAuth, (req, res) => {
    res.sendStatus(200);
  });
};
