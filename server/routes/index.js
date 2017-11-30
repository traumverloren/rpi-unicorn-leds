var express = require("express");
var router = express.Router();

// disallow bots
router.get("/robots.txt", function(req, res) {
  res.type("text/plain");
  res.send("User-agent: *\nDisallow: /");
});

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "Express" });
});

module.exports = router;
