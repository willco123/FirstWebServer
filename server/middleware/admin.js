//User after the "auth" middleware, determine if user has the admin role, reject request if not


module.exports = function(req, res, next){
  
  if (res.locals.user.isAdmin != "admin") return res.status(403).send('Forbidden');
  
  next();

}
