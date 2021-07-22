const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const db = require('../startup/db');


router.get('/', async (req,res) => {
  try{
  users = await db.query('SELECT * FROM users')
  res.send(users.rows)
  }
  catch(err){
    console.log(err.stack);
  }

});

router.post('/', async (req,res,next) => {

  const {username, password, rank} = req.body;

  //need to handle promise rejection
  try{
    await db.query('INSERT INTO users (name, password, rank)\
                    VALUES($1, $2, $3)', [username, password, rank] );
    res.status(201).send('Successfully added new user');

  }
  catch(err){
    console.log(err.stack);
  }


});


router.put('/:id', async (req,res) => {//Make sure to change ID's to random generated strings
  const id = req.params.id;
  const {username, password, rank} = req.body;



  try{
    await db.query('UPDATE users SET name = $1, password = $2, rank = $3 \
                    WHERE id = $4',
                    [username, password, rank, id]);
    //return modified user
    res.status(200).send('alles gut');
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


