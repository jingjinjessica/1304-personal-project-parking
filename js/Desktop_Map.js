function createElement(tagName, attributes, content){
    elm = document.createElement(tagName);
    if(attributes){
        for(attr in attributes){
            elm.setAttribute(attr, attributes[attr]);
        }
    }
    if(content){
        elm.innerHTML = content;
    }
    return elm;
}

function createParkingDetail(detail){
    // https://www.w3schools.com/jsref/met_document_createelement.asp
    d1 = createElement("div", {class: "flex-row list-item"});
    d21 = createElement("div", {class: "flex-row group_1"});
    d22 = createElement("div", {class: "flex-col group_4"});
    d1.appendChild(d21);
    d1.appendChild(d22);

    d211 = createElement("div", {class: "flex-col items-center image-wrapper_1"});
    d212 = createElement("div", {class: "flex-col group_2"});
    d21.appendChild(d211);
    d21.appendChild(d212);

    let parkingImage = (detail.photos && detail.photos[0] && detail.photos[0].getUrl()) ?? "https://img.icons8.com/ios/100/000000/image.png";
    let availableSeats = Math.floor(Math.random() * 20) + 20;
    d221 = createElement("span", {class: "text_6"}, availableSeats);
    d222 = createElement("a", {class: "flex-col items-center text-wrapper", href:"Desktop_ParkingSpace.html?seats=" + availableSeats + "&place_id=" + detail.place_id });
    d22.appendChild(d221);
    d22.appendChild(d222);

    d2221 = createElement("span", {class: "text_8"}, "Booking");
    d222.appendChild(d2221);


    d2111 = createElement("img", {class: "image_2", src: parkingImage});
    d211.appendChild(d2111);

    d2121 = createElement("span", {class: "text"}, detail.name);
    d2122 = createElement("div", {class: "flex-row group_3"});
    d2123 = createElement("span", {class: "text_2"}, detail.vicinity);
    d2124 = createElement("span", {class: "text_4"}, "Rating: " + detail.rating);
    d212.appendChild(d2121);
    d212.appendChild(d2122);
    d212.appendChild(d2123);
    d212.appendChild(d2124);

    let rating = detail.rating;
    for(let i = 0; i < 5; i++){
        let ratingImage = "https://img.icons8.com/ios-glyphs/30/undefined/star--v1.png";
        if (rating > 0 && rating < 1){
            ratingImage = "https://img.icons8.com/ios-filled/50/undefined/star-half-empty.png";
        }
        else if( rating < 0){
            ratingImage = "https://img.icons8.com/windows/32/undefined/star--v1.png";
        }
        rating--;
        d2122.appendChild(createElement("img", {src: ratingImage, class: "image_" + (4 + i*2)}));
    }

    return d1;
}
//<img src="https://img.icons8.com/ios-glyphs/30/undefined/star--v1.png"/>

function initMap(){
    // https://developers.google.com/maps/documentation/javascript/examples/place-search

    const urlParams = new URLSearchParams(window.location.search);
    const infoWindow = new google.maps.InfoWindow();
    const parkingListElm = document.getElementById("parkingList");

    map = new google.maps.Map(document.getElementById("map"),{
        zoom: 14
    });
    service = new google.maps.places.PlacesService(map);

    service.findPlaceFromQuery(
        {
            query: urlParams.get("address"),
            fields: ["name", "geometry"]
        },
        (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                if(results.length > 0){
                    home = results[0];
                    createMarker(home);
                    homeLocation = home.geometry.location;
                    map.setCenter(homeLocation);
                    service.nearbySearch({
                        location: homeLocation,
                        radius: 5000,
                        type: "parking",
                        fields: ["name", "geometry", "adr_address", "photos", "place_id", "website", "formatted_phone_number", "rating"]
                    },
                        (parkingResult, parkingStatus) =>{
                            if (parkingStatus === google.maps.places.PlacesServiceStatus.OK && parkingResult) {
                                for (let i = 0; i < parkingResult.length && i < 6; i++) {
                                    pr = parkingResult[i];
                                    elm = createParkingDetail(pr);
                                    parkingListElm.appendChild(elm);
                                    createMarker(pr);
                                }
                            }
                        });
                }
            }
        }
    );

    function createMarker(place) {
        // google map create marker api
        if (!place.geometry || !place.geometry.location) return;

        const marker = new google.maps.Marker({
            map,
            position: place.geometry.location
        });

        google.maps.event.addListener(marker, "click", () => {
            infoWindow.close();
            infoWindow.setContent(place.name);
            infoWindow.open(map, marker);
        });
    }

}

