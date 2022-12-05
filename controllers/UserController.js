import UserModel from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';

export const register = async (req, res) => {
  try {
    const { fullname, email, avatarUrl, password } = req.body;

    const salt = await bcrypt.genSalt(10); // Алгоритм шифрования пароля
    const passwordHash = await bcrypt.hash(password, salt); // Шифруем пароль по алгоритму

    const doc = new UserModel({
      email,
      fullname,
      avatarUrl,
      passwordHash,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      'secret',
      {
        expiresIn: '30d',
      },
    );

    res.json({
      ...user._doc,
      token,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err,
    });
  }
};

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({
        message: 'Пользователь не найден',
      });
    }

    const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

    if (!isValidPass) {
      return res.status(400).json({
        message: 'Неверный логин или пароль',
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      'secret',
      { expiresIn: '30d' },
    );
    res.json({
      ...user._doc,
      token,
    });
  } catch (err) {
    console.log(err);
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    const { passwordHash, ...userData } = user._doc;
    res.json(userData);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Произошла ошибка',
    });
  }
};
