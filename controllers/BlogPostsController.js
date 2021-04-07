const { Router } = require('express');
const { Op } = require('sequelize');
const rescue = require('express-rescue');

const { validateToken } = require('../middlewares/tokenValidation');
const { validateTitle, validateContent } = require('../middlewares/blogPostValidation');

const BlogPostsController = Router();

const { BlogPost, User } = require('../models');

BlogPostsController.get('/search', validateToken, async (req, res) => {
  const serachTerm = req.query;

  const postBySearchTerm = await BlogPost.findAll({
    where: {
      [Op.or]: [
        {
          title: { [Op.like]: `%${serachTerm.q}%` },
        },
        {
          content: { [Op.like]: `%${serachTerm.q}%` },
        },
      ],
    },
    include: { model: User, as: 'user' },
  });

  res.status(200).json(postBySearchTerm);
});

BlogPostsController.get('/', validateToken, async (req, res) => {
  const users = await BlogPost.findAll({
    include: { model: User, as: 'user' },
  });

  res.status(200).json(users);
});

BlogPostsController.get('/:id', validateToken, async (req, res) => {
  const { id } = req.params;

  const postExists = await BlogPost.findOne({
    where: { id },
    include: { model: User, as: 'user' },
  });

  if (!postExists) {
    return res.status(404).json({ message: 'Post não existe' });
  }

  res.status(200).json(postExists);
});

BlogPostsController.post('/post', validateToken, validateTitle, validateContent, rescue(async (req, res) => {
  const { title, content } = req.body;
  const userId = req.user.id;
  let published;

  await BlogPost.create({ title, content, userId, published });

  res.status(201).json({ title, content, userId });
}));

module.exports = BlogPostsController;
