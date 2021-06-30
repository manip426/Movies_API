const mongoose = require('mongoose');
//const bcrypt = require('bcrypt');

let movieSchema = mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    genre: {
        name: String,
        description: String
    },
    director: {
        name: String,
        bio: String,
        birth: Date,
        death: Date
    },
    imagePath: String,
    featured: Boolean
})

let userSchema = mongoose.Schema({
    username: {type: String, required: true},
    pwd: {type: String, required: true},
    email: {type: String, required: true},
    birth_date: Date,
    favorite_movies: [{type: mongoose.Schema.Types.ObjectId, ref: 'Movie'}]
})

let genreSchema = mongoose.Schema({
    name: String,
    description: String
})

let directorSchema = mongoose.Schema({
  name: String,
  bio: String,
  birth: Date,
  death: Date
})

let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);
let Genre = mongoose.model('Genre', genreSchema);
let Director = mongoose.model('Director', directorSchema);

module.exports.Movie = Movie;
module.exports.User = User;
module.exports.Genre = Genre;
module.exports.Director = Director;


// Function that encrypts the password
//userSchema.statics.hashPassword = function(password) {
//    return bcrypt.hashSync(password, 10);
//};

// Function that compares the encrypted password from the route against the password from the DB.
//userSchema.methods.validatePassword = function(password) {
//    return bcrypt.compareSync(password, this.pwd);
//};
