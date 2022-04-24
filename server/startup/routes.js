const express = require('express');
const homepage  = require('../routes/homepage');
const users = require('../routes/users');
const posts = require('../routes/posts');
const auth = require('../routes/auth');


module.exports = (app) => {
  app.use(express.json());
  app.use('/auth', auth);
  app.use('/', homepage);
  app.use('/users',users);
  app.use('/posts', posts);
};
