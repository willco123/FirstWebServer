const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const db = require('../startup/db');
const {validateUser, generateAuthToken} = require('../validation/validators');
//const logger = require('winston');
const _ = require('lodash');
const bcrypt = require("bcrypt");



router.get('/', [auth], async (req,res) => {

  try{
  users = await db.query('SELECT * FROM users')
  return res.json(users.rows)
  }
  
  catch(err){
    console.log(err.stack);
  }
  
});

router.get('/:id', [auth], async (req,res) => {
  //Is JWT in response?

  try{

  users = await db.query('SELECT * FROM users WHERE user_id = $1', [req.params.id])
  if (users.rowCount===0) return res.status(404).send('A user with that given id cannot be found')
  return res.send(users.rows)
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
    return res.set('x-auth-token', token).status(201).send('Successfully added new user');

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
    itemExists = await db.query('SELECT * FROM users WHERE username = $1 OR email = $2 EXCEPT SELECT * FROM users WHERE user_id = $3 ', [username, email, id])
    if (itemExists.rowCount >= 1) return res.status(400).send('A user with that username/email exists')
    updatedItem = await db.query('UPDATE users SET username = $1, password = $2, email = $3 \
                    WHERE user_id = $4',
                    [username, password, email, id]);
    if (updatedItem.rowCount === 0) return res.status(404).send('A user with the given ID was not found')//If rowCount==0 no item found in table with that id, 1 otherwise
    
        
    //return modified user
    return res.status(200).send('Record Successfully Updated');
  }
  catch(err){
    console.log(err.stack)
  }

  //Need to add failed additions catch here
  //If trying to change user/email to one that already exists res(error)
  //if user not found then res(no user)

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
    if (deletedItem.rowCount === 0)//If rowCount==0 no item found in table with that id, 1 otherwise
      return res.status(404)
        .send('A customer with the given ID was not found')

    return res.status(201).send('Record Successfully deleted')

  }
  catch(err){
    console.log(err.stack)
    console.log('An error occurred')
    await client.query('ROLLBACK')
    return res.status(500).send('An error occurred')
  } finally{
    client.release(true)
  }
})


module.exports = router;


