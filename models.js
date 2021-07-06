const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

let MovieSchema = mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    Genre: {
        Name: String,
        Description: String
    },
    Director: {
        Name: String,
        Bio: String,
        Birth: Date,
        Death: Date
    },
    imagePath: String,
    featured: Boolean
})

let UserSchema = mongoose.Schema({
    Username: {type: String, required: true},
    Password: {type: String, required: true},
    Email: {type: String, required: true},
    Birthday: Date,
    favorite_movies: [{type: mongoose.Schema.Types.ObjectId, ref: 'Movie'}]
})

//let GenreSchema = mongoose.Schema({
  //  Name: String,
  //  Description: String
//})

//let DirectorSchema = mongoose.Schema({
//  Name: String,
//  Bio: String,
//  Birth: Date,
//  Death: Date
//})

let Movie = mongoose.model('Movie', MovieSchema);
let User = mongoose.model('User', UserSchema);
//let Genre = mongoose.model('Genre', GenreSchema);
//let Director = mongoose.model('Director', DirectorSchema);

module.exports.Movie = Movie;
module.exports.User = User;
//module.exports.Genre = Genre;
//module.exports.Director = Director;


// Function that encrypts the password
//userSchema.statics.hashPassword = function(password) {
//    return bcrypt.hashSync(password, 10);
//};

// Function that compares the encrypted password from the route against the password from the DB.
//userSchema.methods.validatePassword = function(password) {
//    return bcrypt.compareSync(password, this.pwd);
//};
