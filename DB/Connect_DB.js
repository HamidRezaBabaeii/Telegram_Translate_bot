const mysql = require('mysql2');
require('../DB/Create_DB')



require('dotenv').config()

const connection = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const db = connection.promise(); 

db.getConnection()
  .then(conn => {
    console.log('Connected to MySQL server.');
  })
  .catch(err => {
    console.error('Error connecting to MySQL server:', err.message);
  });

module.exports = db;
