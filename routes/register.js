const express = require('express')
const bcrypt = require('bcrypt')
const router = express.Router()
const authMethods = require('../middleware/auth')
const checkAuthenticated = authMethods.checkAuthenticated
const checkNotAuthenticated = authMethods.checkNotAuthenticated

//Temporary User variable
const credential = require('../user')
const users = credential.users

router.get('/',checkNotAuthenticated, (req, res) => {
    res.render('register.ejs')
})

router.post('/',checkNotAuthenticated, async (req, res) => {
    try{
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        users.push({
            id: Date.now().toString(),
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            studentID: req.body.StudentID,
            email: req.body.email,
            password: hashedPassword
        })
        res.send('Registration Successful')
    } catch {
        res.redirect('/register')
    }
    console.log(users)
})

module.exports = router