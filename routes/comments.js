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

router.get("/getallcourses", (req, res) => {
    pool.getConnection(function(err, connection) {
        connection.query(`SELECT ID FROM Courses`, (err, courses) => {
          if (err) throw err;
          connection.release();
          res.send(courses)
        })
    })
})

router.get("/getcoursename", (req, res) => {
    pool.getConnection(function(err, connection) {
        connection.query(`SELECT Name FROM Courses WHERE ID LIKE '${req.query.course}'`, (err, course) => {
          if (err) throw err;
          connection.release();
          res.send(course)
        })
    })
})

router.get("/getcoursecomments", (req, res) => {
    pool.getConnection(function(err, connection) {
        connection.query(`SELECT comment, timestamp, studentID FROM CourseComments WHERE courseID LIKE '${req.query.course}' ORDER BY timestamp`, (err, courseComments) => {
          if (err) throw err;
          connection.release();
          res.send(courseComments)
        })
    })
})

module.exports = router