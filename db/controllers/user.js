'use strict';
const User = require('../models').User;
const bcrypt = require('bcrypt');

const saltRounds = 10;

const hashPassword = (password) => {
  try {
    const hash = bcrypt.hashSync(password, saltRounds);
    return hash;
  } catch (err) {
    return;
  }
};

module.exports = {
  getByTelegramId(req, res) {
    return User.findAll({
      where: {
        telegram_id: req.params.telegram_id,
      },
    })
      .then((user) => {
        res.status(200).send(user);
      })
      .catch((error) => {
        res.status(400).send(error);
      });
  },

  list(req, res) {
    return User.findAll()
      .then((users) => res.status(200).send(users))
      .catch((error) => {
        res.status(400).send(error);
      });
  },

  add(req, res) {
    const passwordHash = hashPassword(req.body.password);
    if (passwordHash) {
      return User.create({
        telegram_id: req.body.telegram_id,
        username: req.body.username,
        email: req.body.email,
        password: passwordHash,
      })
        .then((user) => res.status(201).send(user))
        .catch((error) => res.status(400).send(error));
    } else {
      res.status(400).send(new Error('Couldn\'t hash password'));
    }
  },

  update(req, res) {
    return User.findByPk(req.params.id)
      .then((user) => {
        if (!user) {
          return res.status(404).send({
            message: 'User Not Found',
          });
        }
        return user
          .update({
            username: req.body.username || user.username,
            email: req.body.email || user.email,
            telegram_id: req.body.telegram_id || user.telegram_id,
            password: req.body.password || user.password,
          })
          .then(() => res.status(200).send(user))
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },

  delete(req, res) {
    return User.findByPk(req.params.id)
      .then((user) => {
        if (!user) {
          return res.status(400).send({
            message: 'User Not Found',
          });
        }
        return user
          .destroy()
          .then(() =>
            res.status(200).send({ message: 'User was successfully deleted!' }),
          )
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },

  login(req, res) {
    const { email, password } = req.body;

    User.findOne({ where: { email } })
      .then((user) => {
        if (!user) {
          return res
            .status(401)
            .send({ message: 'Invalid email or password' });
        }

        bcrypt.compare(password, user.password, (err, result) => {
          if (result === true) {
            // Passwords match, user is authenticated
            return res.status(200).send({ message: 'Login successful' });
          } else {
            // Passwords don't match, authentication failed
            return res
              .status(401)
              .send({ message: 'Invalid email or password' });
          }
        });
      })
      .catch((error) => res.status(400).send(error));
  },
};
