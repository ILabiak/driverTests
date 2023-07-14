'use strict';

require('dotenv').config();

const fastify = require('fastify')({
  logger: true,
});

fastify.register(require('@fastify/cors'), {
  origin: '*',
});

fastify.register(require('@fastify/cookie'), {
  secret: process.env.COOKIE_SECRET,
});

fastify.register(require('./routes'));

// Run the server!
fastify.listen({ port: 3005 }, (err) => {
  if (err) throw err;
});

module.exports = fastify;
