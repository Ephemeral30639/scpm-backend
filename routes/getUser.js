const express = require('express')
const router = express.Router()
const passport = require('passport')
const authMethods = require('../middleware/auth')
const methodOverride = require('method-override')
const checkAuthenticated = authMethods.checkAuthenticated
const checkNotAuthenticated = authMethods.checkNotAuthenticated

// This page was used for fixing log in issue. Although it's not used anymore, I'll keep it first just in case we need it.

const credential = require('../user')
const users = credential.users

router.get("/", (req, res) => {
    res.send({ user: req.user })
  })

module.exports = router