$(document).ready(function () {

    var bandName = "";
    var ticketAPI = "ITMP1WL5haYqT4ySnnZVTYi5HEV0QB3M";
    var zipCode = 23113; //user will input this and grab from page


    $("#submit-button").on("click", function (event) {
        event.preventDefault();
        bandName = $("#search-item").val().trim();
        console.log(bandName);

        $.ajax({
            type: "GET",
            url: "https://app.ticketmaster.com/discovery/v1/events.json?apikey=" + ticketAPI + "&keyword=" + bandName,
            dataType: "json",
            success: function (response) {
                console.log(response);
                // Parse the response.
                // Do other things.
            }
            // error: function (xhr, status, err) {
            //     // This time, we do not end up here!
            // }
        });
    });

 


});