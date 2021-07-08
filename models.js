const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
//Define Schemas
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
});
// Hash submitted password
UserSchema.statics.hashPassword = (Password) => {
    return bcrypt.hashSync(Password, 10);
};

// Compare hashed passwords
UserSchema.methods.validatePassword = function(Password) {
    return bcrypt.compareSync(Password, this.Password);
};


let Movie = mongoose.model('Movie', MovieSchema);
let User = mongoose.model('User', UserSchema);

module.exports.Movie = Movie;
module.exports.User = User;
