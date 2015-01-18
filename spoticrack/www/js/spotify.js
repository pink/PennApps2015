var client_id = "22243bc9ca2c43e5bc468028cfe201bb";
var client_secret = "e846594c66e8407ca44394715bd04640";

var api_header = "https://api.spotify.com/v1";

var echonest_key = "XLMVL0TXBIIOAHKBV";

var login_url = "";
var main_url = "";

var access_token = "";

var artistOrGenre = "artist";
var seedQuery = "The Killers";

// Login functions

// 1. Authorize app with spotify
function authorize() {
    var url = 'https://accounts.spotify.com/authorize?client_id=' + client_id +
        '&response_type=token' +
        '&scope=user-library-read' +
        '&redirect_uri=' + encodeURIComponent("http://andrewhe.me");
    document.location = url;
}

// 2. Retrieve access token
function extractToken() {
    var hash = location.hash.replace(/#/g, '');
    var all = hash.split('&');
    var args = {};
    
    var lol = all[0].split('=');
    access_token = lol[1];
}

function setSeed(type, query) {
    window.artistOrGenre = "artist"; // could be "album"
    window.seedQuery = "The Killers";
}

var songs = [];

function getTracks(numTracks) {
    var url = "http://developer.echonest.com/api/v4" 
	
    if (artistOrGenre === "artist") {
	url += "/artist/";
    }
    else {
	url += "/genre/";
    }

    url+= "similar?api_key=" + echonest_key
         + "&name=" + seedQuery
         + "&format=json&results=" + numTracks;

   
    $.getJSON(url, function(data) {
	songs = [];

	if (artistOrGenre === "artist") {
            var artists = data["response"]["artists"];

	    for (i=0; i<numTracks; i++) {
     	        var url2 = "http://developer.echonest.com/api/v4/song/search?"
		       + "api_key=" + echonest_key
		       + "&artist=" + artists[i]["name"]
               + "&bucket=id:spotify&bucket=track";
            $.getJSON(url2, function(data) {
                //console.log(data);
                var randIndex = Math.floor(Math.random() * 14);
                songs.push(data["response"]["songs"][randIndex]);
            });
	    }
	   

        }
	
	setTimeout(function() { testSpotifyEchonest(); }, 1000);

    });
}

function getImages(artist_name) {
    var url = "http://developer.echonest.com/api/v4/artist/images" 
        + "?api_key=" + echonest_key
        + "&name=" + artist_name
        + "&results=1";
    $.getJSON(url, function(data){
        console.log(data);
        var data_url = data["response"]["images"][0]["url"];
        console.log(data_url);
    });

}

function testSpotifyEchonest() {
    console.log(songs);
    var song_id = (songs[0]["artist_foreign_ids"][0]["foreign_id"].split(":"))[2];
    console.log(song_id);
    var url = "https://api.spotify.com/v1/tracks/" + song_id;
    $.getJSON(url, function(data){ 
        console.log(data);
    });
}
