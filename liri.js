//code to read and set any environment variables with the dotenv package
require("dotenv").config();

//code required to import the keys.js file and store it in a variable
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var fs = require("fs");
var fs = require("axios");
var request = require("request");

//vars to capture user inputs.
var input = process.argv[2]; 
var search = process.argv[3];


//Make it so liri.js can take in one of the following commands:
    //concert-this (node liri.js concert-this <artist/band name here>)
    //spotify-this-song (node liri.js spotify-this-song '<song name here>')
    //movie-this (node liri.js movie-this '<movie name here>')
    //do-what-it-says (node liri.js do-what-it-says)

command (input, search);

function command() {
    if ( input === "concert-this" ) {
    concertThis(search);
    }else if (input === "spotify-this-song") {
    spotifyThisSong(search);
    }else if (input === "movie-this") {
    movieThis(search);
    }else if (input === "do-what-it-says"){
    doThis();
    }
}

//=============================================================================
//function for concert-this (node liri.js concert-this <artist/band name here>)
//=============================================================================

function concertThis() {
    //api url
    var queryUrl = "https://rest.bandsintown.com/artists/" + search + "/events?app_id=codingbootcamp";
    console.log(queryUrl);

    //axios request to use bands in town api
    request(queryUrl, function(err, response) {
        //log error
        if (err) {
            console.log(err);
        } else { //if no error then log details
            //var concerts = JSON.parse("body");
            //format date/time using moment
            //var concertDT = concertData[0].datetime
            //var momentDT = moment().format('L');

            //console.log(JSON.stringify(response.concerts, null, 2));
            
            for (var i = 0; i < response.concerts.length; i++) {  
                console.log(
                    "\n-----------------------------------" +
                    "\nVenue: " + response.concerts.venue.name +
                    "\nLocation: " + response.concerts.venue.city +
                    "\nDate: " + response.concerts.datetime +
                    "\n-----------------------------------\n"
                );
            }
        } 
    });
}

//==================================================================================
//function for spotify-this-song (node liri.js spotify-this-song '<song name here>')
//==================================================================================

function spotifyThisSong () {
    // var song = "";      

    //search default setting
    if(!search) {
        search =  "the sign ace of base";
    }
    
    //loop through all the words in the node argument
    // for (var i = 2; i < search.length; i++) {

    //     if (i > 2 && i < search.length) {
    //         song = song + "+" + search[i];
    //     }else {
    //         song += search[i];
    //     }
    // }
    
    // axios request to use spotify api request
    //spotify.search({ type: 'track', query: song }, function(err, data) {
    spotify.search({ type: 'track', query: search }, function(err, data) {
        //log error
        if(err) {
            console.log(err);
        } else { //if no error then log details
            
            for(var i = 0; i < data.tracks.items[0].artists.length; i++) {
                console.log(
                    "\n-----------------------------------" +
                    "\nArtist(s): " + data.tracks.items[0].artists[i].name +
                    "\nSong Name: " + data.tracks.items[0].name +
                    "\nPreview Link: " + data.tracks.items[0].preview_url+
                    "\nAlbum: " + data.tracks.items[0].album.name +
                    "\n-----------------------------------\n"
                );
            };
        } 
            
    });
}

//=======================================================================
//function for movie-this (node liri.js movie-this '<movie name here>')
//=======================================================================

function movieThis () {
    
    //var fs = require("axios");

    // Create an empty variable for holding the movie name
    var movieName = "";

    //loop through all the words in the node argument
    for (var i = 2; i < search.length; i++) {

        if (i > 2 && i < search.length) {
            movieName = movieName + "+" + search[i];
        }
        else {
            movieName += search[i];
        }
    }

    //api url
    var queryUrl = "http://www.omdbapi.com/?apikey=trilogy&t=" + search ;
    //var queryUrl = "http://www.omdbapi.com/?t=" + search + "&y=&plot=short&apikey=trilogy";
    console.log(queryUrl);

    //search defualt setting
    if (!search) {
        search = "mr nobody";
        console.log(
            "\n-----------------------------------" +
            "\nIf you haven't watched 'Mr. Nobody,' then you should: " +
            "\nhttp://www.imdb.com/title/tt0485947/" +
            "\nIt's on Netflix!" +
            "\n-----------------------------------\n"
        ); 
    }
    
    //axios request to use omdb api
    request(queryUrl, function(err, response) {
        //log error
        if (err){ 
			return console.log(err);
        } else { //if no error then log details
            //var jsonData = response;

            //console.log(JSON.parse(response.body));

            var jsonData=JSON.parse(response.body);

            console.log(
                "\n-----------------------------------" +
                "\nMovie: " + jsonData.Title +
                "\nReleased: " + jsonData.Year +
                "\nIMDB Rating: " + jsonData.ImdbRating +
                "\nRotten Tomato Rating: " + rottenTomato() +
                "\nCountry Released: " + jsonData.Country +
                "\nMovie Language: " + jsonData.Language +
                "\nPlot: " + jsonData.Plot +
                "\nActors: " + jsonData.Actors +
                "\n-----------------------------------\n"
            ); 

            //loop parses through Ratings object in response.body to see if there is a RT rating
            function rottenTomato (){
                for(var i = 0; i > 0; i++) {
                    if(jsonData.Ratings[i].Source === "Rotten Tomatoes") {
                        console.log("Rotten Tomatoes Rating: " + jsonData.Ratings[i].Value);
                    } else {
                        console.log ("Rotten Tomatoes Rating: null " );
                    }
                }
            }    
        }

    });
}


//=======================================================================
//function for do-what-this-says (node liri.js do-what-it-says)
//=======================================================================

function doThis () {

    //requiring core package for reading and writing files
    var fs = require("fs");

    //code to read from the "random.txt" file.
    fs.readFile("random.txt", "utf8", function(err, data){
        
        

        //log error
        if (err){ 
			console.log(err);
        } else { // if no error then log data
            console.log(data);
        var array = data.split(",");
        console.log("node liri.js " + array[0] + " " + array[1]);
        
        }
    });
    
}