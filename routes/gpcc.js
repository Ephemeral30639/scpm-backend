const express = require('express')
const router = express.Router()
const passport = require('passport')
const mysql = require('mysql')
const authMethods = require('../middleware/auth')
const methodOverride = require('method-override')
const checkAuthenticated = authMethods.checkAuthenticated
const checkNotAuthenticated = authMethods.checkNotAuthenticated

router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "https://scpm2021.herokuapp.com/");
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

router.get("/", (req, res) => {
  pool.getConnection(function(err, connection) {
    connection.query("SELECT Course_ID, Name, sum(CASE WHEN Student_ID LIKE '60%' THEN 1 ELSE 0 END) AS 'Gen60', sum(CASE WHEN Student_ID LIKE '61%' THEN 1 ELSE 0 END) AS 'Gen61', sum(CASE WHEN Student_ID LIKE '63%' THEN 1 ELSE 0 END) AS 'Gen63', sum(CASE WHEN Student_ID LIKE '64%' THEN 1 ELSE 0 END) AS 'Gen64' FROM Taken_Courses INNER JOIN AllCourses ON Taken_Courses.Course_ID=AllCourses.ID GROUP BY Course_ID", (err, data) => {
      if (err){
        console.log(err)
        res.send('Error')
        connection.release()
        return
      };
      const time = new Date(Date.now())
      const timestamp = `${time.toLocaleDateString('en-US', options).substring(5)} ${time.toLocaleTimeString('en-US', {hour12: false})}`
      console.log(`${timestamp}: sending GPCC data`)
      res.send(data) 
      connection.release(); 
    })
})
})


module.exports = router