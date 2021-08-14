const express = require('express')
const router = express.Router()
const passport = require('passport')
const authMethods = require('../middleware/auth')
const methodOverride = require('method-override')
const checkAuthenticated = authMethods.checkAuthenticated
const checkNotAuthenticated = authMethods.checkNotAuthenticated

//Temporary User variable
const credential = require('../user')
const users = credential.users

//Passport Configuration
const initializePassport = require('../passport-config')
initializePassport(
    passport, 
    email => users.find(users => users.email === email),
    id => users.find(user => user.id === id)
)

router.use(passport.initialize())
router.use(passport.session())
router.use(methodOverride('_method'))

router.get('/',checkNotAuthenticated, (req, res) => {
    res.render('login.ejs')
})

router.post('/',checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/welcome',
    failureRedirect: '/login',
    failureFlash: true
}))

module.exports = router