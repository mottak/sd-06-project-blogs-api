const { Router } = require('express');

const routes = Router();
const { Users } = require('../models');
const verifyEmail = require('../middlewares/verifyEmail');
const verifyName = require('../middlewares/verifyName');
const verifyPassword = require('../middlewares/verifyPassword');
const verifyAuthorization = require('../middlewares/verifyAuthorization');
const createToken = require('../auth/createToken');

routes.post('/', verifyEmail, verifyName, verifyPassword, async (req, res) => {
  const { displayName, email, password, image } = req.body;

  const userAlreadyExists = await Users.findOne({ where: { email } });

  if (userAlreadyExists) {
    return res.status(409).json({ message: 'Usuário já existe' });
  }

  const token = createToken({ displayName, email, password, image });
  await Users.create({ displayName, email, password, image });

  return res.status(201).json({ token });
});

routes.get('/', verifyAuthorization, async (req, res) => {
  const users = await Users.findAll({});

  return res.status(200).json(users);
});

routes.get('/:id', verifyAuthorization, async (req, res) => {
  const { id } = req.params;
  console.log(id);

  const user = await Users.findOne({ where: { id } });

  if (!user) return res.status(404).json({ message: 'Usuário não existe' });

  return res.status(200).json(user);
});

module.exports = { routes };
