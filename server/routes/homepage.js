//Homepage

const express =  require('express');
const router = express.Router();

router.get('/', (req,res) => {
  res.status(200).json({info: 'Node.js, Express, and Postgres API'})
  //res.send(`This is the default End Point <br/> The homepage`);
});



module.exports = router;
