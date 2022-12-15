'use strict';
const Answer = require('../models').Answer;

module.exports = {
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

  getByIds(req, res) {
    return Answer.findAll({
      where: {
        id: req.body.ids,
      },
    })
      .then((answers) => {
        if (answers.length === req.body.ids.length) {
          res.status(200).send(answers);
        }
        res
          .status(400)
          .send(new Error('Not all the answers are in database, check ids'));
      })
      .catch((error) => {
        res.status(400).send(error);
      });
  },

  add(req, res) {
    return Answer.create({
      text: req.body.text,
    })
      .then((answer) => res.status(201).send(answer))
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
            text: req.body.text || answer.text,
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
          .then(() =>
            res
              .status(200)
              .send({ message: 'Answer was successfully deleted!' }),
          )
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },
};
