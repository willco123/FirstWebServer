const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const db = require('../startup/db');
const {validateUser, generateAuthToken} = require('../validation/validators');
//const logger = require('winston');
const _ = require('lodash');


router.get('/', async (req,res) => {

  try{
  users = await db.query('SELECT * FROM users')
  res.send(users.rows)
  }
  catch(err){
    console.log(err.stack);
  }
  
});

router.get('/:id', async (req,res) => {
  //Is JWT in response?
  try{
  users = await db.query('SELECT * FROM users WHERE user_id = $1', [req.params.id])
  res.send(users.rows)
  }
  catch(err){
    console.log(err.stack);
  }

});

router.post('/', async (req,res) => {
  const {error} = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const {username, password, email} = req.body;
  

  //need to handle promise rejection
  try{
    var usernameExists = await db.query('SELECT * FROM users WHERE username = $1', [username]);
    if (usernameExists.rowCount) return res.status(400).send('Username Is already Taken')//Ensure uniqueness

    var emailExists = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (emailExists.rowCount) return res.status(400).send('Email Is already Taken')//Ensure uniqueness

    await db.query('INSERT INTO users (username, password, email, created_on)\
                    VALUES($1, $2, $3, $4)', [username, password, email, new Date()] );
    //res.status(201).send('Successfully added new user');
    const token = generateAuthToken();
    res.set('x-auth-token', token).status(201).send('Successfully added new user');

  }
  catch(err){
    console.log(err.stack);
  }

    // const token = generateAuthToken;
    // res.set('x-auth-token', token).status(201).send('Successfully added new user');

});


router.put('/:id', async (req,res) => {//Make sure to change ID's to random generated strings??
  const {error} = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);


  const id = req.params.id;
  const {username, password, rank} = req.body;



  try{
    await db.query('UPDATE users SET name = $1, password = $2, rank = $3 \
                    WHERE id = $4',
                    [username, password, rank, id]);
    //return modified user
    res.status(200).send('Record Successfully Updated');
  }
  catch(err){
    console.log(err.stack)
  }

})

router.delete('/:id', async (req,res) => {
  try{
    deletedItem = await db.query('DELETE FROM users WHERE id=$1 RETURNING *',
                                   [req.params.id])
    if (deletedItem.rowCount === 0)//If rowCount==0 no item found in table with that id, 1 otherwise
      return res.status(404)
        .send('A customer with the given ID was not found')
    res.status(201).send('Record Successfully deleted')
  }
  catch(err){
    console.log(err.stack)
  }
})


function isPositiveInt(str){//extract this if ever re-used
  var output = Math.floor(Number(str));
  return String(output) === str && output >= 0;
}


module.exports = router;


