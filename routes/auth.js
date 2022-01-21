const express = require('express');
const router = express.Router();
const {loginArray} = require('./users');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../startup/db');
const {generateAuthToken} = require('../validation/validators');

//This page will be the login page, user will get session token from here upon login
router.get('/', async (req,res) =>{//Get Module here is mostly for testing purposes
  const user  = await db.query('SELECT * FROM users');
  res.send(user);
});

router.post('/', async (req, res) => {


  const user  = await db.query('SELECT * FROM users WHERE username = $1', [req.body.username]);
  isUser = user.rows.length
  if (!isUser) return res.status(400).send('Invalid username or password.');


  userPassword = user.rows[0].password
  console.log(userPassword)//remove this
  const validPassword = await bcrypt.compare(req.body.password, userPassword);
  if (!validPassword) return res.status(400).send('Invalid email or password.');

  const token = generateAuthToken();
  res.send(token);
  

});










// router.post('/' , (req,res) => {
//   const name = req.body.name;

//   const userIndex = loginArray.findIndex(username => username.name === name)
//   if (userIndex === -1)
//     return res.status(400).send('Bad Username or Password')

//   user = loginArray[userIndex]

//   if (user.password  != req.body.password)
//     return res.status(400).send('Bad Username or Password')

//   token = jwt.sign(user, "123")
//   res.send(token)
// })

module.exports = router;
