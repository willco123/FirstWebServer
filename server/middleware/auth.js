const jwt = require('jsonwebtoken');

function auth(req, res, next){

  const token = req.header('x-auth-token');
  if (!token) return res.status(401).send('No token provided, please authorize account at /auth');

  try{
    var decoded = jwt.verify(token, process.env.SECRET_KEY)
    res.locals.user = decoded
    next()
  }
  catch(ex){
    res.status.send('Invalid token')
  }

}

module.exports = auth;



