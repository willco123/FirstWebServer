const express = require('express');
const router = express.Router();

router.get('/LoginPage', (req,res) => {
  res.send('Login Page Place Holder')
});

module.exports = router;
