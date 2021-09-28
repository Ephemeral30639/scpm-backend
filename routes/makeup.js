const express = require('express')
const router = express.Router()
const passport = require('passport')
const mysql = require('mysql')
const authMethods = require('../middleware/auth')
const methodOverride = require('method-override')
const checkAuthenticated = authMethods.checkAuthenticated
const checkNotAuthenticated = authMethods.checkNotAuthenticated

router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
  
//Database Connect using pool
//ref: https://stackoverflow.com/questions/14087924/cannot-enqueue-handshake-after-invoking-quit
const pool = mysql.createPool({
    host: "egci492db.cnif8x09ijrk.us-west-2.rds.amazonaws.com",
    user: "egci492dev",
    password: "egci492db4seniorproject",
    database: "egcicourse"
})

router.get("/getactivecourses", (req, res) => {
    pool.getConnection(function(err, connection) {
        connection.query(`SELECT distinct id from ${req.query.trimester}`, (err, activeCourses) => {
          if (err) throw err;
          console.log(activeCourses);
          res.send(activeCourses) 
          connection.release(); 
        })
    })
})

router.get("/getmakeup", (req, res) => {
  pool.getConnection(function(err, connection) {
      connection.query(`select ID, Date, Time, ${req.query.trimester}.uuid from (SELECT * FROM ${req.query.trimester}_Enrollment WHERE Student_ID IN (SELECT Student_ID FROM ${req.query.trimester}_Enrollment WHERE Course_ID="${req.query.course}")) as result inner join ${req.query.trimester} on result.uuid=${req.query.trimester}.uuid`, (err, makeup) => {
        if (err) throw err;
        console.log(makeup);
        res.send(makeup) 
        connection.release();
      })
  })
})

module.exports = router