import express from 'express'
import multer from 'multer'
import mongoose from 'mongoose'
import cors from 'cors'
import {
  registerValidation,
  loginValidation,
  postCreateValidation,
  addCommentValidation,
} from './validations/validations.js'
import { checkAuth, handelValidationsErrors } from './utils/index.js'
import { PostController, UserController } from './controllers/index.js'

mongoose
  .connect(
    'mongodb+srv://admin:yygelrun@cluster0.wvcw5io.mongodb.net/blog?retryWrites=true&w=majority'
  )
  .then(() => console.log('DB ok'))
  .catch((err) => console.log('DB err', err))

const app = express()

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads')
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname)
  },
})

const upload = multer({ storage })

app.use(express.json())

app.use(cors())

app.use('/uploads', express.static('uploads'))

app.get('/auth/me', checkAuth, UserController.authMe)

app.post(
  '/auth/login',
  loginValidation,
  handelValidationsErrors,
  UserController.login
)

app.post(
  '/auth/register',
  registerValidation,
  handelValidationsErrors,
  UserController.register
)

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `uploads/${req.file.originalname}`,
  })
})

app.get('/tags', PostController.getLastTegs)

app.get('/posts', PostController.getAll)

app.get('/posts/date', PostController.findByDate)

app.get('/posts/views', PostController.findByViews)

app.get('posts/tags', PostController.getLastTegs)

app.get('/posts/comments', PostController.getComments)

app.get('/posts/:id', PostController.getOne)

app.delete('/posts/:id', checkAuth, PostController.remove)

app.post(
  '/posts',
  checkAuth,
  postCreateValidation,
  handelValidationsErrors,
  PostController.create
)

app.patch(
  '/posts/:id',
  checkAuth,
  postCreateValidation,
  handelValidationsErrors,
  PostController.update
)

app.patch(
  '/posts/comments/:id',
  checkAuth,
  addCommentValidation,
  handelValidationsErrors,
  PostController.addComment
)

app.listen(4444, (err) => {
  if (err) return console.log(err)
  console.log('Server OK')
})
