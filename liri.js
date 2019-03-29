//code to read and set any environment variables with the dotenv package
require("dotenv").config();

//code required to import the keys.js file and store it in a variable
var keys = require("./keys.js");

var spotify = new Spotify(keys.spotify);


//Make it so liri.js can take in one of the following commands:
    //concert-this (node liri.js concert-this <artist/band name here>)
    //spotify-this-song (node liri.js spotify-this-song '<song name here>')
    //movie-this (node liri.js movie-this '<movie name here>')
    //do-what-it-says (node liri.js do-what-it-says)