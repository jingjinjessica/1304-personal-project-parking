function serach(){
    window.location.href = 'Deskop_comf.html';
}
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


function randomSeats(num){
    num = 48 - num;
    result = [];
    for(let row = 0; row < 8; row++){
        result[row] = [0,0,0,0,0,0];
    }
    while(num > 0){
        row = Math.floor(Math.random()*8);
        col = Math.floor(Math.random()*6);
        if(result[row][col] === 0){
            result[row][col] = 1;
            num--;
        }
    }

    row = Math.floor(Math.random()*6) + 2;
    col = Math.floor(Math.random()*5);
    while(result[row][col] !== 0){
        row = Math.floor(Math.random()*6) + 2;
        col = Math.floor(Math.random()*5);
    }
    result[row][col] = 2;

    return result;
}
function init(){
    const urlParams = new URLSearchParams(window.location.href.split("?")[1]);
    containerElm = document.getElementById("container");
    seats = randomSeats(parseInt(urlParams.get("seats")));
    let sectionNo = 12;
    for(let row = 0; row < 8; row++){
        for(let col = 0; col < 6; col++){
            containerElm.appendChild(createElement("div", {class: "s_" + seats[row][col]}));
        }
    }

    // update form action
    formElm = document.getElementById("payment");
    formElm.appendChild(createElement("input", {name: "place_id", type:"hidden", value: urlParams.get("place_id")}));


}