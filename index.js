
// Imports express to the package
const express = require("express"),
 bodyParser = require("body-parser"),
  //const bodyParser = require('body-parser'),
  uuid = require("uuid");

//const morgan = require("morgan");
const app = express();
const mongoose = require("mongoose");
const Models = require("./models.js");
const { check, validationResult } = require('express-validator');


const Movies = Models.Movie;
const Users = Models.User;
mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useFindAndModify', false);
app.use(bodyParser.json());
//app.use(morgan("common"));
app.use(bodyParser.urlencoded({ extended: true }));


//authentication
let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');


//Serving static files middleware
app.use("/", express.static("public"));


// Home Page
app.get("/", (req, res) => {
    res.send("Welcome to my movie API!");
});

// Return all the movies in json format
app.get('/movies', passport.authenticate("jwt", { session: false }),
(req, res) => {
  Movies.find()
  .then((movies) => {
     res.status(201).json(movies);
})
.catch((err) => {
  console.error(err);
  res.status(500).send('Error: ' + err);
});
});

// Get all users
app.get('/users',
(req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


// Gets the data about a single movie, by title
app.get("/movies/:Title", passport.authenticate("jwt", { session: false }),
(req, res) => {
  Movies.findOne({Title: req.params.Title})
  .then((movie) => {
     res.json(movie);
})
.catch((err) => {
  console.error(err);
  res.status(500).send("Error: " + err);
  });
});


//get JSON genre info when looking a particular Genre

app.get("/genre/:Name", passport.authenticate("jwt", { session: false }),
(req, res) => {
  Genre.findOne({Name: req.params.Name})
  .then((genre) => {
     res.json(genre.Description);
})
.catch((err) => {
  console.error(err);
  res.status(500).send("Error: " + err);
  });
});

//Get info on director when looking for specific Director

app.get("/director/:Name", passport.authenticate("jwt", { session: false }),
(req, res) => {
  Directors.findOne({Name: req.params.Name})
  .then((director) => {
     res.json(director);
})
.catch((err) => {
  console.error(err);
  res.status(500).send("Error: " + err);
  });
});

// Adds data for a new movie to our list of movies.
//app.post('/movies', (req, res) => {
//  let newMovie = req.body;

//  if (!newMovie.title) {
  //  const message = 'Missing name in request body';
//    res.status(400).send(message);
//} else {
  //  newMovie.title = uuid.v4();
  //  movies.push(newMovie);
  //  res.status(201).send(newMovie);
//  }
//});
// Deletes a movie from our list by ID
app.delete('/movies/:id', passport.authenticate("jwt", { session: false }),
(req, res) => {
  let movie = movies.find((movie) => { return movie.id === req.params.id });

  if (movie) {
    movies = movies.filter((obj) => { return obj.id !== req.params.id });
    res.status(201).send('Movie ' + req.params.id + ' was deleted.');
  }
});


//allow users to register
app.post("/users", (req, res) => {
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users.create({
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday,
          })
          .then((user) => {
            res.status(201).json(user);
           })
        .catch((error) => {
          console.error(error);
          res.status(500).send("Error: " + error);
        });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error: " + error);
    });
});




// Update a user's info, by username

app.put("/users/:Username", passport.authenticate("jwt", { session: false }),
(req, res) => {

  Users.findOneAndUpdate(
    {
      Username: req.params.Username
    },
    {
      $set: {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
  { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  }
);
});

// Allow users to add a movie to their list of favorites
app.post(
  "/users/:username/:favoritemovies",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      {
        username: req.params.username,
      },
      {
        $push: {
          favoritemovies: req.params.favoritemovies,
        },
      },
      {
        new: true,
      },
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error: " + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);




// Delete a user by username

app.delete('/users/:Username', passport.authenticate("jwt", { session: false }),
(req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


// Error handling.
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// listen for requests
app.listen(8080, () =>{
  console.log('Your app is listening on port 8080.');
});
