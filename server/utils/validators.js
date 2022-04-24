const Joi = require('joi');
const jwt = require('jsonwebtoken');

generateAuthToken = function(user_id, rank = "standard") {
  const token = jwt.sign({id: user_id, isAdmin: rank}, process.env.SECRET_KEY, {expiresIn: 86400});
  return token;
}


function validateUser(user){
    const schema = Joi.object({
        username: Joi.string().alphanum().min(5).max(50).required(),
        email: Joi.string().min(5).max(50).required().email(),
        password: Joi.string().min(5).max(255).required()
    });
    return schema.validate(user);
};

function validateMessage(message){
  const schema = Joi.object({
      message: Joi.string().min(1).max(300).required()
  });
  return schema.validate(message);
};


module.exports =  {
  validateUser,
  validateMessage,
  generateAuthToken
}



