function menuHover(elem){
    elem.style.backgroundColor = "rgb(136,23,152)";
}
function menuOut(elem){
    elem.style.backgroundColor = "rgba(255,255,255,0)";
}
function menuClick(id){
    location.href = id + ".html";
}
function play(audio,album,src){
    var elem = document.getElementById(audio);
    var al = document.getElementById(album);
    if(elem.paused){
        elem.play();
        al.src = src + ".gif";
    }else{
        elem.pause();
        al.src = src + ".jpg";
    }
}
//var map, view, layer, layer2, pointLayer;
require(["esri/Map", 
         "esri/views/MapView", 
         "esri/layers/GeoJSONLayer",
         "esri/Graphic",
         "esri/layers/GraphicsLayer"
        ], function (Map, MapView, GeoJSONLayer, Graphic, GraphicsLayer) {
  var map = new Map({
    basemap: "dark-gray-vector"
  });

  var view = new MapView({
    container: "mapHolder",
    map: map,
    center: [-78.7, 42.8], // longitude, latitude
    zoom: 9
  });
  //walkability
  var layer = new GeoJSONLayer({
    url: "./data/data.geojson",
    visible: false,
    renderer: renderWalkLayer()
  });
  map.add(layer);
  //centrods
  var pointLayer = new GeoJSONLayer();
  //cluster layer
  var graphicsLayer = new GraphicsLayer();
  map.add(graphicsLayer);

  //add listener
  var check1 = document.getElementById("check1");
  check1.addEventListener("click", check1Click);      //can't add arguments to eventfuntion
  var check2 = document.getElementById("check2");
  check2.addEventListener("click", check2Click);
  document.getElementById("myRange").addEventListener("input", updateWalk);
  document.getElementById("myRangeK").addEventListener("input", updateK);
  document.getElementById("btnCluster").addEventListener("click", identifyCluster);

  function renderWalkLayer(){
    const less98 = {
      type: "simple-fill", // autocasts as new SimpleFillSymbol()
      color: "rgba(255,255,128,1)",
      style: "solid",
      outline: {
        width: 0.2,
        color: [110,110,110,1]
      }
    };
    const less13 = {
      type: "simple-fill", // autocasts as new SimpleFillSymbol()
      color: "rgba(56,224,9,1)",
      style: "solid",
      outline: {
        width: 0.2,
        color: [110,110,110,1]
      }
    };
    const less15 = {
      type: "simple-fill", // autocasts as new SimpleFillSymbol()
      color: "rgba(26,147,171,1)",
      style: "solid",
      outline: {
        width: 0.2,
        color: [110,110,110,1]
      }
    };
    const more15 = {
      type: "simple-fill", // autocasts as new SimpleFillSymbol()
      color: "rgba(12,16,120,1)",
      style: "solid",
      outline: {
        width: 0.2,
        color: [110,110,110,1]
      }
    };
    const renderer = {
      type: "class-breaks", // autocasts as new ClassBreaksRenderer()
      field: "NatWalkInd",
      defaultSymbol: {
        type: "simple-fill", // autocasts as new SimpleFillSymbol()
        color: "black",
        style: "solid",
        outline: {
          width: 0.2,
          color: [110,110,110,1]
        }
      },
      defaultLabel: "no data",
      classBreakInfos: [
        {
          minValue: 0,
          maxValue: 9.8329,
          symbol: less98
        },
        {
          minValue: 9.8331,
          maxValue: 12.9999,
          symbol: less13
        },
        {
          minValue: 13,
          maxValue: 14.8329,
          symbol: less15
        },
        {
          minValue: 15,
          maxValue: 100,
          symbol: more15
        }
      ]
    };
    return renderer;
  /*	var info;
    map.data.addListener('mouseover', function(event){
      info = new google.maps.InfoWindow({
      content : "<table><tr><td>GEOID</td><td>" +  event.feature.getProperty("GEOID10")
      + "</td></tr><tr><td>Walkability</td><td>" + event.feature.getProperty("NatWalkInd")
      + "</td></tr></table>",
      position: event.latLng
        });
      info.open(map);
    });	
    map.data.addListener('mouseout',function(event){
      info.close();
    });*/
  }
  
  function addWalkPoints(){
    if(map.findLayerById(pointLayer.id)){
      map.remove(pointLayer);
    }
    pointLayer = new GeoJSONLayer();
    pointLayer.url = "./data/point.geojson";
    pointLayer.renderer = {
      type: "simple",
      symbol: {
        type: "simple-marker",
        size: 1.8,//1.2,
        color:  [206,166,243,1],
        outline: {
          width: 1.5,
          color:[206,166,243,1]
        }
      }
    };
    map.add(pointLayer);
  }

  function check1Click(){
    check("check1","div_legend");
  }
  function check2Click(){
    check("check2","div_cluster");
  }
  function check(check, div){
      var checkBox = document.getElementById(check);
      var legend = document.getElementById(div);
      if(checkBox.checked){
        legend.style.display = "block";
        if(check == "check1"){
			    document.getElementById("check2").checked = false;
          document.getElementById("div_cluster").style.display = "none";
          pointLayer.visible = false;
          graphicsLayer.removeAll();
          //show distribution
          layer.visible = true;
        }else{
            document.getElementById("check1").checked = false;
            document.getElementById("div_legend").style.display = "none";
            layer.visible = false;
            //initalization
            document.getElementById("myRange").value = 1;
            document.getElementById("myRangeK").value = 1;
            addWalkPoints();
            graphicsLayer.removeAll();
        }
      }else{
        legend.style.display = "none";
        layer.visible = false;
        pointLayer.visible = false;
        graphicsLayer.removeAll();
      }
  }

  function updateWalk(){
      var slider = document.getElementById("myRange");
      var show = document.getElementById("threshold");
      show.innerHTML = slider.value;
      //update map
      const invisibleSym = {
        type: "simple-marker",
          size: 1.2,
          color:  [206,166,243,0],
          outline: {
            width: 1,
            color:[206,166,243,0]
          }
      };
      const sym = {
        type: "simple-marker",
        size: 1.2,
        color:  [206,166,243,1],
        outline: {
          width: 1,
          color:[206,166,243,1]
        }
      }
      pointLayer.renderer = {
        type: "class-breaks",
        field: "NatWalkInd",
        classBreakInfos: [
          {
            minValue: 0,
            maxValue: Number(slider.value),
            symbol: invisibleSym
          },
          {
            minValue: Number(slider.value) + 0.000001,
            maxValue: 20,
            symbol: sym
          }
        ]
      };
      /*const query = pointLayer.createQuery();
      query.where = "NatWalkInd < " + slider.value;
      var deleteFeature;
      pointLayer.queryObjectIds(query).then(function(ids){
        ids.forEach(function(id){
          //console.log(id);
          deleteFeature = {
            objectId: id
          };
          pointLayer.applyEdits({
            deleteFeatures: [deleteFeature]
        });
        });
      });*/
  }

  function updateK(){
      var slider = document.getElementById("myRangeK");
      var show = document.getElementById("K");
      show.innerHTML = slider.value;
  }

  function identifyCluster(){
      var k = document.getElementById("myRangeK").value;
      //
      var points = [];
      var slider = document.getElementById("myRange");
      const query = pointLayer.createQuery();
      query.where = "NatWalkInd > " + slider.value;
      pointLayer.queryFeatures(query).then(function(results){
        results.features.forEach(function(fea){
          var geom = fea.geometry;//getGeometry().get();
          points.push([geom.longitude, geom.latitude]);
        });
        var clusters = kmeans(points,k,100);
        //show clusters
        graphicsLayer.removeAll();
        for(var i=0; i<k; i++){
            drawCluster(clusters[i]);
        }
      });
  }
  function drawCluster(points){
      //find center
      var center = new Array(2);
      for(var i=0; i<2; i++){
          var sum = 0;
          for(var j=0; j<points.length; j++){
              sum+=points[j][i];
          }
          center[i]=sum/points.length;
      }
      var idx = closestCentroid(center,points);
      center = [points[idx][0], points[idx][1]];
      for(var i = 0; i < points.length; i++){
          var end = [points[i][0], points[i][1]];
          var line = {
            type: "polyline",
            paths: [center, end]
          };
          var graphicLine = {
            geometry: line,
            symbol: {
              type: "simple-line",
              color: [206,166,243],
              width: 0.5
            }
          };
          graphicsLayer.add(graphicLine);
      }
  }
});

