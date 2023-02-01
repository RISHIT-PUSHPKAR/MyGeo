"use strict"

const changeMapType = document.querySelector('.map-type');
const totalDistanceValue = document.querySelector('.total-distance');

// Extracting Location Using Geolocation API(Browser)
if (navigator.geolocation){
    navigator.geolocation.getCurrentPosition((position)=>{
    const {latitude} = position.coords;
    const {longitude} = position.coords;
    console.log(latitude,longitude)

// Using ArcGIS Map SDK require function is defined
    require([ "esri/config",
              "esri/Map",
              "esri/views/SceneView",
              "esri/widgets/Search",
              "esri/Graphic",
              "esri/rest/route",
              "esri/rest/support/RouteParameters",
              "esri/rest/support/FeatureSet"],
               
              function(esriConfig, Map, SceneView,Search,Graphic, route, RouteParameters, FeatureSet) {

    esriConfig.apiKey = "AAPK3fd9a53c5d4f4ac5aa3a404819407f29X7dOIcjeRQrBFgMmB18AHqlQFqSRbceft-tfM1HnWjh6P4kI-n5N7i_RgGTgfGLW";
    

    const map = new Map({
        basemap: 'arcgis-navigation',
        ground:"world-elevation"
      });
      
      const view = new SceneView({
        map: map,
        container: "viewDiv", // Div element
        camera:{
          position:{
            x: longitude,
            y:latitude,
            z:2000
          },
          tilt:45
        }
      });

      const search = new Search({
        view:view,
        container:"searchBar"
      })

      view.ui.add(search,'top-right');
    


    const routeUrl = "https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World";

    view.on('click',function(event){

      if (view.graphics.length === 0) {
        addGraphic("origin", event.mapPoint);
      } else if (view.graphics.length === 1) {
        addGraphic("destination", event.mapPoint);

        getRoute();

      } else {
        view.graphics.removeAll();
        addGraphic("origin",event.mapPoint);
      }

    });

    function addGraphic(type, point) {
      const graphic = new Graphic({
        symbol: {
          type: "simple-marker",
          color: (type === "origin") ? "white" : "black",
          size: "8px"
        },
        geometry: point
      });
      view.graphics.add(graphic);
    }

    function getRoute() {
      const routeParams = new RouteParameters({
        stops: new FeatureSet({
          features: view.graphics.toArray()
        }),
        returnDirections: true

      });
      
      route.solve(routeUrl, routeParams)
      .then(function(data) {
        data.routeResults.forEach(function(result) {
          result.route.symbol = {
            type: "simple-line",
            color: [5, 150, 255],
            width: 3
          };
          view.graphics.add(result.route);
        });
        
      
      if (data.routeResults.length > 0) {
        const directions = document.createElement("ol");
        directions.classList = "esri-widget esri-widget--panel esri-directions__scroller";
        directions.style.marginTop = "0";
        directions.style.padding = "15px 15px 15px 30px";
        const features = data.routeResults[0].directions.features;
        
        let totalDistance = 0;
        features.forEach(function(result,i){
          const direction = document.createElement("li");
          direction.innerHTML = result.attributes.text + " (" + result.attributes.length.toFixed(2) + " miles)";
          totalDistance+=(result.attributes.length*1.6);
          console.log(typeof result.attributes.length);
          directions.appendChild(direction);
        });
        console.log(totalDistance)
        totalDistanceValue.textContent = `${totalDistance.toFixed(2)} Km`
        
        view.ui.empty("bottom-right");
        view.ui.add(directions, "bottom-right");
        
    }    
  })
  .catch(function(error){
    console.log(error);
  })
  
}
});
  
});

}else{
  alert('Could not fetch your location!!!')
}






