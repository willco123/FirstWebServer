

//console.log(Object.getOwnPropertyNames(checkSchema))//Length,name,prototype


const userLoginSchema = {
  password: {
    isStrongPassword: {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1
    },
    errorMessage: "Password must be greater than 8 and contain at least one uppercase letter, one lowercase letter, and one number"
    },

}

//console.log(checkSchema.length)

module.exports = {
  userLoginSchema
}

