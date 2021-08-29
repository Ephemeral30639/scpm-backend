const express = require('express')
var mysql = require('mysql')
const router = express.Router()
const authMethods = require('../middleware/auth')
const checkAuthenticated = authMethods.checkAuthenticated
const checkNotAuthenticated = authMethods.checkNotAuthenticated

//Allow Access-Control-Allow-Origin
//ref: https://stackoverflow.com/questions/18642828/origin-origin-is-not-allowed-by-access-control-allow-origin
router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
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


router.get('/', (req, res) =>{
    pool.getConnection(function(err, connection) {
      connection.query(`(SELECT Courses.ID, Courses.Name, Courses.Category, Courses.Credit FROM ${req.user.studentID}_Taken_Courses INNER JOIN Courses ON ${req.user.studentID}_Taken_Courses.Course_ID=Courses.ID)`, (err, takenCourses) => {
        if (err) throw err;
        console.log(takenCourses);
        res.send(takenCourses) 
        connection.release(); 
      })
  })
})


module.exports = router