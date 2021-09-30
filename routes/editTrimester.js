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

router.post("/addschedule", checkAuthenticated, (req, res) =>{
    pool.getConnection(function(err, connection) {
        connection.query(`insert into ${req.query.trimester} (ID, Date, Time) values ('${req.query.id}','${req.query.date}','${req.query.time}')`, (err, schedule) => {
          if (err){
            console.log(err)
            res.send('Error')
            connection.release()
            return
          }; 
          connection.release();
          res.send('Scheduled Added') 
        })
    })
})

router.post("/deleteschedule", checkAuthenticated, (req, res) =>{
    for (var i = 0; i < req.query.courses.length; i++){
        deleteSchedule(req.query.trimester, req.query.courses[i])
    }
    res.send('Delete Successful')
})

function deleteSchedule(trimester, courseID){
    pool.getConnection(function(err, connection) {
      connection.query(`delete from ${trimester} where ID like '${courseID}'`, (err, data) => {
        if (err){
          console.log(err)
          res.send('Error')
          connection.release()
          return
        };
        connection.release();
      })
    })
  }

module.exports = router