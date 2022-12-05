import { json } from 'express';
import mongoose from 'mongoose';
import PostModel from '../models/Post.js';

export const getOne = async (req, res) => {
  try {
    const id = req.params.id;
    PostModel.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $inc: {
          viewCount: 1,
        },
      },
      {
        returnDocument: 'after',
      },

      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: 'Не удалось получить статью',
          });
        }

        if (!doc) {
          return res.status(404).json({
            message: 'Статья не найдена',
          });
        }

        res.json({
          doc,
        });
      },
    ).populate('user');
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не удалось загрузить статьи',
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate('user').exec();
    res.json({
      posts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не удалось загрузить статьи',
    });
  }
};

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      user: req.userId,
    });

    const post = await doc.save();

    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось загрузить статью',
    });
  }
};

export const remove = async (req, res) => {
  try {
    const id = req.params.id;
    PostModel.findOneAndDelete(
      {
        _id: id,
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: err,
          });
        }

        if (!doc) {
          return res.status(500).json({
            message: 'Статья не найдена',
          });
        }

        res.json({
          success: true,
        });
      },
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось удалить статью',
    });
  }
};

export const update = async (req, res) => {
  try {
    const id = req.params.id;
    await PostModel.updateOne(
      {
        _id: id,
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        tags: req.body.tags,
        user: req.userId,
      },
    );

    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось обновить статью',
    });
  }
};

export const getTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec();

    const tags = posts
      .map((obj) => obj.tags)
      .flat()
      .slice(0, 5);
    res.json({
      tags,
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: 'error',
    });
  }
};
