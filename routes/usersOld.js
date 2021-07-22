const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const db = require('../startup/db');





loginArray = [//Array of objects
  {name: "123", password: "456"}
];

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


router.put('/:id', (req,res) => {//Make sure to change ID's to random generated strings

  if ( req.params.id >= loginArray.length || !(isPositiveInt(req.params.id)) )
    return res.status(404).send('Bad Id')


  loginArray[req.params.id] = {
    name: req.body.name,
    password: req.body.password,
    //Roles: Admin, User
    rank: req.body.rank// Will handle rank assignment through database when implemented

  };

  res.send(loginArray);
})

router.delete('/:id', (req,res) => {
    if ( req.params.id >= loginArray.length || !(isPositiveInt(req.params.id)) )
    return res.status(404).send('Bad Id')

    loginArray.splice(loginArray.indexOf(req.params.id), 1)

    res.send(loginArray)
})


function isPositiveInt(str){//extract this if ever re-used
  var output = Math.floor(Number(str));
  return String(output) === str && output >= 0;
}


module.exports = router;
module.exports.loginArray = loginArray;
