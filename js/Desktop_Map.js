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
    d1 = createElement("div", {class: "flex-row list-item"});
    d21 = createElement("div", {class: "flex-row group_1"});
    d22 = createElement("div", {class: "flex-col group_4"});
    d1.appendChild(d21);
    d1.appendChild(d22);

    d211 = createElement("div", {class: "flex-col items-center image-wrapper_1"});
    d212 = createElement("div", {class: "flex-col group_2"});
    d21.appendChild(d211);
    d21.appendChild(d212);

    let availableSeats = Math.floor(Math.random() * 20) + 20;
    d221 = createElement("span", {class: "text_6"}, availableSeats);
    d222 = createElement("a", {class: "flex-col items-center text-wrapper", href:"Desktop_ParkingSpace.html?seats=" + availableSeats});
    d22.appendChild(d221);
    d22.appendChild(d222);

    d2221 = createElement("span", {class: "text_8"}, "Booking");
    d222.appendChild(d2221);


    d2111 = createElement("img", {class: "image_2", src: (detail.photos && detail.photos[0] && detail.photos[0].getUrl()) ?? "https://img.icons8.com/ios/100/000000/image.png"});
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
        let ratingImage = "https://codefun-proj-user-res-1256085488.cos.ap-guangzhou.myqcloud.com/629161a95a7e3f03109f3905/629161c8620d6f0011232057/16537729137306546010.png";
        if (rating > 0 && rating < 1){
            ratingImage = "https://codefun-proj-user-res-1256085488.cos.ap-guangzhou.myqcloud.com/629161a95a7e3f03109f3905/629161c8620d6f0011232057/16537729137305681172.png";
        }
        else if( rating < 0){
            ratingImage = "https://codefun-proj-user-res-1256085488.cos.ap-guangzhou.myqcloud.com/629161a95a7e3f03109f3905/629161c8620d6f0011232057/16537729137300163506.png";
        }
        rating--;
        d2122.appendChild(createElement("img", {src: ratingImage, class: "image_" + (4 + i*2)}));
    }

    return d1;
}

function initMap(){
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

