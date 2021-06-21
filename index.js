

// Imports express to the package
const express = require('express'),
  bodyParser = require('body-parser'),
  uuid = require('uuid');
//To import morgan into my package
//const morgan = require('morgan');


// Declares a new variable to encapsulate the Express's functionality.
const app = express();
// Top 10 movies of all time.
let movies = [{
        id: 1,
        title: " The Lion King",
        director: "Roger Allers, Rob Minkoff",
        genres: "Adventure",
    },
    {
       id: 2,
        title: "Modern Times",
        director: "Charles Chaplin",
        genres: "Comedy",
    }, {
        id: 3,
        title: "Taxi Driver",
        director: "Martin Scorsese",
        genres: "Drama Thriller",
    }, {
        id: 4,
        title: "Once Upon a Time in the West",
        director: "Sergio Leone",
        genres: "Western",
    }, {
        id: 5,
        title: "Super Bad",
        director: "Greg Mottola",
        genres: "Comedy",
    }, {
        id: 6,
        title: "Alien",
        director: "Ridley Scott",
        genres: "Horror",
    }, {
        id: 7,
        title: "Joker",
        director: "Todd Phillips",
        genres: "Crime",
    }, {
        id: 8,
        title: "3 Idiots",
        director: "Rajkumar Hirani",
        genres: "Comedy",
    }, {
        id: 9,
        title: "Spider-Man",
        director: "Bob Persichetti",
        genres: "Animation",
    }, {
        id: 10,
        title: "The Godfather",
        director: "Francis Ford Coppola",
        genres: "Crime",
    }
];

//Serving static files middleware

app.use(express.static('public'));
//app.use(morgan('common'));

// GET route located at the endpoint "/" that return a default textual respomse
app.get("/", (req, res) => {
    res.send("Welcome to my movie API!");
});

//Express GET route located at the endpoint "/movies" that return a JSON object containing data about my top ten movies
app.get("/movies", (req, res) => {
    res.json(movies);
});

// Gets the data about a single movie, by title
app.get('/movies/:title', (req, res) => {
    res.json(
        movies.find((movie) => {
            return movie.title === req.params.title
        })
    );
});

// Adds data for a new movie to our list of movies.
app.post('/movies', (req, res) => {
  let newMovie = req.body;

  if (!newMovie.title) {
    const message = 'Missing name in request body';
    res.status(400).send(message);
  } else {
    newMovie.title = uuid.v4();
    movies.push(newMovie);
    res.status(201).send(newMovie);
  }
});
// Deletes a movie from our list by ID
app.delete('/movies/:id', (req, res) => {
  let movie = movies.find((movie) => { return movie.id === req.params.id });

  if (movie) {
    movies = movies.filter((obj) => { return obj.id !== req.params.id });
    res.status(201).send('Movie ' + req.params.id + ' was deleted.');
  }
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
