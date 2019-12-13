require("dotenv").config();

var keys = require("./keys.js");
var axios = require("axios")
var Spotify = require('node-spotify-api');
var moment = require('moment');
var request = require('request');
var fs = require('fs');
var divider = "\n-----------------------------------------------------------\n\n";

var spotify = new Spotify(keys.spotify);

var command = process.argv[2];
var secondCommand = process.argv.slice(3);


switch (command) {
    case "concert-this":
        concertThis();
        break;
    case "spotify-this-song":
        if (secondCommand) {
            spotifyThisSong(secondCommand);
        } else {
            spotifyThisSong("I Want It That Way");
        }
        break;
    case "movie-this":
        if (secondCommand) {
            movieThis(secondCommand)
        } else {
            movieThis("Mr. Nobody")
        };
        break;
    case "do-what-it-says":
        doWhatItSays();
        break;
}

function concertThis(artist) {
    var artist = secondCommand.join("+");
    var url = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

    axios.get(url).then(
        function (response) {
            var date = response.data[0].datetime;
            date = moment(date).format("MM/DD/YYYY");
            console.log("Name of the venue: " + response.data[0].venue.name);
            console.log("Venue Location: " + response.data[0].venue.city);
            console.log("Date of the Event: " + date)
            fs.appendFileSync("log.txt", "\nName of the venue: " + response.data[0].venue.name + "\nVenue Location: " + response.data[0].venue.city + "\nDate of the Event: " + date + divider)
        }
    )
        .catch(function (error) {
            console.log(error);
        })
}

function spotifyThisSong(song) {
    spotify.search({ type: 'track', query: song, limit: 1 }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        var songInfo = data.tracks.items

        for (var i = 0; i < songInfo.length; i++) {
            var albumObject = songInfo[i].album;
            var trackName = songInfo[i].name;
            var preview = songInfo[i].preview_url;
            var artistsInfo = albumObject.artists;

            for (var j = 0; j < artistsInfo.length; j++) {
                console.log("Artist: " + artistsInfo[j].name);
                console.log("Song Name: " + trackName);
                console.log("Preview of the song: " + preview);
                console.log("Album Name: " + albumObject.name);
                console.log("-------------------")
                //Append the data to the log.txt
                fs.appendFileSync("log.txt", "Artist: " + artistsInfo[j].name + "\nSong Name: " + trackName + "\nPreview of the song: " + preview + "\nAlbum Name: " + albumObject.name + divider);
            }
        }
    })
}

function movieThis(movieName) {

    var MovieName = secondCommand.join("+");
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    //console.log(queryUrl);
    axios.get(queryUrl).then(
        function (response) {
            console.log("Title of the movie: " + response.data.Title);
            console.log("Year the movie came out: " + response.data.Year);
            console.log("IMDB Rating: " + response.data.imdbRating);
            console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
            console.log("Country where the movie was produced: " + response.data.Country);
            console.log("Language of the movie: " + response.data.Language);
            console.log("Movie plot: " + response.data.Plot);
            console.log("Actors in the movie: " + response.data.Actors);
            fs.appendFileSync("log.txt", "\nTitle of the movie: " + response.data.Title + "\nYear the movie came out: " + response.data.Year +
                "\nIMDB Rating: " + response.data.imdbRating + "\nRotten Tomatoes Rating: " + response.data.Ratings[1].Value +
                "\nCountry where the movie was produced: " + response.data.Country + "\nLanguage of the movie: " + response.data.Language + "\nMovie plot: " +
                response.data.Plot + "\nActors in the movie: " + response.data.Actors + divider)
        }
    )
        .catch(function (error) {
            console.log(error);
        })
}

function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function(error, data){
        if (error){
            return console.log(error);
        }
        var contentArray = data.split(",");
        var content = contentArray[1];
        spotifyThisSong(content);

    })
}