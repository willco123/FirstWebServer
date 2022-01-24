//This middleware will determine if a user has a JWT and only allow the user
//to progress if they do

const jwt = require('jsonwebtoken');

function auth(req, res, next){
  const token = req.header('auth-token');
  if (!token) return res.status(401).send('No token provided, please authorize account at /auth');
  
  try{
    var decoded = jwt.verify(token, process.env.SECRET_KEY)
    res.locals.user = decoded
  
    next()
  }
  catch(ex){
    res.status(400).send('Invalid token')
  }
}

function admin(req, res, next){
  if (res.locals.user.isAdmin != "admin") return res.status(403).send('Forbidden');
  
  next();

}



module.exports = {
auth,
admin
};

