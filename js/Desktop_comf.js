function initMap(){
    const urlParams = new URLSearchParams(window.location.search);

    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 14
    });
    service = new google.maps.places.PlacesService(map);
    // https://developers.google.com/maps/documentation/javascript/examples/place-details
    service.getDetails(
        {
            placeId: urlParams.get("place_id"),
            fields: ["name", "formatted_address", "photos"]
        },
        (result, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && result) {
                document.getElementById("name").innerText = result.name;
                document.getElementById("address").innerText = result.formatted_address;
                document.getElementById("price").innerText = Math.floor(Math.random()*5) + 5;
                document.getElementById("parkingImg").setAttribute("src", (result.photos && result.photos[0] && result.photos[0].getUrl()) ?? "https://img.icons8.com/ios/100/000000/image.png");
            }});

}