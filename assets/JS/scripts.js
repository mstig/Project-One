$(document).ready(function () {




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
        

        

        var band = $("#band-input").val().trim()
        var queryURL = "http://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=" + band + "&api_key=43aa7275eb736bbda8af4906bb03dfaa&format=json"

        
        // Creating an AJAX call for the specific band button being clicked
        $.ajax({
          url: queryURL,
          method: "GET"
        }).then(function(response) {
          
          var bandsReturn = response.similarartists.artist
          console.log(bandsReturn);
  
          for (i = 0; i < 10; i++) { 
                console.log(bandsReturn[i].name);

            $("#enterBand-Div").hide(1000);
            $("#bands-view-header").text("Similar Artists to " + band);
            $("#bands-view-header").show();
            $("#bands-view").show(1000);
            $("#bands-view").append("<li hidden>" + bandsReturn[i].name + "</li>" );
            $("li").show(2000);
               
          }

       
   
   
    })

})























})










