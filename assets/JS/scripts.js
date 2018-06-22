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
    
    $("#submitBandBtn").on("click", function(event) {

        
        // prevents page reload  
        event.preventDefault();

        var band = $("#band-input").val().trim()
        var queryURL = "http://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=" + band + "&api_key=43aa7275eb736bbda8af4906bb03dfaa&format=json"

        
        // Creating an AJAX call for the specific band button being clicked
        $.ajax({
          url: queryURL,
          method: "GET"
        }).then(function(response) {
          
          var bandsReturn = response.similarartists.artist
  
          for (i = 0; i < 10; i++) { 
                console.log(bandsReturn[i].name);

            $("#enterBand-Div").hide(1000);
            $("#bands-view").show(1000);
            $("#bands-view").append("<li hidden>" + bandsReturn[i].name + "</li>" );
            $("li").show(2000);

            var artistName = response[i].getInfo.artist.name;
            var artistGenre = response[i].getInfo.artist.tag[0];
            var artistImage = response[i].getInfo.artist.image[3];
               
          }

          //grab value of bands by ID or class once added




          database.ref().push({
            artistName: artistName,
            artistGenre: artistGenre,
            artistImage: artistImage,
            dateAdded: firebase.database.ServerValue.TIMESTAMP,
        }, function(errorObject) {
            console.log("Errors handled: " + errorObject.code);
        });
        

        database.ref().orderByChild("dateAdded").limitToLast(5).on("value", function(snapshot) {
            console.log(snapshot.val());
        });
       
   
   
    })

})























})










