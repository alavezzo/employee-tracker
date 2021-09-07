const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection(
    {
            host: 'localhost',
            user: process.env.DB_USER,
            password: process.env.DB_PW,
            database: 'employeeTracker',
        },
        console.log('Connected to the employeeTracker database.')
    )

module.exports = db;

