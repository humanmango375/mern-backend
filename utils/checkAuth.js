import jwt from 'jsonwebtoken';

// Проверка на авторизацию
export default (req, res, next) => {
  const token = (req.headers.authorization || '').replace('Bearer ', '');

  if (token) {
    try {
      const decoded = jwt.verify(token, 'secret'); // расшифровка токена

      req.userId = decoded._id;
      next();
    } catch (error) {
      return res.status(403).json({
        message: 'Ошибка верификации',
      });
    }
  } else {
    return res.status(403).json({
      message: 'access denied',
    });
  }
};
