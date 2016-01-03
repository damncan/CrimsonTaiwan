function createAssociativeArray(arr1, arr2) { // combine two arrays
  var arr = {};
  for(var i = 0, ii = arr1.length; i<ii; i++) {
    arr[arr1[i]] = arr2[i];
  }
  return arr;
}

function generateGraph(target, columnName, cb){ // 生成繪圖物件、繪製縣市邊界
  var a = data.鄉鎮市區,
      b = data[columnName],
      min = Math.min.apply(null, b),
      max = Math.max.apply(null, b);
      density = createAssociativeArray(a, b);

  var features = topojson.feature(topodata, topodata.objects["Town_MOI_1041005"]).features;
  var fisheye = d3.fisheye.circular().radius(100).distortion(2);
  var prj = function(v) {
    var ret = d3.geo.mercator().center([122,23.25]).scale(6000)(v);
    var ret = fisheye({x:ret[0],y:ret[1]});
    return [ret.x, ret.y];
  };
  var path = d3.geo.path().projection(prj);

  // 繪製縣市邊界
  for(idx=features.length - 1;idx>=0;idx--) features[idx].density = density[features[idx].properties.C_Name+features[idx].properties.T_Name];
  d3.select("#"+target).selectAll("path").data(features).enter().append("path");

  // 著色
  update(target,path,min,max);

  cb(path,min,max);
}

function update(target,path,min,max) { // 著色
  var color = d3.scale.linear().domain([min,max]).range(["#090","#f00"]);
  d3.select("#"+target).selectAll("path").attr({
    "d": path,
    "fill": function (d) { return color(d.density); }
  }).on("mouseover", function(d) {
    $("#"+target+"name").text( " "+d.properties.C_Name+d.properties.T_Name );
    $("#"+target+"density").text(d.density);
    if(typeof(d.density) == 'undefined'){
      $("#"+target+"density").text("無資料");
    }
  });
}

$(document).ready(function(){
  // CSV 轉 JSON: http://shancarter.github.io/mr-data-converter/
  d3.json("/data.json", function(json) {
    data = json; // 統計資料

    d3.json("/town/town.json", function(result) {
      topodata = result; // 地理資料

      generateGraph("graph1", "犯罪率", function(path,min,max){
        d3.select("#graph1").on("mousemove", function() {
          //fisheye.focus(d3.mouse(this));
          update("graph1",path,min,max);
        });
      });
      generateGraph("graph2", "犯罪率", function(path,min,max){
        d3.select("#graph2").on("mousemove", function() {
          //fisheye.focus(d3.mouse(this));
          update("graph2",path,min,max);
        });
      });
    });
  });

  $(".switchView").click(function(e){
    e.preventDefault();
    $("#startDropdown1").html($(this).text()+' <span class="caret"></span>');
    generateGraph("graph1", $(this).text(), function(path,min,max){
      d3.select("#graph1").on("mousemove", function() {
        //fisheye.focus(d3.mouse(this));
        update("graph1",path,min,max);
      });
    });
  });
  $(".switchView2").click(function(e){
    e.preventDefault();
    $("#startDropdown2").html($(this).text()+' <span class="caret"></span>');
    generateGraph("graph2", $(this).text(), function(path,min,max){
      d3.select("#graph2").on("mousemove", function() {
        //fisheye.focus(d3.mouse(this));
        update("graph2",path,min,max);
      });
    });
  });
});
