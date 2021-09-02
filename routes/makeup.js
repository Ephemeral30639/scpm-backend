const express = require('express')
const router = express.Router()
const passport = require('passport')
const authMethods = require('../middleware/auth')
const methodOverride = require('method-override')
const checkAuthenticated = authMethods.checkAuthenticated
const checkNotAuthenticated = authMethods.checkNotAuthenticated

router.get("/", (req, res) => {
    res.send('Work in Progress')
})

module.exports = router