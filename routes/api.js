const express = require("express");
const router = express.Router();

// JSON API route
router.get('/books', function (req, res) {
    let sqlquery = "SELECT * FROM books";

    db.query(sqlquery, (err, result) => {
        if (err) {
            return res.json({ error: err });
        }
        res.json(result);
    });
});

// API info page
router.get('/', function (req, res) {
    res.render('api.ejs');
});

module.exports = router;
