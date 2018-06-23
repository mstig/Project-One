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
        $(".jumbotron").show(2000);
        $("#enterBand-Div").show();
        $("#startMenu").hide(1000);

    })

    $("#submitBandBtn").on("click", function () {
        if ($("#band-input").val().trim() === "") {
            alert("you must enter a band.")
        }




        var band = $("#band-input").val().trim().toUpperCase();
        var queryURL = "https://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=" + band + "&api_key=43aa7275eb736bbda8af4906bb03dfaa&format=json"


        // Creating an AJAX call for the specific band button being clicked
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {

            var bandsReturn = response.similarartists.artist

            $("#bands-view").append("<h1> Similar Artists to " + band);
            $("#bands-view").append("<h3> Click a band to learn more!");

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
                $("<img>").attr("src", bandPic).appendTo("#band-info-div");
                $("#band-info-div").append("<p>" + bandBio + "</p>");



            })

        })

    })

    database.ref().on("child_added", function(childSnapshot) {
        console.log(childSnapshot.val().band);

    }, function(errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });

    database.ref().orderByChild("dateAdded").limitToLast(5).on("value", function(childSnapshot) {
        console.log(childSnapshot.val());
        for (let val of Object.values(childSnapshot.val())) {
           console.log(val.band);
        };
        
    });






















})










