//-------------------------------------//
// username: egci
// password: EGCI492-Tracking
//------------------------------------//
// DBName: freedbtech_egcicourse
// dbusername:freedbtech_egcicourses
// password: SeniorProject
//-----------------------------------//
/* var mysql = require('mysql')
var con = mysql.createConnection({
  host: 'freedb.tech',
  user: 'freedbtech_egcicourses',
  password: 'SeniorProject',
  database: 'freedbtech_egcicourse',
  port:3306
});

con.connect(function(err) {
if (err) throw err;
console.log("Connected!");
}); */
//-------------------------------------------//
var mysql = require('mysql')
const express = require('express')
const app = express();
const port = process.env.PORT || 3000

app.use(express.json());

const con = mysql.createConnection({
  host: 'freedb.tech',
  user: 'freedbtech_egcicourses',
  password: 'SeniorProject',
  database: 'freedbtech_egcicourse',
  port:3306
})

app.get("/", (req, res) => {
    con.connect((err) => {
        if(err) throw err
        console.log('DB connected')

        con.query("SELECT SUM(Credit), Category FROM (SELECT Courses.ID, Courses.Name, Courses.Category, TEST.Credit FROM (SELECT * FROM Taken_Courses WHERE Student_ID='6080079') AS TEST INNER JOIN Courses ON TEST.Course_ID=Courses.ID) AS TEST GROUP BY Category", (err, result) => {
          if (err) throw err;
          console.log(result);
          res.send(result)
        })
    })
})

app.get('/test', (req, res) =>{
    res.send('WHOA')
})

app.listen(port, () => console.log(`Listen on port ${port}`))