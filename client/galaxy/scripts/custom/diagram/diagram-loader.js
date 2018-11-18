var diagram = null;

function loadDiagram(diagramWrapper, width, height, form_config_file, style_root) {
    
  $(diagramWrapper).append('<div id="diagramBox">' 
  + '  <div id="svgDiagramWrapper" style="overflow:scroll;"></div>'
  + '  <div id="diagramSettings"></div>'
  + '  <div id="loadDiagramJSON">'
  + '    <img src="' + style_root + '/close-icon.png" id="closeLoadJsonWindowBtn" class="diagramCloseBtn"></img>'
  + '    <h2>Load from file</h2>'
  + '    <textarea id="jsonLoadTxt" rows="12"></textarea>'
  + '    <button id="loadJsonBtn">Load</button>'
  + '  </div>'
  + '  <div id="getDiagramJSON">'
  + '    <img src="' + style_root + '/close-icon.png" id="closeGetJsonWindowBtn" class="diagramCloseBtn"></img>'
  + '    <h2>Output file</h2>'
  + '    <textarea id="jsonGetTxt" rows="12"></textarea>'
  + '  </div>'
  + '</div>');
	$(diagramWrapper).append('<div id="diagramMenu"></div>')
  
  var diagramMenu = "#diagramMenu";
  $(diagramMenu).append('<button class="diagramBtn" id="diagramGetJsonBtn"><img src="'+style_root+'/save-icon.png" width="20" height="20"></button>');
	$(diagramMenu).append('<button class="diagramBtn" id="diagramLoadJsonBtn"><img src="'+style_root+'/open-icon.png" width="20" height="20"></button>');
  $(diagramMenu).append('<button class="diagramBtn modeBtn active" id="setModeDragBtn"> <img src="'+style_root+'/move-icon.png" width="20" height="20"></button>');
	$(diagramMenu).append('<button class="diagramBtn modeBtn"  id="setModeSelectBtn"> <img src="'+style_root+'/connect-icon.png" width="20" height="20"></button>');
	$(diagramMenu).append('<button class="diagramBtn btnAddNode" onclick="addNode(\'input\',\'in\')">Input</button>');
	$(diagramMenu).append('<button class="diagramBtn btnAddNode" onclick="addNode(\'scale\',\'scal\')">Scaling</button>');
	$(diagramMenu).append('<button class="diagramBtn btnAddNode" onclick="addNode(\'select\',\'sel\')">Selection</button>');
	$(diagramMenu).append('<button class="diagramBtn btnAddNode" onclick="addNode(\'merge\',\'merge\')">Merge</button>');
	$(diagramMenu).append('<button class="diagramBtn btnAddNode" onclick="addNode(\'classify\',\'class\')">Classification</button>');
	$(diagramMenu).append('<button class="diagramBtn btnAddNode" onclick="addNode(\'output\',\'out\')">Output</button>');
	
  $(diagramWrapper).append('<br><div id="diagramJson"></div>');
	$("#diagramSettings").append('<div id="diagramSettingsWrapper"></div><img src="'+style_root+'/close-icon.png" id="closeSettingsBtn" class="diagramCloseBtn">');
	
  diagram = new Diagram(width, height, form_config_file, style_root);
	diagram.init();
	
	/* event handlers */
	$("#setModeDragBtn").click(function() { diagram.setModeDrag();});
	$("#setModeSelectBtn").click(function() {diagram.setModeSelect();});
	$("#diagramLoadJsonBtn").click(function() {$("#loadDiagramJSON").show();});
  $("#loadJsonBtn").click(function() {diagram.loadJSON($("#jsonLoadTxt").val());});
	$(".closeSettingsBtn").click(function() { $("#diagramSettings").css("display: none;");});
  $("#closeLoadJsonWindowBtn").click(function() { $("#loadDiagramJSON").hide(); });
  $("#closeGetJsonWindowBtn").click(function() { $("#getDiagramJSON").hide(); });
  $("#diagramGetJsonBtn").click(function() {
    $("#jsonGetTxt").text(diagram.getJSON());
    $("#getDiagramJSON").show();
	});
}

function addNode(label, shortName) {
    diagram.createBlock(25,25, label, shortName);
}