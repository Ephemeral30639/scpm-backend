const express = require('express')
const router = express.Router()
const authMethods = require('../middleware/auth')
const checkAuthenticated = authMethods.checkAuthenticated
const checkNotAuthenticated = authMethods.checkNotAuthenticated

router.get('/', checkAuthenticated, (req, res) =>{
    res.render('../views/welcome.ejs', {name: req.user.firstname})
})

module.exports = router