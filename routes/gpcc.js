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

router.get("/", (req, res) => {
  pool.getConnection(function(err, connection) {
    connection.query("SELECT Course_ID, Name, sum(CASE WHEN Student_ID LIKE '598%' THEN 1 ELSE 0 END) AS 'Gen598', sum(CASE WHEN Student_ID LIKE '608%' THEN 1 ELSE 0 END) AS 'Gen608', sum(CASE WHEN Student_ID LIKE '618%' THEN 1 ELSE 0 END) AS 'Gen618', sum(CASE WHEN Student_ID LIKE '628%' THEN 1 ELSE 0 END) AS 'Gen628', sum(CASE WHEN Student_ID LIKE '638%' THEN 1 ELSE 0 END) AS 'Gen638' FROM Taken_Courses INNER JOIN Courses ON Taken_Courses.Course_ID=Courses.ID GROUP BY Course_ID", (err, data) => {
      if (err) throw err;
      console.log(data);
      res.send(data) 
      connection.release(); 
    })
})
})
router.get("/getmakeup", (req, res) => {
  pool.getConnection(function(err, connection) {
      connection.query(`SELECT * FROM T2_2020_2021 WHERE ID IN (SELECT Course_ID FROM T2_2020_2021_Enrollment WHERE Student_ID IN (SELECT Student_ID FROM T2_2020_2021_Enrollment WHERE Course_ID="${req.query.course}"))`, (err, makeup) => {
        if (err) throw err;
        console.log(makeup);
        res.send(makeup) 
        connection.release();
      })
  })
})


module.exports = router