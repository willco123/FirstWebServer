const Pool = require('pg').Pool;
require('dotenv').config();


const env = process.env.NODE_ENV.toUpperCase();
console.log("Connecting to " + process.env['PGDATABASE_' + env] + " database")

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env['PGDATABASE_' + env],
  //database: process.env.PGDATABASE_DEVELOPMENT,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT
})

async function isDB(){
  try{
  DBConn = await pool.query('SELECT * FROM pg_catalog.pg_database WHERE datname = $1', [process.env['PGDATABASE_' + env]])
  DBConn.rows[0].datname
  }
  catch(err){
    console.log('Cannot connect to DB (DB not found), ending process')
    console.log(err)
    process.exit()
  }
}

isDB()
module.exports = {
  async query(text,params){
    const res = await pool.query(text, params)
    return res
  },
  async cliconnect(){
    const client = await pool.connect()
    return client
  },
  async cliRelease(){
    return await pool.release()
  },
  async viewConns(){
    return await pool._clients
      
  },
  async otherConns(){
    return await pool.totalCount
  }
}



