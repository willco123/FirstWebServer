const Pool = require('pg').Pool;
require('dotenv').config();
console.log(process.env.PGUSER)

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
  }
}

// pool.connect((err, client, release) => {
//   if (err) {
//     return console.error('Error acquiring client', err.stack)
//   }
//   client.query('SELECT * FROM users', (err, result) => {
//     release()
//     if (err) {
//       return console.error('Error executing query', err.stack)
//     }
//     console.log(result.rows)
//   })
// })


