const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const ConflictError = require('../errors/conflict-err');
const UnauthorizedError = require('../errors/unauthorized-err');

const { NODE_ENV, JWT_SECRET } = process.env;

const getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFoundError('Нет пользователя с таким id'))
    .then((user) => res.status(200).send(user))
    .catch(next);
};
const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt.hash(password, 10, (error, hash) => {
    User.findOne({ email })
      .then((user) => {
        if (user) return next(new ConflictError('Пользователь уже существует'));
        return User.create({
          name, email, password: hash,
        })
          .then((newUser) => res.status(200).send({
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
          }));
      })
      .catch(next);
  });
};
const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' }),
      });
    })
    .catch((err) => {
      next(new UnauthorizedError(err.message));
    });
};

module.exports = {
  getUserInfo,
  createUser,
  login,
};
