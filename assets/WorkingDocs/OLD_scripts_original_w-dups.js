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
        // Input Validation for band-name & zip-code form sections
        if ($("#band-input").val().trim() === "" || $("#zip-input").val().trim() === "") {
            // If band-name or zip-code missing- initialize and open Modal1
            $('#modal1').modal();
            $('#modal1').modal("open");
            // When Modal1 triggered- stop on click event function from continuing
            return false;
        // If Modal1 not triggered- continuing on click event function
        } else {
            // JS animations to display similar bands & TicketMaster divs
            $("#jumbotron1").hide(1000);
            $("#jumbotron2, #jumbotron3").show(2000);
            // trimming band-name & zip-code whitespace for APi calls
            var band = $("#band-input").val().trim().toUpperCase();
            var zipCode = $("#zip-input").val().trim();
            // Google API for zipcode- changes zip top lat/long so TicketMaster search provides local results by zip
            var zipURL = "https://maps.googleapis.com/maps/api/geocode/json?address=";
            var latLong;
            // Last.FM API Call
            var queryURL = "https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=" + band + "&api_key=43aa7275eb736bbda8af4906bb03dfaa&format=json"
            // Appending TicketMaster Div with widget 
            $("#ticketmaster-view").prepend("<h5> SHOWS NEAR YOU SIMILAR TO " + band);
            // Pushing the user's band-name search to Firebase for use to display as recent search for new user- ordered by Timestamp input within FireBase
            database.ref().push({
                band: band,
                dateAdded: firebase.database.ServerValue.TIMESTAMP,
            });
            // Creating an AJAX call for the specific band button being clicked to display local search results
            $.ajax({ url: zipURL + zipCode, method: "GET" }).then(function (results) {
                latLong = results.results[0].geometry.location.lat + "," + results.results[0].geometry.location.lng;

                // AJAX CALL FOR Last.FM
                $.ajax({
                    url: queryURL,
                    method: "GET"
                // Last.FM API Response to be consoled & return similar artist
                }).then(function (response) {
                    // console.log(response);

                    var bandsReturn = response.artist.similar.artist;
                    var bandGenre = response.artist.tags.tag[0].name;
                    // console.log(bandGenre);
                    // console.log(bandsReturn);

                    // Input Validation if Last.FM does not return any results for band-name searched similar artist
                    // Displays to user that band-name search did not produce similar artist results, but still allows user to view TM widget for local shows
                    if (bandsReturn.length === 0) {
                        $("#bands-view").show(1000);
                        $("#bands-view").append("<h3> No similar artists for  " + band);
                        $("#bands-view").append("<h5> Try searching for another band! ");
                        ticketmasterShow(bandGenre, latLong);
                        // $("#widget").append('<div w-type="event-discovery" w-tmapikey="ITMP1WL5haYqT4ySnnZVTYi5HEV0QB3M" w-googleapikey="AIzaSyDLaes9_vXmELG_d5SGPPGNelBrWiHIkLM" w-keyword="' + bandGenre + '" w-theme="listviewthumbnails" w-colorscheme="light" w-width="300" w-height="600" w-size="25" w-border="2" w-borderradius="4" w-postalcode="" w-radius="100" w-period="month" w-layout="vertical" w-attractionid="" w-promoterid="" w-venueid="" w-affiliateid="" w-segmentid="" w-proportion="xxl" w-titlelink="off" w-sorting="groupByName" w-id="id_msj025" w-source="" w-latlong="37.5462865,-77.4089139"></div>');
                        // $("#widget").append('<script src="https://ticketmaster-api-staging.github.io/products-and-docs/widgets/event-discovery/1.0.0/lib/main-widget.js"></script>');
                        return false;
                    }
                    // TicketMaster call to display local results by zipcode
                    // User zip-code input first changed to lat/long for correct TicketMaster API parameters needed
                    ticketmasterShow(bandGenre, latLong);
                            // $("#widget").append('<div w-type="event-discovery" w-tmapikey="ITMP1WL5haYqT4ySnnZVTYi5HEV0QB3M" w-googleapikey="AIzaSyDLaes9_vXmELG_d5SGPPGNelBrWiHIkLM" w-keyword="' + bandGenre + '" w-theme="listviewthumbnails" w-colorscheme="light" w-width="300" w-height="600" w-size="25" w-border="2" w-borderradius="4" w-postalcode="" w-radius="100" w-period="month" w-layout="vertical" w-attractionid="" w-promoterid="" w-venueid="" w-affiliateid="" w-segmentid="" w-proportion="xxl" w-titlelink="off" w-sorting="groupByName" w-id="id_msj025" w-source="" w-latlong="37.5462865,-77.4089139"></div>');
                            // $("#widget").append('<script src="https://ticketmaster-api-staging.github.io/products-and-docs/widgets/event-discovery/1.0.0/lib/main-widget.js"></script>');
                    // Creates similar-artist buttons with JS animation- loops through create 5 buttons from results
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

    // On click event to handle displaying info from Last.FM API about similar-artists(-displays band name, image, summary & link to more info on Last.FM website-)
    $(document).on("click", ".band-return", function (event) {
        // Prevents page from reloading
        event.preventDefault();
        // $('#modal2').modal("close");
        // New last.FM AJAX Call to retrieve individual band summary & image
        var bandInfo = $(this).attr("data-band");
        var queryURL = "https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=" + bandInfo + "&api_key=43aa7275eb736bbda8af4906bb03dfaa&format=json";
        $.ajax({
            url: queryURL,
            method: "GET"
        // Response from Last.FM
        }).then(function (response) {
            console.log(response);
            var bandPic = response.artist.image[3]["#text"];
            var bandBio = response.artist.bio.summary;
            console.log(bandPic);
            console.log(bandBio);
            // Displaying band summary and image
            $("#band-info-div").empty();
            $("#band-info-div").append("<h1>" + bandInfo + "</h1>")
            $("<img class='img-thumbnail'>").attr("src", bandPic).appendTo("#band-info-div");
            $("#band-info-div").append("<br>");
            $("#band-info-div").append("<p>" + bandBio + "</p>");
            // $("html, body").animate({ scrollTop: $(".scroll-head").offset().top }, 'slow');
            // YoutTube API AJAX Call/Response and response for band video sample
            var youtubeURL = 'https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&relevanceLanguage=en&regionCode=US&q=' + bandInfo + '&key=AIzaSyDLaes9_vXmELG_d5SGPPGNelBrWiHIkLM&type=video';
            $.ajax({ url: youtubeURL, method: "GET" }).then(function (response) {
                console.log(response);
                console.log(response.items[1].id.videoId);
                var playerId = response.items[1].id.videoId;
                // Displaying YouTube video
                $("#band-info-div").append("<p>Listen to a sample of " + bandInfo + ":");
                $("#band-info-div").append('<iframe width="500" height="315" src="https://www.youtube.com/embed/' + playerId + '" frameborder="0" allowfullscreen></iframe> ');
            })
        })
    })

// DUPLICATE CODE- See line 182-185
    // // Opening recent searches modal upon on click event button
    //     $(document).on("click", "#recent_searches", function (event) {
    //     $('#modal2').modal();
    //     $('#modal2').modal("open");
    // });

// DUPLICATE CODE- See line 188-200- Only difference is below adds an ID for CSS Style purposed
    // database.ref().orderByChild("dateAdded").limitToLast(10).on("value", function (childSnapshot) {
    //     console.log(childSnapshot.val());
    //     $("#recent-searches").empty();
    //     for (let val of Object.values(childSnapshot.val())) {
    //         console.log(val.band);
    //         recentButtons = $("<button>" + val.band + "</button>");
    //         $(recentButtons).addClass("waves-effect waves-light btn-large");
    //         $("#recent-searches").append(recentButtons);
    //         $(recentButtons).addClass("recent-band-return")
    //         $(recentButtons).attr("data-band", val.band);
    //     };
    // });

    // On click event that add class and changed val to bnand-name button clicked by user for use in Last.FM API call
    $(document).on("click", ".recent-band-return", function (event) {
        var inputRecentBand = $(this).attr("data-band");
        console.log(inputRecentBand);
        $("#band-input-label").addClass("active");
        $("#band-input").val(inputRecentBand);
    })

    // Opening recent searches modal upon on click event button
    $(document).on("click", "#recent_searches", function (event) {
        $('#modal2').modal();
        $('#modal2').modal("open");
    });

    // Limiting recent search buttons to last 10 user searches and displaying them to Modal at the bottom of page
    database.ref().orderByChild("dateAdded").limitToLast(10).on("value", function (childSnapshot) {
        console.log(childSnapshot.val());
        $("#recent-searches").empty();
        for (let val of Object.values(childSnapshot.val())) {
            console.log(val.band);
            recentButtons = $("<button>" + val.band + "</button>");
            // Below: only line not duplicated above in lines160-171 ** adds ID attr for CSS style -NEEDED **
            $(recentButtons).attr("id", "band-button2");
            $(recentButtons).addClass("waves-effect waves-light btn-large");
            $("#recent-searches").append(recentButtons);
            $(recentButtons).addClass("recent-band-return")
            $(recentButtons).attr("data-band", val.band);
        };
    });

    // If user clicks on recent-search buttons- displays band-name input and changs value of band-name input section above in the HTML 
    // Displays recent searches name vs. user manually inputting band-name
    $(document).on("click", ".recent-band-return", function (event) {
        var inputRecentBand = $(this).attr("data-band");
        console.log(inputRecentBand);
        $("#band-input-label").addClass("active");
        $("#band-input").val(inputRecentBand);
        $('#modal2').modal("destroy");
    })

    // Sticky Scrolling function on similar-artist
    // Makes TM widget always visiable/centered while user scrolls similar band summary/image/video displayed as an inline div to widget on page
    $(window).scroll(function () {
        $("#jumbotron3").css({
            "top": ($(window).scrollTop()) + "px",
            "left": ($(window).scrollLeft()) + "px"
        });
    });

});

