'use strict';
const Answer = require('../models').Answer;

module.exports = {
  list(req, res) {
    return Answer.findAll({
      order: [
        ['createdAt', 'DESC'],
      ],
    })
      .then((answers) => res.status(200).send(answers))
      .catch((error) => {
        res.status(400).send(error);
      });
  },

  getById(req, res) {
    return Answer.findByPk(req.params.id)
      .then((answer) => {
        if (!answer) {
          return res.status(404).send({
            message: 'Answer Not Found',
          });
        }
        return res.status(200).send(answer);
      })
      .catch((error) => {
        console.log(error);
        res.status(400).send(error);
      });
  },

  add(req, res) {
    return Answer.create({
      id: req.body.id,
    })
      .then((classroom) => res.status(201).send(classroom))
      .catch((error) => res.status(400).send(error));
  },

  update(req, res) {
    return Answer.findByPk(req.params.id)
      .then((answer) => {
        if (!answer) {
          return res.status(404).send({
            message: 'Answer Not Found',
          });
        }
        return answer
          .update({
            id: req.body.id || answer.id,
          })
          .then(() => res.status(200).send(answer))
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },

  delete(req, res) {
    return Answer.findByPk(req.params.id)
      .then((answer) => {
        if (!answer) {
          return res.status(400).send({
            message: 'Answer Not Found',
          });
        }
        return answer
          .destroy()
          .then(() => res.status(204).send())
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },
};
