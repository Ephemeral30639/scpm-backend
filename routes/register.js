const express = require('express')
const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcrypt')
const router = express.Router()
const mysql = require('mysql')
const authMethods = require('../middleware/auth')
const checkAuthenticated = authMethods.checkAuthenticated
const checkNotAuthenticated = authMethods.checkNotAuthenticated

//Temporary User variable
const credential = require('../user')
const users = credential.users

// Database Connection
const pool = mysql.createPool({
    host: "egci492db.cnif8x09ijrk.us-west-2.rds.amazonaws.com",
    user: "egci492dev",
    password: "egci492db4seniorproject",
    database: "egcicourse"
})

router.get('/', checkNotAuthenticated, (req, res) => {
    res.send('Pass') 
})

router.post('/',checkNotAuthenticated, async (req, res) => {
    try{
        // Create a Hashed password
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        pool.getConnection(function(err, connection) {
            try {
                // Inserting new user into the Users Table in database
                connection.query(`INSERT INTO Users (id, firstname, lastname, studentID, email, password) VALUES ('${uuidv4()}', '${req.body.firstname}', '${req.body.lastname}', '${req.body.StudentID}', '${req.body.email}', '${hashedPassword}')`, (err, registerData) => {
                    if (err){
                        // If error (usually duplication error), send message to frontend to alert user.
                        console.log(err.sqlMessage)
                        res.send(err.sqlMessage)
                        return
                    }
                    else {
                        // If no error, console log the data and send a successful signal to frontend
                        console.log(registerData);
                        res.send('Registration Successful')

                        // Create a "Taken Courses" Table for the new user. If no error until here, should not have anymore error.
                        connection.query(`CREATE TABLE ${req.body.StudentID}_Taken_Courses (Student_ID int NOT NULL, Course_ID varchar(7) NOT NULL, remark varchar(255)), PRIMARY KEY (Course_ID))`, (err, tableData) => {
                            connection.release();
                            if (err){
                                console.log(err.sqlMessage)
                                res.send(err.sqlMessage)
                                return
                            }
                            else {
                                console.log(tableData);
                            }
                        })
                    }
                })
            } catch {
                // I was not able to throw any error into catch so this is just here to avoid syntax error. Not ideal, but should be ok for now.
                console.log("")
            }
        })
    } catch {
        res.redirect('/register')
    }
})

module.exports = router