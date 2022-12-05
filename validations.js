import { body } from 'express-validator';

export const authValidator = [
  body('email').isEmail(),
  body('password').isLength({ min: 5 }),
  body('fullname').isLength({ min: 5 }),
  body('avatarUrl').optional().isURL(),
];

export const postCreateValidation = [
  body('title', 'Некорректный заголовок').isLength({ min: 5 }).isString(),
  body('text', 'Некорректный текст статьи').isLength({ min: 10 }).isString(),
  body('tags').optional().isArray(),
  body('imageUrl', 'Не удалось загрузить изображение').optional().isString(),
];
