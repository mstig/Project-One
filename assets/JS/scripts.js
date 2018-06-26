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





    /// start up game on load
    $("#startMenu,#startBtn").fadeIn(2500).removeClass('hidden');

    /// Goes to first question
    $("#startBtn").click(function () {
        $("#startBtn").hide();
        $("#jumbotron1").show(2000);
        $("#enterBand-Div").show();
        $("#startMenu").hide(1000);

    })

    $("#submitBandBtn").on("click", function () {
        event.preventDefault();
        if ($("#band-input").val().trim() === "") {
         $('.modal').modal();
         $('.modal').modal("open");
        }

        $("#jumbotron1").hide(1000);
        $("#jumbotron2, #jumbotron3").show(2000);



        var band = $("#band-input").val().trim().toUpperCase();
        var queryURL = "https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=" + band + "&api_key=43aa7275eb736bbda8af4906bb03dfaa&format=json"

        $("#ticketmaster-view").prepend("<h5> SHOWS NEAR YOU SIMILAR TO " + band);








        // Creating an AJAX call for the specific band button being clicked
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);

            var bandsReturn = response.artist.similar.artist;
            var bandGenre = response.artist.tags.tag[0].name;
            console.log(bandGenre);
            console.log(bandsReturn);

            $("#widget").append('<div w-type="event-discovery" w-tmapikey="ITMP1WL5haYqT4ySnnZVTYi5HEV0QB3M" w-googleapikey="AIzaSyDLaes9_vXmELG_d5SGPPGNelBrWiHIkLM" w-keyword="' + bandGenre + '" w-theme="listviewthumbnails" w-colorscheme="light" w-width="300" w-height="600" w-size="25" w-border="2" w-borderradius="4" w-postalcode="" w-radius="100" w-period="month" w-layout="vertical" w-attractionid="" w-promoterid="" w-venueid="" w-affiliateid="" w-segmentid="" w-proportion="xxl" w-titlelink="off" w-sorting="groupByName" w-id="id_msj025" w-source="" w-latlong="37.5462865,-77.4089139"></div>');
            $("#widget").append('<script src="https://ticketmaster-api-staging.github.io/products-and-docs/widgets/event-discovery/1.0.0/lib/main-widget.js"></script>');

            $("#bands-view").append("<h3> SIMILAR ARTISTS TO " + band);
            $("#bands-view").append("<h5> Click a band to learn more!");


            for (i = 0; i < 5; i++) {
                console.log(bandsReturn[i].name);

                $("#enterBand-Div").hide(1000);
                $("#bands-view").show(1000);

                bandButtons = $("<button hidden>" + bandsReturn[i].name + "</button>");
                $(bandButtons).addClass("waves-effect waves-light btn-large");
                $("#bands-view").append(bandButtons);
                $(bandButtons).addClass("band-return")
                $(bandButtons).attr("data-band", bandsReturn[i].name)
                $(".band-return").show(1000);

            }

            database.ref().push({
                band: band,
                dateAdded: firebase.database.ServerValue.TIMESTAMP,
            });




        })

        $(document).on("click", ".band-return", function (event) {

            var bandInfo = $(this).attr("data-band");
            var queryURL = "https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=" + bandInfo + "&api_key=43aa7275eb736bbda8af4906bb03dfaa&format=json";


            console.log(bandInfo)

            $.ajax({
                url: queryURL,
                method: "GET"
            }).then(function (response) {

                console.log(response);

                var bandPic = response.artist.image[3]["#text"];
                var bandBio = response.artist.bio.summary;

                console.log(bandPic);
                console.log(bandBio);

                $("#band-info-div").empty();

                $("#band-info-div").append("<h1>" + bandInfo + "</h1>")
                $("<img class='img-thumbnail'>").attr("src", bandPic).appendTo("#band-info-div");
                $("#band-info-div").append("<br>");
                $("#band-info-div").append("<p>" + bandBio + "</p>");
                $("html, body").animate({ scrollTop: $(document).height() }, "slow");



            })

        })

    })

    database.ref().on("child_added", function (childSnapshot) {
        console.log(childSnapshot.val().band);

    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });

    $(document).on("ready", function () {

        database.ref().orderByChild("dateAdded").limitToLast(5).on("value", function (childSnapshot) {
            console.log(childSnapshot.val());
            for (let val of Object.values(childSnapshot.val())) {
                console.log(val.band);
            };

        });

    });






















})










