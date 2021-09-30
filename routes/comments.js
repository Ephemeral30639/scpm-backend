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

const options = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' }

router.get("/getallcourses", (req, res) => {
    pool.getConnection(function(err, connection) {
        connection.query(`SELECT DISTINCT ID FROM AllCourses`, (err, courses) => {
          if (err){
              console.log(err)
              res.send('Error')
              connection.release()
              return
          };
          connection.release();
          const time = new Date(Date.now())
          const timestamp = `${time.toLocaleDateString('en-US', options).substring(5)} ${time.toLocaleTimeString('en-US', {hour12: false})}`
          console.log(`${timestamp}: sending all courses ID`)
          res.send(courses)
        })
    })
})

router.get("/getcoursename", (req, res) => {
    pool.getConnection(function(err, connection) {
        connection.query(`SELECT Name FROM AllCourses WHERE ID LIKE '${req.query.course}'`, (err, course) => {
          if (err){
              console.log(err)
              res.send('Error')
              connection.release()
              return
          };
          connection.release();
          const time = new Date(Date.now())
          const timestamp = `${time.toLocaleDateString('en-US', options).substring(5)} ${time.toLocaleTimeString('en-US', {hour12: false})}`
          console.log(`${timestamp}: sending ${req.query.course}'s name`)
          res.send(course)
        })
    })
})

router.get("/getcoursecomments", (req, res) => {
    pool.getConnection(function(err, connection) {
        connection.query(`SELECT comment, timestamp, studentID FROM CourseComments WHERE courseID LIKE '${req.query.course}' ORDER BY timestamp`, (err, courseComments) => {
          if (err){
              console.log(err)
              res.send('Error')
              connection.release()
              return
          };
          connection.release();
          const time = new Date(Date.now())
          const timestamp = `${time.toLocaleDateString('en-US', options).substring(5)} ${time.toLocaleTimeString('en-US', {hour12: false})}`
          console.log(`${timestamp}: sending ${req.query.course}'s comments`)
          res.send(courseComments)
        })
    })
})

router.post("/inputcomment", (req, res) => {
    if (req.query.studentID == 'Not Anonymous'){
        var studentID = req.user.studentID
    } else {
        var studentID = req.query.studentID
    }
    pool.getConnection(function(err, connection) {
        connection.query(`insert into CourseComments (commentID, courseID, comment, timestamp, studentID) values ('${req.query.commentID}', '${req.query.courseID}', '${req.query.comment}', '${req.query.timestamp}', '${studentID}');`, (err, courseComments) => {
          if (err){
              console.log(err)
              res.send('Error')
              connection.release()
              return
          };
          connection.release();
          const time = new Date(Date.now())
          const timestamp = `${time.toLocaleDateString('en-US', options).substring(5)} ${time.toLocaleTimeString('en-US', {hour12: false})}`
          console.log(`${timestamp}: Successfully Commented`)
          res.send('Comment Successful')
        })
    })
    // console.log(req.query.commentID, req.query.courseID, req.query.comment, req.query.timestamp, req.query.studentID)
})

module.exports = router