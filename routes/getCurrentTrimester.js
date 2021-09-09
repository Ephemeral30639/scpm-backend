const express = require('express')
const router = express.Router()
const passport = require('passport')
const mysql = require('mysql')
const authMethods = require('../middleware/auth')
const methodOverride = require('method-override')
const checkAuthenticated = authMethods.checkAuthenticated
const checkNotAuthenticated = authMethods.checkNotAuthenticated

const pool = mysql.createPool({
    host: "egci492db.cnif8x09ijrk.us-west-2.rds.amazonaws.com",
    user: "egci492dev",
    password: "egci492db4seniorproject",
    database: "egcicourse"
})

router.get("/", checkAuthenticated, (req, res) => {
    pool.getConnection(function(err, connection) {
        connection.query(`SELECT T2_2020_2021.ID, Name, T2_2020_2021.Date, T2_2020_2021.Time FROM T2_2020_2021 INNER JOIN Courses ON T2_2020_2021.ID=Courses.ID`, (err, currentTrimester) => {
          if (err) throw err;
          console.log(currentTrimester);
          res.send(currentTrimester) 
          connection.release(); 
        })
    })
})

module.exports = router