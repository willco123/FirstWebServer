
//Below code was for express validator, will use joi instead for now
//console.log(Object.getOwnPropertyNames(checkSchema))//Length,name,prototype


// const userLoginSchema = {
//   password: {
//     isStrongPassword: {
//       minLength: 8,
//       minLowercase: 1,
//       minUppercase: 1,
//       minNumbers: 1
//     },
//     errorMessage: "Password must be greater than 8 and contain at least one uppercase letter, one lowercase letter, and one number"
//     },
//   username:{
//     minLength:8
//   }

// }

// module.exports = {
//   userLoginSchema
// }

const Joi = require('joi');
const jwt = require('jsonwebtoken');

generateAuthToken = function() {
  const token = jwt.sign({_id: this._id, isAdmin: this.isAdmin }, process.env.SECRET_KEY);
  return token;
}


function validateUser(user){
    const schema = Joi.object({
        username: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(50).required().email(),
        password: Joi.string().min(5).max(255).required()
        //rank: Joi.string('')
    });
    return schema.validate(user);
};


module.exports =  {
  validateUser,
  generateAuthToken
}



