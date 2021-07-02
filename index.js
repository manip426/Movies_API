
// Imports express to the package
const express = require("express"),
 bodyParser = require("body-parser"),
  //const bodyParser = require('body-parser'),
  uuid = require("uuid");

//const morgan = require("morgan");
// Declares a new variable to encapsulate the Express's functionality.
const app = express();
const mongoose = require("mongoose");
const Models = require("./models.js");

const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genre;
const Directors = Models.Director;
mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.json());
//app.use(morgan("common"));
app.use(bodyParser.urlencoded({ extended: true }));
// Top 10 movies of all time.
let movies = [{
        id: 1,
        title: "Silence of the Lambs",
        director: "Jonathan Demme",
        genres: "Thriller",
    },
    {
       id: 2,
        title: "Any Given Sunday",
        director: "Oliver Stone",
        genres: "Drama",
    }, {
        id: 3,
        title: "Donnie Brasco",
        director: "Mike Newell",
        genres: "Drama",
    }, {
        id: 4,
        title: "Taxi Driver",
        director: "Martin Scorsese",
        genres: "Crime",
    }, {
        id: 5,
        title: "The Irishman",
        director: "Martin Scorsese",
        genres: "Crime",
    }, {
        id: 6,
        title: "The Wolf of Wall Street",
        director: "Martin Scorsese",
        genres: "Crime",
    }, {
        id: 7,
        title: "Goodfellas",
        director: "Martin Scorsese",
        genres: "Drama",
    }, {
        id: 8,
        title: "Reservoir Dogs",
        director: "Quentin Tarantino",
        genres: "Drama",
    }, {
        id: 9,
        title: "Pulp Fiction",
        director: "Quentin Tarantino",
        genres: "Drama",
    }, {
        id: 10,
        title: "Jackie Brown",
        director: "Quentin Tarantino",
        genres: "Drama",
    }
];

//Serving static files middleware

app.use(express.static('public'));


// GET route located at the endpoint "/" that return a default textual respomse
app.get("/", (req, res) => {
    res.send("Welcome to my movie API!");
});

//Express GET route located at the endpoint "/movies" that return a JSON object containing data about my top ten movies
app.get('/movies', (req, res) => {
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
app.get('/users', (req, res) => {
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
app.get("/movies/:Title", (req, res) => {
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

app.get("/genre/:Name", (req, res) => {
  Genres.findOne({Name: req.params.Name})
  .then((genre) => {
     res.json(genre.Description);
})
.catch((err) => {
  console.error(err);
  res.status(500).send("Error: " + err);
  });
});

//Get info on director when looking for specific Director

app.get("/director/:Name", (req, res) => {
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
app.delete('/movies/:id', (req, res) => {
  let movie = movies.find((movie) => { return movie.id === req.params.id });

  if (movie) {
    movies = movies.filter((obj) => { return obj.id !== req.params.id });
    res.status(201).send('Movie ' + req.params.id + ' was deleted.');
  }
});


//allow users to register
app.post("/users", (req, res) => {
  Users.findOne({ Usename: req.body.Usename })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Usename + 'already exists');
      } else {
        Users.create({
            Usename: req.body.Usename,
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
/* We’ll expect JSON in this format
{
  Username: String,
  (required)
  Password: String,
  (required)
  Email: String,
  (required)
  Birthday: Date
}*/
app.put("/users/:Username", (req, res) => {
  Users.findOneAndUpdate(
    { Usename: req.params.Usename },
    {
      $set: {
      Usename: req.body.Usename,
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

// Add a movie to a user's list of favorites
app.post('/users/:Username/movies/:MovieID', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
     $push: { FavoriteMovies: req.params.MovieID }
   },
   { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});



// Delete a user by username
app.delete('/users/:Username', (req, res) => {
  Users.findOneAndRemove({ Usename: req.params.Usename })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Usename + ' was not found');
      } else {
        res.status(200).send(req.params.Usename + ' was deleted.');
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
