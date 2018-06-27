$(document).ready(function () {

    var bandName = "";
    var ticketAPI = "ITMP1WL5haYqT4ySnnZVTYi5HEV0QB3M";
    var zipCode = 23113; //user will input this and grab from page
    var searchKey = "";

    var zipCode = 23113; //user will input this and grab from page
    var zipURL = "http://maps.googleapis.com/maps/api/geocode/json?address=";
    var latLong = "";
    $.ajax({
        type:"GET", url: zipURL+zipCode}
    ).then(function(response) {
        console.log(response);
        console.log(response.results[0].geometry.location.lat + ","+ response.results[0].geometry.location.lng);
        latLong = (response.results[0].geometry.location.lat + ","+ response.results[0].geometry.location.lng);
     });

     //plug latLong variable into end of ticketmaster widget plugin under w-latlong

    $("#submit-button").on("click", function (event) {
        event.preventDefault();
        bandName = $("#search-item").val().trim();
        console.log(bandName);

        $("body").append('<div w-type="event-discovery" w-tmapikey="ITMP1WL5haYqT4ySnnZVTYi5HEV0QB3M" w-googleapikey="AIzaSyDLaes9_vXmELG_d5SGPPGNelBrWiHIkLM" w-keyword="'+bandName+'" w-theme="listviewthumbnails" w-colorscheme="light" w-width="300" w-height="600" w-size="25" w-border="2" w-borderradius="4" w-postalcode="" w-radius="100" w-period="month" w-layout="vertical" w-attractionid="" w-promoterid="" w-venueid="" w-affiliateid="" w-segmentid="" w-proportion="xxl" w-titlelink="off" w-sorting="groupByName" w-id="id_msj025" w-source="" w-latlong="37.5462865,-77.4089139"></div>');
        $("body").append('<script src="https://ticketmaster-api-staging.github.io/products-and-docs/widgets/event-discovery/1.0.0/lib/main-widget.js"></script>');

    });




});