if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

// Requires
const express = require('express')
const app = express()
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const cors = require('cors')

//Route Requires
const homepage = require('./routes/homepage')
const welcome = require('./routes/welcome')
const login = require('./routes/login')
const register = require('./routes/register')
const takenCourses = require('./routes/takenCourse')

//App Uses
app.use(express.json());
app.set('view-engine', 'pug')
app.use(express.urlencoded({extended: false}))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))
app.use(cors())

//App Route Uses
app.use('/', homepage)
app.use('/welcome', welcome)
app.use('/login', login)
app.use('/register', register)
app.use('/taken-courses', takenCourses)

app.delete('/logout', (req, res) =>{
    req.logOut()
    res.redirect('/login')
})

app.set('port', 5000);
app.listen(process.env.PORT || app.get('port'))
console.log('Server Runnign on port localhost:' + app.get('port'));