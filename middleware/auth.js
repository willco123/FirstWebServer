//This middleware will determine if a user has a JWT and only allow the user
//to progress if they do

const jwt = require('jsonwebtoken');

function auth(req, res, next){
  const token = req.header('auth-token');
  if (!token) return res.status(401).send('No token provided, please authorize account at /auth');
  console.log(process.env.SECRET_KEY)
  try{
    var decoded = jwt.verify(token, process.env.SECRET_KEY)
    console.log(decoded);
    req.user = decoded
    next()
  }
  catch(ex){
    res.status(400).send('Invalid token')
  }
}

module.exports = auth;

