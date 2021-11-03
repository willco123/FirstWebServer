const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
//const userLoginSchema = require('../middleware/validators');
const db = require('../startup/db');
const {checkSchema, body, validationResult} = require('express-validator');
//const {userLoginSchema} = require('../middleware/validators');
const logger = require('winston');

const userLoginSchema = {
  password: {
    isStrongPassword: {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1
    },
    errorMessage: "Password must be greater than 8 and contain at least one uppercase letter, one lowercase letter, and one number"
    },

}


router.get('/', async (req,res) => {

  try{
  users = await db.query('SELECT * FROM users')
  res.send(users.rows)
  }
  catch(err){
    console.log(err.stack);
  }

});

router.post('/', checkSchema(userLoginSchema), async (req,res,next) => {

  const errors = validationResult(req);
  const {username, password} = req.body;
  logger.info('The error stack is: \n%o', errors)//When using winston, user string interpolation when logging JSON objects


  //if (errors) return res.status(400).send(errors.array())



  //need to handle promise rejection
  try{
    var usernameExists = await db.query('SELECT * FROM users WHERE name = $1', [req.body.username]);
    if (usernameExists.rowCount) return res.status(400).send('Username Is already Taken')//Ensure uniqueness

    await db.query('INSERT INTO users (name, password)\
                    VALUES($1, $2)', [username, password] );
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


