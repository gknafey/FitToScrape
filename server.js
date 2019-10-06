var express = require("express");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = process.env.PORT || 3000;

var app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);

app.get("/scrape", function (req, res) {
  axios.get("https://www.thetimesinplainenglish.com").then(function (response) {
    var $ = cheerio.load(response.data);

    console.log(response.data);
    $("div h2").each(function (i, element) {

      var result = {};

      result.title = $(this)
        .children("a")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");

      result.summary = $(this)
        .parent("div")
        .children("div.entry")
        .children("p")
        .text();


      db.Article.create(result)
        .then(function (dbArticle) {
          console.log(dbArticle);
        })
        .catch(function (err) {
          console.log(err);
        });
    });
    console.log("Scrape Complete");
  });
  res.redirect('/');
});

app.get("/articles", function (req, res) {
  db.Article.find({})
    .then(results => res.json(results))
    .catch(err => console.log(err));
})

app.get("/articles/:id", function (req, res) {

  var specific = req.params.id;

  db.Article.findOne({ _id: specific }).populate("note").then(function (result) {
    res.json(result);
  })
    .catch(function (err) {
      res.json(err);
    });

});

app.post("/articles/:id", function (req, res) {

  db.Note.create(req.body).then(function (dbNote) {
    return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
  })
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    })

});


app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});