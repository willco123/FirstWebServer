const express = require('express');
const router = express.Router();

LoginArray = [//Array of objects
  {name: "123", password: "456"}
];

router.get('/', (req,res) => {
  res.send(LoginArray)
});

router.post('/', (req,res) => {
  LoginArray.push({
    name: req.body.name,
    password: req.body.password
  })
  res.send(LoginArray);
});

router.put('/:id', (req,res) => {

  if ( req.params.id >= LoginArray.length || !(isPositiveInt(req.params.id)) )
    return res.status(404).send('Bad Id')


  LoginArray[req.params.id] = {
    name: req.body.name, password: req.body.password
  };

  res.send(LoginArray);
})

router.delete('/:id', (req,res) => {
    if ( req.params.id >= LoginArray.length || !(isPositiveInt(req.params.id)) )
    return res.status(404).send('Bad Id')

    LoginArray.splice(LoginArray.indexOf(req.params.id), 1)

    res.send(LoginArray)
})

//Gonna stick validation method down here
function isPositiveInt(str){
  var output = Math.floor(Number(str));
  return String(output) === str && output >= 0;
}


module.exports = router;
