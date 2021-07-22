const express = require('express');
const router = express.Router();
const {loginArray} = require('./users');
const jwt = require('jsonwebtoken');

router.post('/' , (req,res) => {
  const name = req.body.name;

  const userIndex = loginArray.findIndex(username => username.name === name)
  if (userIndex === -1)
    return res.status(400).send('Bad Username or Password')

  user = loginArray[userIndex]

  if (user.password  != req.body.password)
    return res.status(400).send('Bad Username or Password')

  token = jwt.sign(user, "123")
  res.send(token)
})

module.exports = router;
