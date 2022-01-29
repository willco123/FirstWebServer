const Pool = require('pg').Pool;
require('dotenv').config();

const pool = new Pool({//This instance stores the database connection
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
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



