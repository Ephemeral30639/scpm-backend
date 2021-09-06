const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const mysql = require('mysql')

function initialize (passport) {
    const authenticateUser = async (email, password, done) => {
        const promise = new Promise((resolve, reject) => {
            const pool = mysql.createPool({
                host: "egci492db.cnif8x09ijrk.us-west-2.rds.amazonaws.com",
                user: "egci492dev",
                password: "egci492db4seniorproject",
                database: "egcicourse"
            })
        
            pool.getConnection(function(err, connection) {
                connection.query(`(SELECT * FROM Users WHERE email LIKE '${email}')`, (err, Email) => {
                  if (err) throw err;
                  connection.release();
                  if (!Email.length){
                      resolve(null)
                  }
                  else {
                      resolve(JSON.parse(JSON.stringify(Email[0])))
                  }
                })
            })
        })
        const user = await promise
        if (user == null) {
            return done(null, false, { message: 'No user with that email'})
        }

        try {
            if (await bcrypt.compare(password, user.password)){
                return done(null, user)
            } else {
                return done(null, false, { message: 'Password incorrect'})
            }
        } catch (e) {
            return done(e)
        }
    }
    
    passport.use(new LocalStrategy({usernameField: 'email'}, authenticateUser))
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => {
        async function getID(id){
            const promise = new Promise((resolve, reject) => {
                const pool = mysql.createPool({
                    host: "egci492db.cnif8x09ijrk.us-west-2.rds.amazonaws.com",
                    user: "egci492dev",
                    password: "egci492db4seniorproject",
                    database: "egcicourse"
                })
            
                pool.getConnection(function(err, connection) {
                    connection.query(`(SELECT * FROM Users WHERE id LIKE '${id}')`, (err, ID) => {
                    if (err) throw err;
                    //console.log(ID[0]); 
                    connection.release();
                    resolve(JSON.parse(JSON.stringify(ID[0])))
                    })
                })
            })
            const result = await promise
            return done(null, result)
        }
        getID(id)
    })
}

module.exports = initialize