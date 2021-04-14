const CreateUserService = require('../services/CreateUserService');
const GetAllUsersService = require('../services/GetAllUsersService');
const GetUserByIdService = require('../services/GetUserByIdService');

const { NOT_FOUND } = require('../errors/status');

const OK = 200;
const CREATED = 201;

module.exports = {
  async createUser(req, res) {
    const token = await CreateUserService.execute(req.body);

    return res.status(CREATED).json({ token });
  },

  async getAllUsers(_req, res) {
    const users = await GetAllUsersService.execute();

    return res.status(OK).json(users);
  },

  async getUserById(req, res) {
    const user = await GetUserByIdService.execute(req.params);

    if (!user) res.status(NOT_FOUND).json({ message: 'Usuário não existe' });

    return res.status(OK).json(user);
  },
};
