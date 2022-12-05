import express from 'express';
import mongoose from 'mongoose';
import { authValidator, postCreateValidation } from './validations.js';
import { checkAuth, handleValidationErrors } from './utils/index.js';
import { UserController, PostController } from './controllers/index.js';
import multer from 'multer';
import cors from 'cors';

mongoose
  .connect(
    'mongodb+srv://Maxim:F1Bf3JsRtpL6zgOA@cluster0.tgruu4m.mongodb.net/blog?retryWrites=true&w=majority',
  )
  .then(() => {
    console.log('Database connected.');
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

// Аутентификация
app.post('/auth/login', UserController.login);
app.get('/auth/me', checkAuth, UserController.getMe);
app.post('/auth/signin', handleValidationErrors, authValidator, UserController.register);

// Запросы к статьям
app.get('/posts', PostController.getAll);
app.get('/posts/tags', PostController.getTags);
app.get('/posts/:id', PostController.getOne);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, PostController.update);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log('ok');
});
