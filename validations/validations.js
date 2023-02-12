import { body } from 'express-validator'

export const registerValidation = [
  body('email', 'invalid mail format').isEmail(),
  body('password', 'password must be at least min 5 symbols').isLength({
    min: 5,
  }),
  body('fullName', 'enter full name').isLength({ min: 3 }),
  body('avatarUrl', 'invalid avatar link').optional().isURL(),
]

export const loginValidation = [
  body('email', 'invalid mail format').isEmail(),
  body('password', 'password must be at least min 5 symbols').isLength({
    min: 5,
  }),
]

export const postCreateValidation = [
  body('title', 'enter article title').isLength({ min: 3 }).isString(),
  body('text', 'enter the text of the article')
    .isLength({ min: 10 })
    .isString(),
  body('tags', 'invalid tag format(specify an array)').optional().isString(),
  body('imageUrl', 'invalid image link').optional().isString(),
]

export const addCommentValidation = [
  body(
    'comments.text',
    'enter the text of the comment, must be at least min 10 symbols'
  )
    .isLength({ min: 10 })
    .isString(),
]
