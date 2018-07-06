$(document).ready(function () {
    

    // Initializing Firebase
    var config = {
        apiKey: "AIzaSyDnUGtk_r_yXM12lOFbZNZp6iZETkMtPNE",
        authDomain: "project-one-uofr-codecamp-6-18.firebaseapp.com",
        databaseURL: "https://project-one-uofr-codecamp-6-18.firebaseio.com",
        projectId: "project-one-uofr-codecamp-6-18",
        storageBucket: "project-one-uofr-codecamp-6-18.appspot.com",
        messagingSenderId: "308355480486"
    };
    firebase.initializeApp(config);
    var database = firebase.database();
    

    /// start up inputs on load
    function ticketmasterShow(bandGenre, latLong) {
        $("#widget").append('<div w-type="event-discovery" w-tmapikey="ITMP1WL5haYqT4ySnnZVTYi5HEV0QB3M" w-googleapikey="AIzaSyDLaes9_vXmELG_d5SGPPGNelBrWiHIkLM" w-keyword="' + bandGenre + '" w-theme="listviewthumbnails" w-colorscheme="dark" w-width="375" w-height="425" w-size="25" w-border="2" w-borderradius="4" w-postalcode="" w-radius="100" w-period="month" w-layout="vertical" w-attractionid="" w-promoterid="" w-venueid="" w-affiliateid="" w-segmentid="" w-proportion="xxl" w-titlelink="off" w-sorting="groupByName" w-id="id_msj025" w-source="" w-latlong="' + latLong + '"></div>');
        $("#widget").append('<script src="https://ticketmaster-api-staging.github.io/products-and-docs/widgets/event-discovery/1.0.0/lib/main-widget.js"></script>');
    }


    // Start Button click event- triggers JS animations for band-name/zip input
    $("#startMenu,#startBtn").fadeIn(2500).removeClass('hidden');
    $("#startBtn").click(function () {
        $("#startBtn").hide();
        $("#jumbotron1").show(2000);
        $("#enterBand-Div").show();
        $("#startMenu").hide(1000);
    })


    // Submit Band button click event
    $("#submitBandBtn").on("click", function () {
        
        // prevents page from reloading
        event.preventDefault();
        
        // Input Validation for band-name & zip-code- If band-name/zip-code missing- initialize & open Modal1
        if ($("#band-input").val().trim() === "" || $("#zip-input").val().trim() === "") {
            $('#modal1').modal();
            $('#modal1').modal("open");
        // Modal1 triggered - stop function
            return false;
        
        // Modal1 not triggered - continuing on click event function
        } else {
        
            // JS animations to display similar bands & TicketMaster divs
            $("#jumbotron1").hide(1000);
            $("#jumbotron2, #jumbotron3").show(2000);
        
            // trimming band-name & zip-code whitespace for use in API calls
            var band = $("#band-input").val().trim().toUpperCase();
            var zipCode = $("#zip-input").val().trim();
            
            // Google API for zip-code- changes zip top lat/long so TicketMaster search provides local results by zip
            var zipURL = "https://maps.googleapis.com/maps/api/geocode/json?address=";
            var latLong;
            
            // Last.FM API Call
            var queryURL = "https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=" + band + "&api_key=43aa7275eb736bbda8af4906bb03dfaa&format=json"
            
            // Appending TicketMaster Div with widget 
            $("#ticketmaster-view").prepend("<h5> SHOWS NEAR YOU SIMILAR TO " + band);
            
            // Pushes user's band-name search to Firebase for storage- ordered by Timestamp input in Firebase 
            database.ref().push({
                band: band,
                dateAdded: firebase.database.ServerValue.TIMESTAMP,
            });

            // Creating AJAX call for Google API - zip-code input changed to lat/long for correct TicketMaster API parameters needed for local show results

            $.ajax({ url: zipURL + zipCode, method: "GET" }).then(function (results) {
                latLong = results.results[0].geometry.location.lat + "," + results.results[0].geometry.location.lng;

                // AJAX CALL FOR Last.FM
                $.ajax({
                    url: queryURL,
                    method: "GET"

                // Last.FM Response Handler- storing similar artist/genre from response in variable
                }).then(function (response) {

                    var bandsReturn = response.artist.similar.artist;
                    var bandGenre = response.artist.tags.tag[0].name;

                    // Input Validation - if Last.FM CANNOT return results for similar artist
                    // Displays message to user that search could not produce similar artist results ***still allows user to view TicketMaster widget for local shows***
                    if (bandsReturn.length === 0) {
                        $("#bands-view").show(1000);
                        $("#bands-view").append("<h3> No similar artists for  " + band);
                        $("#bands-view").append("<h5> Try searching for another band! ");
                        ticketmasterShow(bandGenre, latLong);

                         return false;
                    }
          
                    // Creates similar-artist buttons with JS animation- loops to create 5 buttons from Last.FM response
                    $("#bands-view").append("<h3> SIMILAR ARTISTS TO " + band);
                    $("#bands-view").append("<h5> Click a band to learn more!");
                    for (i = 0; i < 5; i++) {
                        console.log(bandsReturn[i].name);
                        $("#enterBand-Div").hide(1000);
                        $("#bands-view").show(1000);
                        bandButtons = $("<button hidden>" + bandsReturn[i].name + "</button>");
                        $(bandButtons).attr("id", "band-button");
                        $(bandButtons).addClass("waves-effect waves-light btn-large");
                        $("#bands-view").append(bandButtons);
                        $(bandButtons).addClass("band-return")
                        $(bandButtons).attr("data-band", bandsReturn[i].name)
                        $(".band-return").show(1000);
                    }

                })
            })
        }
    })


    // On click event- handles displaying band info from Last.FM (image, summary & link)
    $(document).on("click", ".band-return", function (event) {
        
        // Prevents page from reloading
        event.preventDefault();
        
        // New last.FM AJAX Call to retrieve band info
        var bandInfo = $(this).attr("data-band");
        var queryURL = "https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=" + bandInfo + "&api_key=43aa7275eb736bbda8af4906bb03dfaa&format=json";
        $.ajax({
            url: queryURL,
            method: "GET"
        
        // Response handler from Last.FM
        }).then(function (response) {
            console.log(response);
            var bandPic = response.artist.image[3]["#text"];
            var bandBio = response.artist.bio.summary;
            console.log(bandPic);
            console.log(bandBio);

            // Displaying band info/summary/image
            $("#band-info-div").empty();
            $("#band-info-div").append("<h1>" + bandInfo + "</h1>")
            $("<img class='img-thumbnail'>").attr("src", bandPic).appendTo("#band-info-div");
            $("#band-info-div").append("<br>");
            $("#band-info-div").append("<p>" + bandBio + "</p>");
           
            // YouTube API - AJAX Call & Response Handler to display band video sample
            var youtubeURL = 'https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&relevanceLanguage=en&regionCode=US&q=' + bandInfo + '&key=AIzaSyDLaes9_vXmELG_d5SGPPGNelBrWiHIkLM&type=video';
            $.ajax({ url: youtubeURL, method: "GET" }).then(function (response) {
                console.log(response);
                console.log(response.items[1].id.videoId);
                var playerId = response.items[1].id.videoId;
                
                // Displays YouTube video
                $("#band-info-div").append("<p>Listen to a sample of " + bandInfo + ":");
                $("#band-info-div").append('<iframe width="500" height="315" src="https://www.youtube.com/embed/' + playerId + '" frameborder="0" allowfullscreen></iframe> ');
            })
        })
    })


    // On click event - adds class and changed val to band-name button clicked by user - Needed for Last.FM API call
    $(document).on("click", ".recent-band-return", function (event) {
        var inputRecentBand = $(this).attr("data-band");
        console.log(inputRecentBand);
        $("#band-input-label").addClass("active");
        $("#band-input").val(inputRecentBand);
    });


    // Initialize & opens Modal2 to display recent searches from firebase upon on click event from form button
    $(document).on("click", "#recent_searches", function (event) {
        
        // *** Bug Fix *** Sets modal options to allow for scrolling when open AND closed -
        $('#modal2').modal({
            preventScrolling: false
        });
        $('#modal2').modal("open");
    });


    // Loop to displays & limit recent-search buttons to last 10 user searches - displays buttons to Modal2
    database.ref().orderByChild("dateAdded").limitToLast(10).on("value", function (childSnapshot) {
        console.log(childSnapshot.val());
        $("#recent-searches").empty();
        for (let val of Object.values(childSnapshot.val())) {
            console.log(val.band);
            recentButtons = $("<button>" + val.band + "</button>");
            $(recentButtons).attr("id", "band-button2");
            $(recentButtons).addClass("waves-effect waves-light btn-large");
            $("#recent-searches").append(recentButtons);
            $(recentButtons).addClass("recent-band-return")
            $(recentButtons).attr("data-band", val.band);
        };
    });


    // On click event handler for recent-search buttons 
    $(document).on("click", ".recent-band-return", function (event) {
        var inputRecentBand = $(this).attr("data-band");
        console.log(inputRecentBand);
        // Adds active class, changes value equal to band-name & displays band-name from recent-serarches in band-name input on form for user        
        $("#band-input-label").addClass("active");
        $("#band-input").val(inputRecentBand);
        $('#modal2').modal("destroy");
    })


    // Sticky Scrolling function - allows TM widget to remain visiable/centered while scrolling through similar-band info div
    $(window).scroll(function () {
        $("#jumbotron3").css({
            "top": ($(window).scrollTop()) + "px",
            "left": ($(window).scrollLeft()) + "px"
        });
    });


});


