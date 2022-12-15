'use strict';
const Section = require('../models').Section;

module.exports = {
  getById(req, res) {
    return Section.findByPk(req.params.id)
      .then((section) => {
        if (!section) {
          return res.status(404).send({
            message: 'Section Not Found',
          });
        }
        return res.status(200).send(section);
      })
      .catch((error) => {
        console.log(error);
        res.status(400).send(error);
      });
  },

  list(req, res) {
    return Section.findAll()
      .then((sections) => res.status(200).send(sections))
      .catch((error) => {
        res.status(400).send(error);
      });
  },

  add(req, res) {
    return Section.create({
      name: req.body.name,
    })
      .then((answer) => res.status(201).send(answer))
      .catch((error) => res.status(400).send(error));
  },

  update(req, res) {
    return Section.findByPk(req.params.id)
      .then((section) => {
        if (!section) {
          return res.status(404).send({
            message: 'Section Not Found',
          });
        }
        return section
          .update({
            name: req.body.name || section.name,
          })
          .then(() => res.status(200).send(section))
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },

  delete(req, res) {
    return Section.findByPk(req.params.id)
      .then((section) => {
        if (!section) {
          return res.status(400).send({
            message: 'Section Not Found',
          });
        }
        return section
          .destroy()
          .then(() =>
            res
              .status(200)
              .send({ message: 'Section was successfully deleted!' }),
          )
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },
};
