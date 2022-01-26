const express = require('express');
const router = express.Router();
const {auth, admin} = require('../middleware/auth');
//const admin = require('../middleware/admin');
const db = require('../startup/db');
const {validateUser, generateAuthToken} = require('../validation/validators');
//const logger = require('winston');
const _ = require('lodash');
const bcrypt= require("bcrypt");



router.get('/', [auth], async (req,res) => {

  try{
  users = await db.query('SELECT * FROM users')
  res.send(users.rows)
  }
  catch(err){
    console.log(err.stack);
  }
  
});

router.get('/:id', [auth], async (req,res) => {
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

  var {username, password, email} = req.body;
  

  //need to handle promise rejection
  try{
    var usernameExists = await db.query('SELECT * FROM users WHERE username = $1', [username]);
    if (usernameExists.rowCount) return res.status(400).send('Username Is already Taken')//Ensure uniqueness

    var emailExists = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (emailExists.rowCount) return res.status(400).send('Email Is already Taken')//Ensure uniqueness

    //Hash and Salt User Password
    const salt = await bcrypt.genSalt(10)
    password = await bcrypt.hash(password, salt);

    const user = await db.query('INSERT INTO users (username, password, email, created_on)\
                    VALUES($1, $2, $3, $4) RETURNING user_id', [username, password, email, new Date()] );
    
    //Get token
    const token = generateAuthToken(user.rows[0].user_id)
    res.set('x-auth-token', token).status(201).send('Successfully added new user');

  }
  catch(err){
    console.log(err.stack);
  }


});


router.put('/:id', [auth, admin], async (req,res) => {//Make sure to change ID's to random generated strings?? //This edit is for admins to change uname/password/email
  const {error} = validateUser(req.body);             //There will be another page for users to change only password
  if (error) return res.status(400).send(error.details[0].message);


  const id = req.params.id;
  var {username, password, email} = req.body;

  //add in salt/hash
  const salt = await bcrypt.genSalt(10)
  password = await bcrypt.hash(password, salt);

  try{
    await db.query('UPDATE users SET username = $1, password = $2, email = $3 \
                    WHERE user_id = $4',
                    [username, password, email, id]);
    //return modified user
    res.status(200).send('Record Successfully Updated');
  }
  catch(err){
    console.log(err.stack)
  }

})

router.delete('/:id', [auth, admin], async (req,res) => {//add transaction here? delete users posts if user is deleted aswell?
  const client = await db.cliconnect()
  try{

    await client.query('BEGIN')
    await client.query('DELETE FROM users_posts WHERE user_id=$1 RETURNING *',
    [req.params.id])
    //if i want to delete from posts aswell i can just get it here
    deletedItem = await client.query('DELETE FROM users WHERE user_id=$1 RETURNING *',
                                   [req.params.id])
    await client.query('COMMIT')
    if (deletedItem.rowCount === 1)//If rowCount==0 no item found in table with that id, 1 otherwise
      {await client.query('ROLLBACK')
      return res.status(404)
        .send('A customer with the given ID was not found')}

    res.status(201).send('Record Successfully deleted')

  }
  catch(err){
    console.log(err.stack)
    console.log('here roll back')
    await client.query('ROLLBACK')
  } finally{
    client.release()
  }
})


module.exports = router;


