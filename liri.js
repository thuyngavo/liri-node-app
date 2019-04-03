//code to read and set any environment variables with the dotenv package
require("dotenv").config();

//code required to import the keys.js file and store it in a variable
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var moment = require('moment');
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
    //console.log(queryUrl);

    //axios request to use bands in town api
    request(queryUrl, function(err, response) {
        //log error
        if (err) {
            console.log(err);
        } else { //if no error then log details

            //console.log(JSON.parse(response.body));

            var jsonData=JSON.parse(response.body);
                            
            if (jsonData.length>0) {
                for (var i = 0; i < 1; i++) {
                    
                    //format date/time using moment
                    var dateTime = moment(jsonData[i].datetime).format("MM/DD/YYY hh:00 A"); 

                    console.log(
                        "\n-----------------------------------" +
                        "\nArtist: " + jsonData[i].lineup[0] +
                        "\nVenue: " + jsonData[i].venue.name +
                        "\nLocation: " + jsonData[i].venue.city + "," + jsonData[i].venue.region +
                        "\nDate: " + dateTime +
                        "\n-----------------------------------\n"
                    );
                };    
            } else {
                console.log(
                    "\n-----------------------------------\n" +
                    "Artist/band not found..." +
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

    //search default setting
    if(!search) {
        search =  "the sign ace of base";
    }
    
    // axios request to use spotify api request
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

    //api url
    var queryUrl = "http://www.omdbapi.com/?apikey=trilogy&t=" + search ;
    //console.log(queryUrl);

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
    } else {
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

        //axios request to use omdb api
        request(queryUrl, function(err, response) {
            //log error
            if (err){ 
                return console.log(err);
            } else { //if no error then log details

                //console.log(JSON.parse(response.body));

                var jsonData=JSON.parse(response.body);

                console.log(
                    "\n-----------------------------------" +
                    "\nMovie: " + jsonData.Title +
                    "\nReleased: " + jsonData.Year +
                    "\nIMDB Rating: " + jsonData.imdbRating +
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
                        if(jsonData.Ratings[1].Source === "Rotten Tomatoes") {
                            console.log("Rotten Tomatoes Rating: " + jsonData.Ratings[1].Value);
                        } else {
                            console.log ("Rotten Tomatoes Rating: " + null);
                        }
                    }
                }    
            }
        });
    }
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
            //console.log(data);
        var array = data.split(",");
        
        input = array[0];
        search = array[1];

        command(input, search);
        
        }
    });
    
}