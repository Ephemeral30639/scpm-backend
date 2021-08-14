module.exports = {
    checkAuthenticated: function (req, res, next) {
                            if (req.isAuthenticated()){
                                return next()
                            }
    
        res.send("Not Logged In")
    },
    checkNotAuthenticated: function (req, res, next) {
                            if (req.isAuthenticated()){
                                return res.send("Already Logged In")
                            }
                            next()
    },
};

/*
checkAuthenticated = check if the client is logged in. If yes, allow access to the URL. If not, redirect the client to login page to login first.
checkNotAuthenticated = check if the client is logged in. If yes, redirect to homepage since client already logged in (doesn't make sense to log in twice). If not, allow access to the URL.

checkAuthenticated is for protecting the URL that require client to log in first.
checkNotAuthenticated is for preventing user to enter the same page that they should not be able to enter again (like log in).
*/