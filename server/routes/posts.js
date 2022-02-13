//This page will handle a majority of the CRUD requests
//Only users with an authorized JWT can post here
//Other requests will require admin access

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const db = require('../startup/db');
const {validateMessage, generateAuthToken} = require('../utils/validators');
//const logger = require('winston');
//const logger = require('../startup/logging');
const _ = require('lodash');
const bcrypt= require("bcrypt");




router.get('/', [auth], async (req,res) => {

  try{
    posts = await db.query('SELECT * FROM posts')

    return res.send(posts.rows)
    
  }
  catch(err){
    console.log(err.stack);
    
  } 
});

router.get('/:id', [auth, admin], async (req,res) => {
  //Is JWT in response?
  try{
  posts = await db.query('SELECT * FROM posts WHERE post_id = $1', [req.params.id])
  if (posts.rowCount===0) return res.status(404).send('A record with that given id cannot be found')

  res.send(posts.rows[0].message)
  }
  catch(err){
    console.log(err.stack);
  }

});

router.post('/', [auth], async (req,res) => {
  const {error} = validateMessage(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  


  const message = req.body.message;
  const user = res.locals.user;
  const client = await db.cliconnect()//get instance of client?

  
  try{//Transaction here to update "number of posts in users"
    await client.query('BEGIN')
    
    
    post = await client.query('INSERT INTO posts (time_of_post, message)\
                  VALUES($1, $2) RETURNING post_id', [new Date(), message]);
                  
    await client.query('UPDATE users SET number_of_posts = number_of_posts + 1\
                  WHERE user_id = $1', [user.id]);
                   
    await client.query('INSERT INTO users_posts (user_id, post_id)\
                  VALUES($1, $2)', [user.id, post.rows[0].post_id]);
    
    await client.query('COMMIT')
    
    
    res.status(200).send('Message Added')


  }
  catch(err){
    await client.query('ROLLBACK')
    console.log(err.stack);
    res.status(400).send('Transaction Failed')
  }
  finally{
    client.release()
  }


});


router.put('/:id', [auth, admin], async (req,res) => {//Make sure to change ID's to random generated strings??
  const {error} = validateMessage(req.body);
  if (error) return res.status(400).send(error.details[0].message);


  const id = req.params.id;
  const message = req.body.message;

  

  try{
    updatedItem = await db.query('UPDATE posts SET message = $1 WHERE post_id = $2 RETURNING *', [message, id]);
    if (updatedItem.rowCount === 0)//If rowCount==0 no item found in table with that id, 1 otherwise
    return res.status(404)
      .send('A message with the given ID was not found')
    res.status(200).send(updatedItem.rows[0]);
  }
  catch(err){
    console.log(err.stack)
  }

})

router.delete('/:id', [auth, admin], async (req,res) => {//what if we jump out of transaction early?

  const client = await db.cliconnect()
  try{
    await client.query('BEGIN')
    await client.query('DELETE FROM users_posts WHERE post_id=$1',[req.params.id])
    deletedItem = await client.query('DELETE FROM posts WHERE post_id = $1 RETURNING *',[req.params.id])
    await client.query('COMMIT')
    if (deletedItem.rowCount === 0)//If rowCount==0 no item found in table with that id, 1 otherwise
    return res.status(404)
      .send('A message with the given ID was not found')



    res.status(201).send('Record Successfully deleted')
  }
  catch(err){
    await client.query('ROLLBACK')
    console.log(err.stack)
  } finally{
    client.release()
  }
})




module.exports = router;

