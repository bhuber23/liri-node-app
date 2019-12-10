require("dotenv").config();

var keys = require("./keys.js");
var axios = require("axios")
var Spotify = require('node-spotify-api');
//var moment = require('moment');
var request = require('request');
var fs = require('fs');

var spotify = new Spotify(keys.spotify);

var command = process.argv[2];
var secondCommand = process.argv[3];
var movieName = "";

switch (command){
    case "concert-this":
        concertThis();
        break;
    case "spotify-this-song":
        if (secondCommand){
        spotifyThisSong(secondCommand);
        }else {
            spotifyThisSong("I Want It That Way");
        }
        break;
    case "movie-this":
        if (secondCommand){
        movieThis(secondCommand)
        }else{
            movieThis("Mr. Nobody")
        };
        break;
    case "do-what-it-says":
        doWhatItSays();
        break;
}

function spotifyThisSong(song){
    spotify.search({ type: 'track', query: song, limit: 1}, function(err, data){
        if (err) {
            return console.log('Error occurred: ' + err);
          }
        var songInfo = data.tracks.items

        for (var i = 0; i < songInfo.length; i++){
            var albumObject = songInfo[i].album;
            var trackName = songInfo[i].name;
            var preview = songInfo[i].preview_url;
            var artistsInfo = albumObject.artists;

            for (var j = 0; j < artistsInfo.length; j++){
                console.log("Artist: " + artistsInfo[j].name);
                console.log("Song Name: " + trackName);
                console.log("Preview of the song: " + preview);
                console.log("Album Name: " + albumObject.name);
                console.log("-------------------")
                //Append the data to the log.txt
                fs.appendFileSync("log.txt", "Artist: " + artistsInfo[j].name + "\nSong Name: " + trackName + "\nPreview of the song: " + preview + "\nAlbum Name: " + albumObject.name);
            }
        }
    })
}

function movieThis(movieName){
    
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    //console.log(queryUrl);
    axios.get(queryUrl).then(
        function(response){
            console.log("Title of the movie: " + response.data.Title);
            console.log("Year the movie came out: " + response.data.Year);
            console.log("IMDB Rating: " + response.data.imdbRating);
            //console.log("Rotten Tomatoes Rating: " + response.data.Ratings["Source: Rotten Tomatoes".value]);
            console.log("Country where the movie was produced: " + response.data.Country);
            console.log("Language of the movie: " + response.data.Language);
            console.log("Movie plot: " + response.data.Plot);
            console.log("Actors in the movie: " + response.data.Actors);
        }
    )
}