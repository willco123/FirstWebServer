const Pool = require('pg').Pool;
require('dotenv').config();


const env = process.env.NODE_ENV.toUpperCase();
console.log("Connecting to " + process.env['PGDATABASE_' + env] + " database")

const pool = new Pool({//This instance stores the database connection
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env['PGDATABASE_' + env],
  //database: process.env.PGDATABASE_DEVELOPMENT,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT
})



module.exports = {//Functions defined in this object will return methods that you can use on the DB
  async query(text,params){
    const res = await pool.query(text, params)
    return res
  },
  async cliconnect(){
    const client = await pool.connect()//does work
    return client
}}



