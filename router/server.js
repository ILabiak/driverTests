'use strict';

const fastify = require('fastify')({
  // logger: true,
});

fastify.register(require('./routes'));

// Run the server!
fastify.listen({ port: 3005 }, (err) => {
  if (err) throw err;
});

module.exports = fastify;
