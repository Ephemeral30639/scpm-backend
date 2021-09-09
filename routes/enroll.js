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

router.post("/", checkAuthenticated, (req, res) => {
    pool.getConnection(function(err, connection) {
        connection.query(`SELECT * FROM T2_2020_2021_Enrollment where Student_ID like '${req.user.studentID}';`, (err, data) => {
          if (err) throw err;
          connection.release();

          for (var i = 0; i < req.body.length; i++){
              var found = data.find(x => x.Course_ID == req.body[i].id)
              if (found === undefined){
                push(req.body[i].id, req.user.studentID)
              }
              else {
                // Do nothing (intentional)
              }
          }
        })
    })
    res.send('Success')
})

function push(course, studentID){
    pool.getConnection(function(err, connection) {
        connection.query(`insert into T2_2020_2021_Enrollment (Student_ID, Course_ID) values ('${studentID}','${course}')`, (err, data) => {
          if (err) throw err;
          connection.release();
        })
    })
}

module.exports = router