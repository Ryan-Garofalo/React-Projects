var express = require("express"),
  path = require("path"),
  bodyParser = require("body-parser"),
  cons = require("consolidate"),
  dust = require("dustjs-helpers"),
  pg = require("pg"),
  request = require("request"),
  app = express();

// DB Connect String

const config = {
  user: "postgres",
  database: "recipebookdb",
  password: "getmoney",
  port: 5432 //Default port, change it if needed
};

const pool = new pg.Pool(config);

// Assign Dust Engine to .dust Files
app.engine("dust", cons.dust);

// Set Default Ext .dust
app.set("view engine", "dust");
app.set("views", __dirname + "/views");

// Set Public Folder

app.use(express.static(path.join(__dirname, "public")));

// Body Parser Middleware

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get("/", function(req, res) {
  request.get(
    "https://dog.ceo/api/breeds/image/random",
    (error, response, body) => {
      if (error) {
        return console.dir(error);
      }
      // console.dir(JSON.parse(body));
      var answer = JSON.parse(body);
      console.log(answer.message);
    }
  );

  pool.connect(function(err, client, done) {
    if (err) {
      console.log("Can not connect to the DB" + err);
    }
    client.query("SELECT * FROM recipes", function(err, result) {
      done();
      if (err) {
        console.log(err);
        res.status(400).send(err);
      }
      res.render("index", {recipes: result.rows});
    });
  });
});

app.post("/add", function(req, res) {
  request.get(
    "https://dog.ceo/api/breeds/image/random",
    (error, response, body) => {
      if (error) {
        return console.dir(error);
      }
      // console.dir(JSON.parse(body));
      var answer = JSON.parse(body);
      var data = answer.message;

      pool.connect(function(err, client, done) {
        if (err) {
          console.log("Can not connect to the DB" + err);
        }
        client.query(
          "INSERT INTO recipes(name, ingredients, directions) VALUES($1, $2, $3 )",
          [data, data, data]
        );
      });

    }
  );

  res.redirect("/");
});

// Server
app.listen(3000, function() {
  console.log("Server Started on Port 3000");
});

// pg.connect(connect, function(err, client, done){
//   if(err) {
//     return console.error('error fetching client from pool'. err);
//   }
//   client.query('SELECT * FROM recipes', function(err, results){
//     if(err){
//       return console.error('error running query', err );
//     }
//
//     done();
//   });
// });
