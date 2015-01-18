var client_id = "22243bc9ca2c43e5bc468028cfe201bb";
var client_secret = "e846594c66e8407ca44394715bd04640";

var api_header = "https://api.spotify.com/v1";

var echonest_key = "XLMVL0TXBIIOAHKBV";

var login_url = "";
var main_url = "";

var access_token = "";

var artistOrGenre = "";
var seedQuery = "";

var scope;
var songs = [];
var artists = [];
var songs_hold = [];
// Login functions

// 1. Authorize app with spotify
function authorize() {
    var url = 'https://accounts.spotify.com/authorize?client_id=' + client_id +
        '&response_type=token' +
        '&scope=user-library-modify' +
        '&redirect_uri=' + encodeURIComponent("http://andrewhe.me/spoticrack/www");
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

function addToMusic(songID) {
    var url = "https://api.spotify.com/v1/me/tracks?ids=" + songID;
    $.ajax({
        url: url,
        type: "PUT",
        headers: {
            "Authorization": "Bearer " + client_id,
        },
        success: function(response) {
            console.log(response);
        }
    });
}

function setSeed(type, query, scope) {
    artistOrGenre = type; // could be "album"
    seedQuery = query;
    console.log(artistOrGenre);
    console.log(seedQuery);
    this.scope = scope;
    getTracks(5);
}

function getTracks(numTracks) {
    var url = "http://developer.echonest.com/api/v4" 
	
    if (artistOrGenre === "artist") {
        url += "/artist/similar?results=10";
    }
    else {
        url += "/genre/artists?format=json&results=5";
    }

    url+= "&api_key=" + echonest_key
         + "&name=" + seedQuery.toLowerCase();
   
    $.getJSON(url, function(data) {
        artists = [];

        artists = data["response"]["artists"];
            /*
            for (i=0; i<numTracks; i++) {
                    var url2 = "http://developer.echonest.com/api/v4/song/search?"
                   + "api_key=" + echonest_key
                   + "&artist=" + artists[i]["name"]
                   + "&bucket=id:spotify";
                $.getJSON(url2, function(data) {
                    //console.log(data);
                    var randIndex = Math.floor(Math.random() * 14);
                    songs.push(data["response"]["songs"][randIndex]);
                    generateCard(data["response"]["songs"][randIndex]);
                });
            }
            */
        console.log(artists);
        for (var i = 0; i < artists.length; i++){
            searchAlbums(artists[i]["name"]);
        }
        setTimeout(function(){        for (var i = 0; i < artists.length; i++){
            fetchTracks(songs[i]["id"], songs[i]["img"]);
        }}, 1000);

       
        setTimeout(function(){ console.log(scope.cards); document.location= "#/menu/main"}, 1000);
        
    });
}
var searchAlbums = function (query) {
    $.ajax({
        url: 'https://api.spotify.com/v1/search',
        data: {
            q: query,
            type: 'album'
        },
        success: function (response) {
            var num = Math.floor(Math.random()*4);
            var img = response["albums"]["items"][num]["images"][0]["url"];
            var id = response["albums"]["items"][0]["id"];
            var album = {img: img, id: id};
            songs.push(album);
        }
    });
};

var fetchTracks = function (albumId, url) {
    $.ajax({
        url: 'https://api.spotify.com/v1/albums/' + albumId,
        success: function (data){
            //console.log(data);
            var num = Math.floor(Math.random()*data.tracks.items.length);
            var artist = data.artists[0].name;
            var song = data.tracks.items[num].preview_url;
            var name = data.tracks.items[num].name;
            var id = data.tracks.items[num].id;
            var album = {id: id, image: url, artist: artist, song: song, title: name};
            //console.log(album);
            scope.cards.push(album);

            songs_hold.push(album);
        }
    });
};

function generateCard(song) {
    
}

function getImages(artist_name) {
    var url = "http://developer.echonest.com/api/v4/artist/images" 
        + "?api_key=" + echonest_key
        + "&name=" + artist_name
        + "&results=1";
    $.getJSON(url, function(data) {
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
