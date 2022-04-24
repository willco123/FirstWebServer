const express = require('express');
const router = express.Router();
const {loginArray} = require('./users');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../startup/db');
const {generateAuthToken} = require('../utils/validators');
const _ = require('lodash');

//This page will be the login page, user will get session token from here upon login
//Can get a new token here
router.get('/', async (req,res) =>{//Get Module here is mostly for testing purposes
  const user  = await db.query('SELECT * FROM users');
  res.send(user);
});

router.post('/', async (req, res) => {


  const user  = await db.query('SELECT * FROM users WHERE username = $1', [req.body.username]);
  isUser = user.rows.length
  if (!isUser) return res.status(400).send('Invalid username or password.');


  userPassword = user.rows[0].password
  const validPassword = await bcrypt.compare(req.body.password, userPassword);
  if (!validPassword) return res.status(400).send('Invalid username or password.');

  const token = generateAuthToken(user.rows[0].user_id, user.rows[0].rank);


  return res.set('x-auth-token', [token]).send('Login Successful')
});


module.exports = router;
