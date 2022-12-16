'use strict';

const answerController = require('../../db/controllers').answer;
const questionController = require('../../db/controllers').question;
const sectionController = require('../../db/controllers').section;
const userController = require('../../db/controllers').user;

async function routes(fastify /*, options*/) {
  /* Answer Routes */
  fastify.get('/answer/:id', answerController.getById);
  fastify.post('/answer', answerController.add);
  fastify.put('/answer/:id', answerController.update);
  fastify.delete('/answer/:id', answerController.delete);
  fastify.post('/answers', answerController.getByIds);

  /* Question Routes */
  fastify.get(
    '/sectionquestions/:section_id',
    questionController.getBySectionId,
  );
  fastify.get('/question/:id', questionController.getById);
  fastify.post('/question', questionController.add);
  fastify.delete('/question/:id', questionController.delete);

  /* Section Routes */
  fastify.get('/section/:id', sectionController.getById);
  fastify.post('/section', sectionController.add);
  fastify.put('/section/:id', sectionController.update);
  fastify.delete('/section/:id', sectionController.delete);
  fastify.get('/sections', sectionController.list);

  /* User Routes */
  fastify.get('/user/:telegram_id', userController.getByTelegramId);
  fastify.post('/user', userController.add);
  fastify.put('/user/:id', userController.update);
  fastify.delete('/user/:id', userController.delete);
  fastify.get('/users', userController.list);
}

module.exports = routes;
