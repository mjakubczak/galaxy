var Diagram = function(width, height, form_config_file, style_root){
  
  // DOM elements
  var svg = null;
  var background = null;
  var settingsDiv = null;
  var settingsDivCloseBtn = null;
  
  // Diagram state
  var diagramElements = { nodes:{}, connections:[], params:{} };
  
  // Form parser
  var formParser = new FormParser(form_config_file);
  
  // Control variables
  var Mode = {SELECT:0, DRAG:1};
  var currentMode = Mode.DRAG;
  var activeArrow = null;
  var activeNode = null;
  var nextIds = [];
  
  function generateId(prefix) {
    if(nextIds[prefix] == undefined) {
      nextIds[prefix] = 0;
    } else {
      nextIds[prefix]++;
    }
    return prefix + "-" + nextIds[prefix];
  }
  
  function init() { 
    svg = d3.select("body").select("#svgDiagramWrapper")
      .append("svg")
       .attr("class","dynamicDiagram")
       .attr("width", width)
       .attr("height", height);
    
    var defs = svg.append("defs");
    var xAxes = d3.range(0, width, 25);
    var yAxes = d3.range(0, height, 25);
  
    settingsDiv = d3
      .select("body")
      .select("#diagramSettings");
    
    settingsDivCloseBtn = d3
      .select("body")
      .select("#closeSettingsBtn")
      .on("click", function(e) { settingsDiv.style("display","none"); });
    
   svg.selectAll(".line")
      .data(xAxes)
      .enter()
      .append("line")
      .attr("x1", function(d) { return d; })
      .attr("y1", 0)
      .attr("x2", function(d) { return d; })
      .attr("y2", width)
      .attr("stroke","#eee")
      .attr("stroke-width",1)
      .on("click", clickBackground);
      
    svg.selectAll(".line2")
      .data(yAxes)
      .enter()
      .append("line")
      .attr("x1", 0)
      .attr("y1", function(d) { return d; })
      .attr("x2", width)
      .attr("y2", function(d) { return d; })
      .attr("stroke","#eee")
      .attr("stroke-width",1)
      .on("click", clickBackground);
      
    defs.append("svg:marker")
      .attr("id", "triangle")
      .attr("refX", 3)
      .attr("refY", 2)
      .attr("markerWidth", 30)
      .attr("markerHeight", 20)
      .attr("orient", "auto")
      .append("path")
        .attr("d", "M 0 0 4 2 0 4 1 2");
    
    background = svg
      .append("rect")
      .classed("background", true)
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "white")
      .style("opacity","0")
      .on("click", clickBackground);
  }
  
  function setModeDrag() {
    console.log("set mode: DRAG");
    currentMode = Mode.DRAG;
    d3.selectAll(".block")
      .style("cursor", "move");
    d3.selectAll(".blockHandle")
      .classed("hidden", true);
    d3.selectAll(".deleteBtn")
      .classed("active", false);
    d3.selectAll(".diagramBtn.modeBtn")
      .classed("active", false);
    d3.selectAll("#setModeDragBtn")
      .classed("active", true);
  }
  
  function setModeSelect() {
    console.log("set mode: SELECT");
    currentMode = Mode.SELECT;
    d3.selectAll(".block")
      .style("cursor", "default");
    d3.selectAll(".blockHandle")
      .classed("hidden", false);
    d3.selectAll(".deleteBtn")
      .classed("active", true);
    d3.selectAll(".diagramBtn.modeBtn")
      .classed("active", false);
    d3.selectAll("#setModeSelectBtn")
      .classed("active", true);
  }
  
  function createBlock(x, y, title, shortName) {
    var id = generateId(shortName);
    addNewBlock(id, x, y, title);
  }
  
  function addNewBlock(id, x, y, title) {
    
    var d = [{id:id, initX:x, initY:y, x:x, y:y, title:title}];
    var size = 70;
    
    diagramElements.nodes[id] = {x:x, y:y};
    
    var g = svg.append("g")
      .classed("block", true)
      .classed("draggable", true)
      .classed("block" + capitalizeFirstLetter(title), true)
      .attr("id", id)
      .data(d)
      .attr("x", function (d) { return d.x; })
      .attr("y", function (d) { return d.y; })
      .attr("transform", "translate(0,0)")
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));
    
    g.append("rect")
      .data(d)
      .attr("x", function(d) { return d.x; })
      .attr("y", function(d) { return d.y; })
      .attr("class", "blockElem")
      .attr("width", size)
      .attr("height", size)
      .attr("rx", 4)
      .attr("ry", 4);
    
    var nameLabel = g.append("text")
      .attr("x", function(d) { return d.x + size/2; })
      .attr("y", function(d) { return d.y + size/2 - 15; })
      .attr("class", "blockName")
      .attr("text-anchor", "middle")
      .text(id);
    
    g.append("text")
      .attr("x", function(d) { return d.x + size/2; })
      .attr("y", function(d) { return d.y + size/2 + 5; })
      .attr("class", "blockLabel")
      .attr("text-anchor", "middle")
      .text(function(d) { return d.title; });
    
    g.append("svg:image")
     .attr('x', function(d) { return d.x + 5; })
     .attr('y', function(d) { return d.y + size - 20; })
     .attr('width', 15)
     .attr('height', 15)
     .attr("class", "deleteBtn")
     .attr("xlink:href", style_root + "/delete-icon.png")
     .on("click", function() { removeBlock(g); });
    
    g.append("svg:image")
     .attr('x', function(d) { return d.x + size - 22; })
     .attr('y', function(d) { return d.y + size - 20; })
     .attr('width', 15)
     .attr('height', 15)
     .attr("class", "deleteBtn")
     .attr("xlink:href",style_root + "/edit-icon.png")
     .on("click", function() { editBlockParams(id, nameLabel, title); });
    
    drawBlockHandle(id, g, d, {x:0, y:size/2});
    drawBlockHandle(id, g, d, {x:size, y:size/2});
    drawBlockHandle(id, g, d, {x:size/2, y:0});
    drawBlockHandle(id, g, d, {x:size/2, y:size});
    
    setDefaultParamsForBlock(title, id);
    setModeDrag();
  }
  
  function setDefaultParamsForBlock(name, id) {
    var form = formParser.getForm(name);
    $("#diagramSettingsWrapper").html(form);
    var json = formParser.formToJSON();
    var settings = JSON.parse(json);
    diagramElements.params[id] = settings;
    diagramElements.params[id].name = id;
  }
  
  function editBlockParams(id, nameLabel, name) {
    var params = diagramElements.params[id];
    var form = formParser.getForm(name, params);
  	$("#diagramSettingsWrapper").html(form);
    setParamsForm(id, nameLabel);
    formParser.setBehavior();
    settingsDiv.style("display","block");
  }
  
  function setParamsForm(id, nameLabel) {
    formParser.setValues(diagramElements.params[id]);
        
    // ok button
    var btnDiagramSettingsOK = d3.select("body").select("#btnDiagramSettingsOK");
    btnDiagramSettingsOK.on("click", function() {
      
      // get settings JSON
      var json = formParser.formToJSON();
      var settings = JSON.parse(json);
      nameLabel.text(settings.name);
      diagramElements.params[id] = settings;
      
      // hide form
      settingsDiv.style("display", "none");
    });
  }
  
  function removeBlock(g) {
    console.log("delete btn");
    var id = g.attr("id");
    g.remove();
    var connections = diagramElements.connections;
    
    for(var i=0; i<connections.length; i++) {
      if(connections[i].in == id || connections[i].out == id) {
        var arrow = d3.select("#" + connections[i].arrow.id);
        if(arrow != null) {
          arrow.remove();
        }
      }
    }
    
    var arrowsToRemove = diagramElements.connections.filter(function(conn) { return conn.in == id || conn.out == id; } );
    diagramElements.nodes[id] = undefined;
    diagramElements.params[id] = undefined;
    diagramElements.connections = diagramElements.connections.filter(function(conn) { return conn.in != id && conn.out != id; } );
  }
  
  function drawBlockHandle(id, g, d, coords) {
    g.append("circle")
      .attr("class", "blockHandle")
      .attr("cx", function(d) { return d.x + coords.x; })
      .attr("cy", function(d) { return d.y + coords.y; })
      .attr("r", 5)
      .classed("hidden", true)
      .on("click", function() {onClickBlockHandle(id, g, coords);});
  }
  
  function onClickBlockHandle(id, g, coords) {
    if(activeNode == null) {
      initActiveArrow(id, g, coords);
    } else {
      setNewConnection(id, g, coords);        
    }
  }
  
  function initActiveArrow(id, g, coords) {
    console.log("initActiveArrow");
    if(isOutput(id)) {
      console.log("initActiveArrow: cancel for output");
      return;
    }
    var x1 = parseInt(g.attr("x")) + coords.x;
    var y1 = parseInt(g.attr("y")) + coords.y;
    var x2 = x1;
    var y2 = y1;
    activeNode = g;
    d3.selectAll(".deleteBtn")
      .classed("active", false);
    svg.on("mousemove", function(d) {
      console.log("initActiveArrow: mousemove");
      var mouseCoords = d3.mouse(this);
      if(activeArrow != null) {
        activeArrow.remove();
      }
      x2 = (mouseCoords[0] > x1) ? (mouseCoords[0] - 2) : (mouseCoords[0] + 2);
      y2 = (mouseCoords[1] > y1) ? (mouseCoords[1] - 2) : (mouseCoords[1] + 2);  
      activeArrow = drawArrow(x1, y1, x2, y2);
    });
  }
  
  function setNewConnection(id, g, coords) {
    console.log("setNewConnection");
    if(isInput(id)) {
      console.log("setNewConnection: cancel for input");
      return;
    }
    if(g != activeNode) {
      var nodeStart = activeNode.attr("id");
      var nodeEnd = g.attr("id");
      if(!connectionExists(nodeStart, nodeEnd)) {
        var x1 = activeArrow.attr("x1");
        var y1 = activeArrow.attr("y1");
        var x2 = parseInt(g.attr("x")) + coords.x;
        var y2 = parseInt(g.attr("y")) + coords.y;
        var arrowId = generateId("arrow");
        activeNode = null;
        svg.on("mousemove", null);
        activeArrow.remove();
        activeArrow = null;
        var newArrow = drawArrow(x1, y1, x2, y2);
        newArrow.attr("id", arrowId);
        var arrowInfo = { id:arrowId, x1:parseInt(x1), y1:parseInt(y1), x2:parseInt(x2), y2:parseInt(y2) };
        var info = { in:nodeStart, out:nodeEnd, arrow:arrowInfo };
        diagramElements.connections.push(info);
        d3.selectAll(".deleteBtn").classed("active", true);
        return;
      }
    }
    cancelNewConnection();
  }
  
  function isInput(id) {
    return diagramElements.params[id].type == 'input';
  }
  
  function isOutput(id) {
    return diagramElements.params[id].type == 'output';
  }
  
  function cancelNewConnection() {
    if(activeArrow != null) {
      svg.on("mousemove", null);
      activeArrow.remove();
      activeArrow = null;
    }
    if(activeNode != null) {
      activeNode = null;
    }
    d3.selectAll(".deleteBtn")
      .classed("active", true);
  }
  
  function connectionExists(nodeStart, nodeEnd) {
    var conn = diagramElements.connections;
    for(var i = 0; i < conn.length; i++) {
      if( (conn[i].in == nodeStart && conn[i].out == nodeEnd) || (conn[i].out == nodeStart && conn[i].in == nodeEnd) ) {
        return true;
      }
    }
    return false;
  }
  
  function clickBackground() {
    if(currentMode == Mode.SELECT ) {
      cancelNewConnection();
    }
  }
  
  function drawArrow(x1, y1, x2, y2) {
    console.log("draw arrow");
    var size = 16;
    var g = svg.append("g")
      .classed("arrow", true)
      .attr("x1", x1)
      .attr("y1", y1)
      .attr("x2", x2)
      .attr("y2", y2);
    
    g.append("line")
      .attr("x1", x1)
      .attr("y1", y1)
      .attr("x2", x2)
      .attr("y2", y2)
      .attr("class", "arrowLine")
      .attr("marker-end", "url(#triangle)");
      
      g.append("svg:image")
      .attr('x', parseInt(x1) + Math.round((x2-x1)/2) - size/2)
      .attr('y', parseInt(y1) + Math.round((y2-y1)/2) - size/2)
      .attr('width', size)
      .attr('height', size)
      .attr("class", "deleteBtn")
      .classed("active", true)
      .attr("xlink:href", style_root + "/delete-icon.png")
      .on("click", function() { removeArrow(g); });
      
      return g;
  }
  
  function removeArrow(g) {
    var id = g.attr("id");
    console.log("id=" + id);
    console.log("1. conn=" + JSON.stringify(diagramElements.connections));
    if(id != null) {
      diagramElements.connections = diagramElements.connections.filter(function(conn) { return conn.arrow.id != id; } );
    }
    console.log("2. conn=" + JSON.stringify(diagramElements.connections));
    g.remove();
  }
  
  function dragstarted(d) {
    if(currentMode == Mode.DRAG) d3.select(this).raise().classed("active", true);
  }

  function dragged(d) {
    if(currentMode == Mode.DRAG) {
      var dx = d3.event.dx;
      var dy = d3.event.dy;
      d.x += dx;
      d.y += dy;
      var block = d3.select(this);
      block.attr("x", d.x);
      block.attr("y", d.y);
      block.attr("transform", "translate(" + (d.x - d.initX) + "," + (d.y - d.initY) + ")");
      dragArrows(block, dx, dy);
      diagramElements.nodes[d.id].x = parseInt(block.attr("x"));
      diagramElements.nodes[d.id].y = parseInt(block.attr("y"));
    }
  }

  function dragended(d) {
    if(currentMode == Mode.DRAG) d3.select(this).classed("active", false);
  }
  
  function dragArrows(block, dx, dy) {
    var id = block.attr("id");
    var conn = diagramElements.connections;
    var i;
    for(i = 0; i < conn.length; i++) {
      if(conn[i].in == id) {
        dragArrowIn(conn[i].arrow, dx, dy);
      } else if(conn[i].out == id) {
        dragArrowOut(conn[i].arrow, dx, dy);
      }
    }
  }
  
  function dragArrowIn(arrowInfo, dx, dy) {
    var arrowId = arrowInfo.id;
    var arrow = d3.select("#" + arrowId);
    var x1 = parseInt(arrow.attr("x1")) + dx;
    var y1 = parseInt(arrow.attr("y1")) + dy;
    var x2 = arrow.attr("x2");
    var y2 = arrow.attr("y2");
    arrow.remove();
    arrow = drawArrow(x1,y1,x2,y2);
    arrow.attr("id", arrowId);
    
    arrowInfo.x1 = x1;
    arrowInfo.y1 = y1;
  }
  
  function dragArrowOut(arrowInfo, dx, dy) {
    var arrowId = arrowInfo.id;
    var arrow = d3.select("#" + arrowId);
    var x1 = arrow.attr("x1");
    var y1 = arrow.attr("y1");
    var x2 = parseInt(arrow.attr("x2")) + dx;
    var y2 = parseInt(arrow.attr("y2")) + dy;
    arrow.remove();
    arrow = drawArrow(x1,y1,x2,y2);
    arrow.attr("id", arrowId);
    
    arrowInfo.x2 = x2;
    arrowInfo.y2 = y2;
  }
  
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  
  function getJSON() {
    return JSON.stringify(diagramElements);
  }
  
  function loadJSON(json) {
    try {
      var diagramElems = JSON.parse(json);
      console.log("JSON loaded.");
      doLoadJSON(diagramElems);
    } catch(e) {
      alert("Cannot load JSON: " + e);
    }
  }
  
  function doLoadJSON(diagramElems) {
    svg.remove();
    init();
    
    // load blocks
    for (var key in diagramElems.nodes) {
      var node = diagramElems.nodes[key];
      var blockType = diagramElems.params[key].type;
      addNewBlock(key, node.x, node.y, blockType);
    }
    
    // load connections
    for (var i in diagramElems.connections) {
      var arrowInfo = diagramElems.connections[i].arrow;
      var arrow = drawArrow(arrowInfo.x1, arrowInfo.y1, arrowInfo.x2, arrowInfo.y2);
      arrow.attr("id", arrowInfo.id);
    }
    
    // load parameters
    diagramElements = diagramElems;
    
    // set id generator
    nextIds = [];
    for (var key in diagramElems.nodes) {
      var keyElems = key.split("-");
      var prefix = keyElems[0];
      var id = keyElems[1];
      console.log('HERE: ' + nextIds[prefix] + ' ' + key);
      if(nextIds[prefix] == undefined) {
        nextIds[prefix] = 0;
      } else if(nextIds[prefix] < id) {
        nextIds[prefix] = id;
      }
    }
  }
  
  return {
    init: init,
    createBlock: createBlock,
    setModeDrag:setModeDrag,
    setModeSelect:setModeSelect,
    getJSON:getJSON,
    loadJSON:loadJSON
  }
}
