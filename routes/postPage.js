//This page will handle a majority of the CRUD requests

const express = require('express');
const router = express.Router();

router.get('/', (req,res) =>{
  res.send('This route will handle CRUD requests </br>\
            and store the corresponding data in a database')
});

module.exports = router;
