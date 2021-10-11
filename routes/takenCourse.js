const express = require('express')
var mysql = require('mysql')
const router = express.Router()
const authMethods = require('../middleware/auth')
const checkAuthenticated = authMethods.checkAuthenticated
const checkNotAuthenticated = authMethods.checkNotAuthenticated

//Allow Access-Control-Allow-Origin
//ref: https://stackoverflow.com/questions/18642828/origin-origin-is-not-allowed-by-access-control-allow-origin
router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://scpm2021.herokuapp.com");
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

const options = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' }

//load all taken course
router.get('/loadtakencourse', checkAuthenticated, (req, res) =>{
    pool.getConnection(function(err, connection) {
      connection.query(`(SELECT ${req.user.studentID.substring(0,2)}Courses.ID, ${req.user.studentID.substring(0,2)}Courses.Name, ${req.user.studentID.substring(0,2)}Courses.Category, ${req.user.studentID.substring(0,2)}Courses.Credit, ${req.user.studentID}_Taken_Courses.remark FROM ${req.user.studentID}_Taken_Courses INNER JOIN ${req.user.studentID.substring(0,2)}Courses ON ${req.user.studentID}_Taken_Courses.Course_ID=${req.user.studentID.substring(0,2)}Courses.ID)`, (err, takenCourses) => {
        if (err){
          console.log(err)
          res.send('Error')
          connection.release()
          return
        };
        const time = new Date(Date.now())
        const timestamp = `${time.toLocaleDateString('en-US', options).substring(5)} ${time.toLocaleTimeString('en-US', {hour12: false})}`
        console.log(`${timestamp}: sending all taken courses`)
        res.send(takenCourses) 
        connection.release(); 
      })
    })
})

//load all non taken course
router.get('/loadcourselist', checkAuthenticated, (req, res) =>{
  pool.getConnection(function(err, connection) {
    connection.query(`SELECT ${req.user.studentID.substring(0,2)}Courses.ID, ${req.user.studentID.substring(0,2)}Courses.Name FROM ${req.user.studentID.substring(0,2)}Courses WHERE ${req.user.studentID.substring(0,2)}Courses.ID NOT IN (SELECT ${req.user.studentID}_Taken_Courses.Course_ID FROM ${req.user.studentID}_Taken_Courses)`, (err, Courses) => {
      if (err){
        console.log(err)
        res.send('Error')
        connection.release()
        return
      };
      const time = new Date(Date.now())
      const timestamp = `${time.toLocaleDateString('en-US', options).substring(5)} ${time.toLocaleTimeString('en-US', {hour12: false})}`
      console.log(`${timestamp}: sending all non taken courses`)
      res.send(Courses) 
      connection.release(); 
    })
  })
})

//add taken course
router.get('/addtakencourse/:courseID/:remark', checkAuthenticated, (req, res) =>{
  pool.getConnection(function(err, connection) {
    connection.query(`INSERT INTO ${req.user.studentID}_Taken_Courses (Student_ID, Course_ID, remark) VALUES ('${req.user.studentID}', '${req.params.courseID}', '${req.params.remark}')`, (err) => {
      if (err){
        console.log(err.sqlMessage)
        res.send(err.sqlMessage)
        return
      }
      else{
        connection.query(`INSERT INTO Taken_Courses (Student_ID, Course_ID) VALUES ('${req.user.studentID}', '${req.params.courseID}')`, (err) => {
          if (err){
            console.log(err.sqlMessage)
            res.send(err.sqlMessage)
            return
          } 
          console.log("added " + req.user.studentID + ", " + req.params.courseID + " to Taken_Courses table")
        })
        console.log("added "  + req.params.courseID + " to " + req.user.studentID + "'s taken course table");
        res.send("add success") 
      }
      connection.release(); 
    })
  })
})

//delete taken course
router.delete('/deletetakencourse/:courseID', checkAuthenticated, (req, res) =>{
  pool.getConnection(function(err, connection) {
    connection.query(`DELETE FROM ${req.user.studentID}_Taken_Courses where Course_ID like '${req.params.courseID}'`, (err) => {
      if (err){
        console.log(err.sqlMessage)
        res.send(err.sqlMessage)
        return
      }
      else{
        connection.query(`DELETE FROM Taken_Courses where Student_ID like '${req.user.studentID}' and Course_ID like '${req.params.courseID}'`, (err) => {
          if (err){
            console.log(err.sqlMessage)
            res.send(err.sqlMessage)
            return
          } 
          console.log("deleted " + req.user.studentID + ", " + req.params.courseID + " from Taken_Courses table")
        })
        console.log("deleted "  + req.params.courseID + " from " + req.user.studentID + "'s taken course table");
        res.send("delete success") 
      }
      connection.release(); 
    })
  })
})

module.exports = router