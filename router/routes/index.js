'use strict';

const answerController = require('../../db/controllers').answer;
const sectionController = require('../../db/controllers').section;

async function routes(fastify /*, options*/) {
  /* Answer Routes */
  fastify.get('/answer/:id', answerController.getById);
  fastify.post('/answer', answerController.add);
  fastify.put('/answer/:id', answerController.update);
  fastify.delete('/answer/:id', answerController.delete);
  fastify.post('/answers', answerController.getByIds);

  /* Section Routes */
  fastify.get('/section/:id', sectionController.getById);
  fastify.post('/section', sectionController.add);
  fastify.put('/section/:id', sectionController.update);
  fastify.delete('/section/:id', sectionController.delete);
  fastify.get('/sections', sectionController.list);

  /* Question Routes */

  /* User Routes */
}

module.exports = routes;
