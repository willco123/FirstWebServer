//This page will handle a majority of the CRUD requests
//Only users with an authorized JWT can post here
//Other requests will require admin access

const express = require('express');
const router = express.Router();
const {auth, admin} = require('../middleware/auth');
//const admin = require('../middleware/admin');
const db = require('../startup/db');
const {validateMessage, generateAuthToken} = require('../validation/validators');
//const logger = require('winston');
const _ = require('lodash');
const bcrypt= require("bcrypt");



router.get('/', [auth], async (req,res) => {
  //display all posts, recent first
  try{
  posts = await db.query('SELECT * FROM posts')
  res.send(posts.rows)
  }
  catch(err){
    console.log(err.stack);
  }
  
});

router.get('/:id', [auth, admin], async (req,res) => {
  //Is JWT in response?
  try{
  posts = await db.query('SELECT * FROM posts WHERE post_id = $1', [req.params.id])
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
  
  try{//Transaction here to update "number of posts in users"
    post = await db.query('INSERT INTO posts (time_of_post, message)\
                  VALUES($1, $2) RETURNING post_id', [new Date(), message] );

    
  
    await db.query('UPDATE users SET number_of_posts = number_of_posts + 1\
                  WHERE user_id = $1 returning user_id', [user.id] );
    await db.query('INSERT INTO users_posts (user_id, post_id)\
                  VALUES($1, $2)', [user.id, post.rows[0].post_id] );
    //await db.query('BEGIN');
    //text = 'INSERT INTO users_posts (user_id, post_id) VALUES ($1, $2)'
    //values = [user.id, post.rows[0].post_id]
    //values = [12,6]
    //await db.query(text,values)
    //await db.query('COMMIT');
    res.status(200).send('Message Added')



  }
  catch(err){
    console.log(err.stack);
  }


});


router.put('/:id', [auth, admin], async (req,res) => {//Make sure to change ID's to random generated strings??
  const {error} = validateMessage(req.body);
  if (error) return res.status(400).send(error.details[0].message);


  const id = req.params.id;
  const message = req.body.message;



  try{
    await db.query('UPDATE posts SET message = $1 WHERE post_id = $2', [message, id]);
    //return modified user
    res.status(200).send('Record Successfully Updated');
  }
  catch(err){
    console.log(err.stack)
  }

})

router.delete('/:id', [auth, admin], async (req,res) => {

  try{//delete null if id = 0
    if (req.params.id === '0') {// add transaction here? 
      deletedItem = await db.query('DELETE FROM posts WHERE user_id IS NULL')
    }
    else {
      deletedItem = await db.query('DELETE FROM posts WHERE post_id=$1 RETURNING *',[req.params.id])
    }
    if (deletedItem.rowCount === 0)//If rowCount==0 no item found in table with that id, 1 otherwise
      return res.status(404)
        .send('A message with the given ID was not found')
    res.status(201).send('Record Successfully deleted')
  }
  catch(err){
    console.log(err.stack)
  }
})




module.exports = router;





//So this page will act as message board/feed
//Users can make a post with limited characters
//It will display username/time of posting/message
//User makes a post-> post is saved to datebase -> time of last post & total number of posts is saved in "users", can use transactions here for posting
//In "posts" table user_id/time of message/message is logged in the database
//only "auth" users can post
//Users can search for specific posts (might not do this)
//Admin can delete/edit any post
//What happens if a user is delete (delete all there posts)

////////////////////////TO DO////////////////////////////////////////////
//Edit "last login time" to "last post time" in psql
//add number of posts to users
//add posts table to db
//So stack CRUD requests, have them connect to the db and post to "posts"

//posts post_id, user_id(fk), time of post, message