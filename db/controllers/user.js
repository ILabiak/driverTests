'use strict';
const User = require('../models').User;
const Session = require('../models').Session;
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { Op } = require('sequelize');

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
      res.status(400).send(new Error('Could not hash password'));
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
          return res.status(401).send({ message: 'Invalid email or password' });
        }

        bcrypt.compare(password, user.password, (err, result) => {
          if (result === true) {
            // Passwords match, user is authenticated
            const sessionId = crypto.randomBytes(32).toString('hex');
            return Session.create({
              session_id: sessionId,
              user_id: user.id,
              expirationDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
            })
              .then((session) => {
                res.setCookie('sessionID', session.session_id, {
                  path: '/',
                  httpOnly: false,
                  // secure: true,
                  expires: session.expirationDate,
                });
                res.status(200).send({ message: 'Login successful' });
              })
              .catch((error) => res.status(400).send(error));
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

  getUserMail(req, res) {
    const { session_id } = req.body;

    Session.findOne({
      where: {
        [Op.and]: [{ session_id }, { expirationDate: { [Op.gt]: new Date() } }],
      },
      include: User,
    }).then((data) => {
      if (!data) {
        return res
          .status(401)
          .send({ message: 'No user found with this session' });
      }
      // console.log(JSON.stringify(data, null, 2));
      res
        .status(200)
        .send({
          user_id: data.user_id,
          email: data.User.email,
          username: data.User.username,
        });
    });
  },
};
