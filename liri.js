require("dotenv").config();

var keys = require("./keys.js");

var Spotify = require('node-spotify-api');
//var moment = require('moment');
var request = require('request');
var fs = require('fs');

var spotify = new Spotify(keys.spotify);

var command = process.argv[2];
var secondCommand = process.argv[3];

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
        movieThis();
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
            }
        }
    })
}