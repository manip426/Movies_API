// Imports express to the package
const express = require('express');
//To import morgan into my package
const morgan = require('morgan');

// Declares a new variable to encapsulate the Express's functionality.
const app = express();
// Top 10 movies of all time.
let movies = [{

        title: " The Lion King",
        director: "Roger Allers, Rob Minkoff",
        genres: "Adventure",
    },
    {
        title: "Modern Times",
        director: "Charles Chaplin",
        genres: "Comedy",
    }, {
        title: "Taxi Driver",
        director: "Martin Scorsese",
        genres: "Drama Thriller",
    }, {
        title: "Once Upon a Time in the West",
        director: "Sergio Leone",
        genres: "Western",
    }, {
        title: "Super Bad",
        director: "Greg Mottola",
        genres: "Comedy",
    }, {
        title: "Alien",
        director: "Ridley Scott",
        genres: "Horror",
    }, {
        title: "Joker",
        director: "Todd Phillips",
        genres: "Crime",
    }, {
        title: "3 Idiots",
        director: "Rajkumar Hirani",
        genres: "Comedy",
    }, {
        title: "Spider-Man",
        director: "Bob Persichetti",
        genres: "Animation",
    }, {
        title: "The Godfather",
        director: "Francis Ford Coppola",
        genres: "Crime",
    }
];

//Serving static files middleware

app.use(express.static('public'));
app.use(morgan('common'));

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
            return movie.title === req.params.title;
        })
    );
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
