// Create a new router
const express = require("express")
const router = express.Router()
const bcrypt = require('bcrypt')


const redirectLogin = (req, res, next) => {
    if (!req.session.userId ) {
      res.redirect('./login') // redirect to the login page
    } else { 
        next (); // move to the next middleware function
    } 
}


router.get('/register', function (req, res, next) {
    res.render('register.ejs')
})


router.get('/list', redirectLogin, function(req, res, next) {
    let sqlquery = "SELECT username, first_name, last_name, email FROM users"; // Don't select passwords!
    
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err);
        } else {
            res.render("listusers.ejs", {users: result});
        }
    });
});

router.post('/registered', function (req, res, next) {
    const plainPassword = req.body.password;
    const saltRounds = 10;
    
    // Hash the password before storing
    bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
        if (err) {
            next(err);
            return;
        }
        
        // Store hashed password in database
        let sqlquery = "INSERT INTO users (username, first_name, last_name, email, hashedPassword) VALUES (?,?,?,?,?)";
        let newrecord = [req.body.username, req.body.first, req.body.last, req.body.email, hashedPassword];
        
        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                next(err);
            } else {
                // Debug output (remove in production!)
                let response = 'Hello '+ req.body.first + ' '+ req.body.last +' you are now registered! We will send an email to you at ' + req.body.email;
                response += ' Your password is: '+ req.body.password +' and your hashed password is: '+ hashedPassword;
                res.send(response);
            }
        });
    });
});


// Display login form
router.get('/login', function(req, res) {
    res.render('login.ejs');
});

// process login
router.post('/loggedin', function(req, res, next) {
    let username = req.body.username;
    let password = req.body.password;
    
    // get the user's hashed password from database
    let sqlquery = "SELECT hashedPassword FROM users WHERE username = ?";
    
    db.query(sqlquery, [username], (err, result) => {
        if (err) {
            next(err);
        } else if (result.length === 0) {
            // User not found
            res.send('Login failed: User not found');
        } else {
            // User found, compare passwords
            let hashedPassword = result[0].hashedPassword;
            
            bcrypt.compare(password, hashedPassword, function(err, match) {
                if (err) {
                    next(err);
                } else if (match) {
                    
                    res.send('Login successful! Welcome back ' + username);
                    req.session.userId = req.body.username;
                } else {
                    res.send('Login failed: Incorrect password');
                }
            });
        }
    });
});

router.get('/logout', redirectLogin, (req,res) => {
    req.session.destroy(err => {
    if (err) {
        return res.redirect('./')
    }
    res.send('you are now logged out. <a href='+'./'+'>Home</a>');
    })
})


// Export the router object so index.js can access it
module.exports = router
