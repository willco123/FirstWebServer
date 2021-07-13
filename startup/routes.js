//This module is an intermediary for the routes
//Storing them here as to not clog up the server file
//Exporting a lambda function, passing the

const express = require('express');
const homepage  = require('../routes/homepage');
const loginPage = require('../routes/loginPage');
const postPage = require('../routes/PostPage');

module.exports = (app) => {
  app.use(express.json());//Need this to parse JSON objects
  app.use('/', homepage);
  app.use('/LoginPage',loginPage);
  app.use('/PostPage', postPage);
};
