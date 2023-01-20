"use strict"

const addStop = document.querySelector('.add-stop-btn');
const calcBtn = document.querySelector('.calc-btn');




if (navigator.geolocation){
    navigator.geolocation.getCurrentPosition(function(position){
        const {latitude} = position.coords;
        const {longitude} = position.coords;
        
        const coords = [latitude,longitude];

        const map = L.map('map').setView(coords, 13);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        let geocodeService = L.esri.Geocoding.geocodeService();

        map.on('click',function(e){
            console.log(e)
            const {lat,lng} = e.latlng;
           
            L.marker([lat,lng]).addTo(map)
            .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
            .openPopup();

            geocodeService.reverse().latlng(e.latlng).run(function(error, result) {
            L.marker(result.latlng).addTo(map).bindPopup(result.address.Match_addr).openPopup();
              });
        })

        let message;

        message = geocodeService.reverse().latlng([40.725, -73.985]).run(function(error, result) {
        //alert(result.address.Match_addr); //this alert works here ok and can retur addrress
        return result.address.Match_addr;
        });

        //this alert won't work, why I can get the address here outside the function
        alert(message); 
                

    },
    function(){
        alert('could not get your position')
    })
}

