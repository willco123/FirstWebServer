//This module is an intermediary for the routes
//Storing them here as to not clog up the server file
//Exporting a lambda function, passing app to it in app

const express = require('express');
const homepage  = require('../routes/homepage');
const users = require('../routes/users');
const posts = require('../routes/posts');
const auth = require('../routes/auth');


module.exports = (app) => {
  app.use(express.json());//Need this to parse JSON objects
  app.use('/auth', auth);
  app.use('/', homepage);
  app.use('/users',users);
  app.use('/posts', posts);
};