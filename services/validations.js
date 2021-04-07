const { Users } = require('../models');

const validateEmail = (email) => {
  const regex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;
  const emailVerified = regex.test(email);
  return emailVerified;
};

const validate = async (req, res, next) => {
  const { displayName, email, password, image } = req.body;
  if (!email) return res.status(400).json({ message: '"email" is required' });
  if (!password) return res.status(400).json({ message: '"password" is required' });
  if (!image || !displayName) {
    return res.status(400).json({ message: 'the field is required' });
  }
  if (typeof displayName !== 'string' || displayName.length < 8) {
    return res.status(400).json({ message: '"displayName" length must be at least 8 characters long' });
  }
  if (!validateEmail(email)) {
    return res.status(400).json({ message: '"email" must be a valid email' });
  }
  if (password.length !== 6) return res.status(400).json({ message: '"password" length must be 6 characters long' });
  const findEmail = await Users.findOne({ where: { email } });
  if (findEmail) {
    res.status(409).json({ message: 'Usuário já existe' });
  }
  next();
};

const validateLogin = async (req, res, next) => {
  const { email, password } = req.body;
  if (email === '') {
    return res.status(400).json({ message: '"email" is not allowed to be empty' });
  }
  if (password === '') {
    return res.status(400).json({ message: '"password" is not allowed to be empty' });
  }
  if (!email) return res.status(400).json({ message: '"email" is required' });
  if (!password) return res.status(400).json({ message: '"password" is required' });
  const findEmail = await Users.findOne({ where: { email } });
  if (!findEmail) {
    return res.status(400).json({ message: 'Campos inválidos' });
  }
  next();
};

module.exports = {
  validate,
  validateLogin,
};
