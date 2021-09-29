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


router.get("/timetable", checkAuthenticated, (req, res) => {
    pool.getConnection(function(err, connection) {
        connection.query(`SELECT ${req.query.trimester}.ID, Name, ${req.query.trimester}.Date, ${req.query.trimester}.Time, ${req.query.trimester}.uuid FROM ${req.query.trimester} INNER JOIN AllCourses ON ${req.query.trimester}.ID=AllCourses.ID`, (err, currentTrimester) => {
          if (err){
              if(err.code == 'ER_NO_SUCH_TABLE' && req.user.firstname == 'admin'){
                  createNewTrimesterTable(req.query.trimester)
              }
          }
          res.send(currentTrimester) 
          connection.release(); 
        })
    })
})

router.get("/studentcurrentenrollment", checkAuthenticated, (req, res) =>{
    pool.getConnection(function(err, connection) {
        connection.query(`SELECT Course_ID as ID, Name, Date, Time, uuid FROM (SELECT Student_ID, Course_ID, AllCourses.Name, ${req.query.trimester}.Date, ${req.query.trimester}.Time, ${req.query.trimester}.uuid FROM ${req.query.trimester}_Enrollment inner join ${req.query.trimester} on ${req.query.trimester}.uuid=${req.query.trimester}_Enrollment.uuid inner join AllCourses on ${req.query.trimester}_Enrollment.Course_ID=AllCourses.ID) as result where Student_ID like '${req.user.studentID}'`, (err, currentEnrollment) => {
          if (err){
              res.send('Error')
              return
          }
          res.send(currentEnrollment) 
          connection.release(); 
        })
    })
})


router.get("/currenttrimester", (req, res) =>{
    pool.getConnection(function(err, connection) {
        connection.query(`select trimester from Trimesters where current like 'yes'`, (err, currentTrimester) => {
          if (err){
              res.send('Error')
              return
          }
          res.send(currentTrimester) 
          connection.release(); 
        })
    })
})

router.get("/availabletrimesters", (req, res) =>{
    pool.getConnection(function(err, connection) {
        connection.query(`select trimester from Trimesters where current like 'no'`, (err, availableTrimesters) => {
          if (err){
              res.send('Error')
              return
          }
          res.send(availableTrimesters) 
          connection.release(); 
        })
    })
})

router.get("/changecurrenttrimester", checkAuthenticated, (req, res) =>{
    changeCurrentTrimester(req.query.current, req.query.new)
    res.send('Successfully Changed')
})

function changeCurrentTrimester(currentTrimester, newTrimester){
    pool.getConnection(function(err, connection) {
        connection.query(`UPDATE Trimesters SET current = 'no' WHERE trimester like '${currentTrimester}';`, (err, data) => {
          if (err){
              res.send('Error')
              return
          }
          connection.release();
        })
    })
    
    pool.getConnection(function(err, connection) {
        connection.query(`UPDATE Trimesters SET current = 'yes' WHERE trimester like '${newTrimester}';`, (err, data) => {
            if (err){
                res.send('Error')
                return
            } 
            connection.release();
        })
    })
}

function createNewTrimesterTable(trimester){
    pool.getConnection(function(err, connection) {
        connection.query(`create table ${trimester} (ID varchar(7), Date varchar(10), Time varchar(10), uuid varchar(255))`, (err, data) => {
            if (err){
                res.send('Error')
                return
            } 
            connection.release();
        })
    })

    pool.getConnection(function(err, connection) {
        connection.query(`create table ${trimester}_Enrollment (Student_ID int, Course_ID varchar(7), uuid varchar(255))`, (err, data) => {
            if (err){
                res.send('Error')
                return
            } 
            connection.release();
        })
    })
}

module.exports = router