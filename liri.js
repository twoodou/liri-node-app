var userInput = process.argv[2];
var fsReadInput = "";
var movieName = "";
var songInput = "";
var dynamicList = [];

// TWITTER FUNCTION   ------------------------------------------------------
function lookupTweets() {
  var Twitter = require('twitter');
  var twitterKeys = require("./keys.js");

  var client = new Twitter({
    consumer_key: twitterKeys.consumer_key,
    consumer_secret: twitterKeys.consumer_secret,
    access_token_key: twitterKeys.access_token_key,
    access_token_secret: twitterKeys.access_token_secret
  });

  var twitterName = {
    screen_name: 'twoodOU'
  };
  client.get('statuses/home_timeline', twitterName, function(error, tweets, response) {
    if (!error) {
      for (var i = 0; i < tweets.length; i++) {
        var x = i + 1;
        console.log("");
        console.log("------------------TWEET # " + x + " --------------------");
        console.log("Name: " + tweets[i].user.name);
        console.log("");
        console.log("@" + tweets[i].user.screen_name);
        console.log("");
        console.log("Created: " + tweets[i].created_at);
        console.log("");
        console.log("Tweet: " + tweets[i].text);

      }
    } else {
      return console.log('Error occurred: ' + error);
    }
  });
}
// SPOTIFY FUNCTION ------------------------------------------------------
function lookupSongs() {
  var clientID = "fdd7a48baf6c4f25a097f51b9583585f";
  var clientSecret = "52bc77fbabc246e3a8524c5c523707a5";
  var Spotify = require('node-spotify-api');
  var spotify = new Spotify({
    id: 'fdd7a48baf6c4f25a097f51b9583585f',
    secret: '52bc77fbabc246e3a8524c5c523707a5'
  });
  var trackLimit = 10;

  spotify.search({
    type: 'track',
    query: songInput,
    limit: trackLimit
  }, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }

    for (var i = 0; i < data.tracks.items.length; i++) {
      var x = i + 1;
      console.log("");
      console.log("------------------RESULT " + x + " --------------------");
      console.log("Artist: " + data.tracks.items[i].artists[0].name);
      console.log("");
      console.log("Title: " + data.tracks.items[i].name);
      console.log("");
      console.log("Preview Link: " + data.tracks.items[i].preview_url);
      console.log("");
      console.log("Album: " + data.tracks.items[i].album.name);

    }

  });
}
// OMDB FUNCTION ------------------------------------------------------
function lookupMovie() {
  var request = require("request");
  request("http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece", function(error, response, body) {

    if (!error && response.statusCode === 200) {
      console.log("----------------------------------------------------------");
      console.log("Title: " + JSON.parse(body).Title);
      console.log("----------------------------------------------------------");
      console.log("Year: " + JSON.parse(body).Year);
      console.log("----------------------------------------------------------");
      console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
      console.log("----------------------------------------------------------");
      console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
      console.log("----------------------------------------------------------");
      console.log("Country: " + JSON.parse(body).Country);
      console.log("----------------------------------------------------------");
      console.log("Language(s): " + JSON.parse(body).Language);
      console.log("----------------------------------------------------------");
      console.log("Plot: " + JSON.parse(body).Plot);
      console.log("----------------------------------------------------------");
      console.log("Actors: " + JSON.parse(body).Actors);
      console.log("----------------------------------------------------------");
    }
  });
}

// TWITTER IF-STATEMENT------------------------------------------------------
if (userInput === "my-tweets") {
  console.log("Liri thinking..." + "\ndigging through your twitter account...");
  lookupTweets();
}
// SPOTIFY IF STATEMENT------------------------------------------------------
else if (userInput === "spotify-this-song") {
  console.log("Now...Compiling...Songs...");

  for (var i = 3; i < process.argv.length; i++) {
    songInput += process.argv[i] + " ";
  }
  songInput = songInput.substring(0, songInput.length - 1);

  if (songInput === "") {
    songInput = "The Sign";
  }
  lookupSongs();
}

// OMDB IF-STATEMENT ------------------------------------------------------
else if (userInput === "movie-this") {
  console.log("Input received...");

  var request = require("request");

  for (var i = 3; i < process.argv.length; i++) {
    movieName += process.argv[i] + "+";
  }

  movieName = movieName.substring(0, movieName.length - 1);

  if (movieName == "") {
    movieName = "Mr. Nobody";
  }
  console.log("Now speed-watching " + movieName + " ...");
  lookupMovie();
}

// DO WHAT I SAYS   ------------------------------------------------------
else if (userInput === "do-what-it-says") {
  var inquirer = require("inquirer");
  var fs = require("fs");

  fs.readFile("random.txt", "utf8", function(error, data) {

    // If the code experiences any errors it will log the error to the console.
    if (error) {
      return console.log(error);
    }

    var dataArr = data.split(" ");
    // console.log(dataArr);

    for (var y = 0; y < dataArr.length; y++) {
      // var clipQuotationMarks = dataArr[y];
      // clipQuotationMarks.substring(0, clipQuotationMarks.length - 2);
      // clipQuotationMarks.substring(1, clipQuotationMarks.length);
      // dynamicList.push(clipQuotationMarks);
      fsReadInput += dataArr[y] + "+";
    }
    // console.log(dynamicList);

    fsReadInput = fsReadInput.substring(0, fsReadInput.length - 2);
    fsReadInput = fsReadInput.substring(1, fsReadInput.length);
    movieName = fsReadInput;
    songInput = fsReadInput;

    // console.log(fsReadInput);
    // console.log(movieName);
    // console.log(songInput);
  });

  inquirer.prompt([

    // {
    //   type: "list",
    //   name: "title",
    //   message: "Which title would you like to search?",
    //   choices: dynamicList
    // },

    {
      type: "list",
      name: "choices",
      message: "Would you like to search songs or movies?",
      choices: ["Songs", "Movies", "Neither, please fuck off."]
    }

  ]).then(function(input) {

    if (input.choices === "Songs") {
      songInput = fsReadInput;
      lookupSongs();
    } else if (input.choices === "Movies") {
      movieName = fsReadInput;
      lookupMovie();
    } else {
      console.log("That wasn't very nice...");
      return;
    }

  });
}
// Else - If input is not recognised---------------------------------------
else {
  console.log("Liri mad, input unknown!");
}
