/*jslint -W020, browser:true, devel:true, white:true, vars:true, eqeq:true */
/*global $:false, intel:false, invalidKey:false*/
// ********************SET YOUR API KEY HERE**********************
// Insert your Rotten Tomatoes API Key here. README for more info.
var apiKey = 'jdvn9wczt76se4mbryxcch9k';
// ***************************************************************

// Check if valid API Key
function checkKeyValidity() {
	var url = 'http://api.rottentomatoes.com/api/public/v1.0/lists/movies/opening.json?limit=1&apikey=' + apiKey;

	invalidKey = false;

	// Docs: http://app-framework-software.intel.com/api2/index.html#$_get
	var keyTest = $.get(url, "GET", function(data) {});
	keyTest.onreadystatechange = function() {
		if (keyTest.readyState == 4) {
			if (keyTest.status == 403) {
				invalidKeyAlert();
				invalidKey = true;
			}
		}
	};
}

function invalidKeyAlert() {
	alert('Invalid API key. See README and edit js/api.js file.');
}

// Make Opening_Movies API call to RottenTomatoes
// Docs: http://developer.rottentomatoes.com/docs/read/json/v10/Opening_Movies
function fetchOpeningMovies() {
    if (invalidKey) {
        invalidKeyAlert();
        return false;
    }
    

    intel.xdk.services.rottentomatoesopening({"limit":"16","country":"us"})
        .then(function (response) {
          console.log(" Got back : " + response);
          fetchOpeningMoviesCallback(response);
        });

}

function fetchOpeningMoviesCallback(data) {
//    console.log(" callback : entered ");
	if (!data.movies) {
		alert('No movies were found. Sorry!');
		return false;
	}
	var movies = data.movies;

	$("#rottentomatoes-results-output").show();
	$("#rottentomatoes-results-output").html('<p class="center"><strong>Top Movies</strong></p>');

	$.each(movies, function(index, movie) {
		var html = '<hr />';
		html += '<div id="box-' + index + '"class="box"><img src="' + movie.posters.thumbnail + '" />';
		if (movie.ratings.critics_score > 0) {
			if (movie.ratings.critics_rating === 'Rotten') {
				html += ' <img src="http://content.developer.mashery.com.s3.amazonaws.com/xdk-demos/rottentomatoes/rotten.png" />';
			} else {
				html += ' <img src="http://content.developer.mashery.com.s3.amazonaws.com/xdk-demos/rottentomatoes/fresh.png" />';
			}
			html += ' ' + movie.ratings.critics_score + '%';
		}
		html += '<p><a href="' + movie.links.alternate + '" target="_blank">' + movie.title + '</a></p></div>';
		$("#rottentomatoes-results-output").append(html);
	});
}

/* ----------------------------------------------------------  */
var pOut = '</strong></p>';
var pIn = '<p class="center"><strong> : ';
var listening = false;
function tryQRcode() {
    $("#rottentomatoes-results-output").append('<hr />');
    if ( ! listening) {
        document.addEventListener("intel.xdk.device.barcode.scan",function(evt){
            $("#rottentomatoes-results-output").append(pIn + 'Heard' + pOut);
            intel.xdk.notification.beep(1);
            if (evt.success === true) {
                //successful scan
                //console.log(evt.codedata);
                $("#rottentomatoes-results-output").append(pIn + String(evt.codedata) + pOut);
            } else {
                //failed scan
                $("#rottentomatoes-results-output").append(pIn + "Scan Operation Failed" + pOut);
            }
        },false);
        listening = true;
    }
    $("#rottentomatoes-results-output").append(pIn + 'Firing scanner' + pOut);
    intel.xdk.device.scanBarcode();
    $("#rottentomatoes-results-output").append(pIn + 'Fired scanner' + pOut);
}


/* ----------------------------------------------------------  */
function fetchAccessTest() {

    intel.xdk.services.AccessTestgeddit({})
        .then(function (response) {
          console.log(" Got back : " + response);
          fetchAccessTestCallback(response);
        });
}

function fetchAccessTestCallback(data) {
    console.log(" callback : entered " + data);
	$("#rottentomatoes-results-output").html('<p class="center"><strong>' + data + pOut);
    return true;
}
