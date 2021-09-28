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

router.post("/enroll", checkAuthenticated, (req, res) => {
    pool.getConnection(function(err, connection) {
        connection.query(`SELECT * FROM ${req.query.trimester}_Enrollment where Student_ID like '${req.user.studentID}';`, (err, data) => {
          if (err) throw err;
          connection.release();

          for (var i = 0; i < req.body.length; i++){
            // Find out whether the user has already enrolled on the selected courses.
            var found = data.find(x => x.Course_ID == req.body[i].id)
            
            // If the selected courses is not yet enrolled, add it into the database.
            if (found === undefined){
              pushCourse(req.body[i].id, req.body[i].uuid, req.user.studentID, req.query.trimester)
            }
            else {
              // If the course is already enrolled, simply just do nothing and go to the next course in the loop.
            }
          }
        })
    })
    res.send('Success')
    // console.log(req.body)
})

router.post("/unenroll", checkAuthenticated, (req, res) => {
  for (var i = 0; i < req.body.length; i++){
    deleteCourse(req.body[i].id, req.body[i].uuid, req.user.studentID, req.query.trimester)
  }
  res.send('Success')
})

function deleteCourse(course, uuid,  studentID, trimester){
  pool.getConnection(function(err, connection) {
    connection.query(`DELETE FROM ${trimester}_Enrollment where Student_ID like '${studentID}' and Course_ID like '${course}' and uuid like '${uuid}'`, (err, data) => {
      if (err) throw err;
      connection.release();
    })
  })
}

function pushCourse(course, uuid, studentID, trimester){
    pool.getConnection(function(err, connection) {
        connection.query(`insert into ${trimester}_Enrollment (Student_ID, Course_ID, uuid) values ('${studentID}','${course}', '${uuid}')`, (err, data) => {
          if (err) throw err;
          connection.release();
        })
    })
}

module.exports = router