var Diagram=function(a,b,c,d){function e(a){return void 0==T[a]?T[a]=0:T[a]++,a+"-"+T[a]}function f(){J=d3.select("body").select("#svgDiagramWrapper").append("svg").attr("class","dynamicDiagram").attr("width",a).attr("height",b);var c=J.append("defs"),d=d3.range(0,a,25),e=d3.range(0,b,25);L=d3.select("body").select("#diagramSettings"),M=d3.select("body").select("#closeSettingsBtn").on("click",function(){L.style("display","none")}),J.selectAll(".line").data(d).enter().append("line").attr("x1",function(a){return a}).attr("y1",0).attr("x2",function(a){return a}).attr("y2",a).attr("stroke","#eee").attr("stroke-width",1).on("click",w),J.selectAll(".line2").data(e).enter().append("line").attr("x1",0).attr("y1",function(a){return a}).attr("x2",a).attr("y2",function(a){return a}).attr("stroke","#eee").attr("stroke-width",1).on("click",w),c.append("svg:marker").attr("id","triangle").attr("refX",3).attr("refY",2).attr("markerWidth",30).attr("markerHeight",20).attr("orient","auto").append("path").attr("d","M 0 0 4 2 0 4 1 2"),K=J.append("rect").classed("background",!0).attr("x",0).attr("y",0).attr("width",a).attr("height",b).attr("fill","white").style("opacity","0").on("click",w)}function g(){console.log("set mode: DRAG"),Q=P.DRAG,d3.selectAll(".block").style("cursor","move"),d3.selectAll(".blockHandle").classed("hidden",!0),d3.selectAll(".deleteBtn").classed("active",!1),d3.selectAll(".diagramBtn.modeBtn").classed("active",!1),d3.selectAll("#setModeDragBtn").classed("active",!0)}function h(){console.log("set mode: SELECT"),Q=P.SELECT,d3.selectAll(".block").style("cursor","default"),d3.selectAll(".blockHandle").classed("hidden",!1),d3.selectAll(".deleteBtn").classed("active",!0),d3.selectAll(".diagramBtn.modeBtn").classed("active",!1),d3.selectAll("#setModeSelectBtn").classed("active",!0)}function i(a,b,c,d){var f=e(d);j(f,a,b,c)}function j(a,b,c,e){var f=[{id:a,initX:b,initY:c,x:b,y:c,title:e}],h=70;N.nodes[a]={x:b,y:c};var i=J.append("g").classed("block",!0).classed("draggable",!0).classed("block"+F(e),!0).attr("id",a).data(f).attr("x",function(a){return a.x}).attr("y",function(a){return a.y}).attr("transform","translate(0,0)").call(d3.drag().on("start",z).on("drag",A).on("end",B));i.append("rect").data(f).attr("x",function(a){return a.x}).attr("y",function(a){return a.y}).attr("class","blockElem").attr("width",h).attr("height",h).attr("rx",4).attr("ry",4);var j=i.append("text").attr("x",function(a){return a.x+h/2}).attr("y",function(a){return a.y+h/2-15}).attr("class","blockName").attr("text-anchor","middle").text(a);i.append("text").attr("x",function(a){return a.x+h/2}).attr("y",function(a){return a.y+h/2+5}).attr("class","blockLabel").attr("text-anchor","middle").text(function(a){return a.title}),i.append("svg:image").attr("x",function(a){return a.x+5}).attr("y",function(a){return a.y+h-20}).attr("width",15).attr("height",15).attr("class","deleteBtn").attr("xlink:href",d+"/delete-icon.png").on("click",function(){n(i)}),i.append("svg:image").attr("x",function(a){return a.x+h-22}).attr("y",function(a){return a.y+h-20}).attr("width",15).attr("height",15).attr("class","deleteBtn").attr("xlink:href",d+"/edit-icon.png").on("click",function(){l(a,j,e)}),o(a,i,f,{x:0,y:h/2}),o(a,i,f,{x:h,y:h/2}),o(a,i,f,{x:h/2,y:0}),o(a,i,f,{x:h/2,y:h}),k(e,a),g()}function k(a,b){var c=O.getForm(a);$("#diagramSettingsWrapper").html(c);var d=O.formToJSON(),e=JSON.parse(d);N.params[b]=e,N.params[b].name=b}function l(a,b,c){var d=N.params[a],e=O.getForm(c,d);$("#diagramSettingsWrapper").html(e),m(a,b),O.setBehavior(),L.style("display","block")}function m(a,b){O.setValues(N.params[a]);var c=d3.select("body").select("#btnDiagramSettingsOK");c.on("click",function(){var c=O.formToJSON(),d=JSON.parse(c);b.text(d.name),N.params[a]=d,L.style("display","none")})}function n(a){console.log("delete btn");var b=a.attr("id");a.remove();for(var c=N.connections,d=0;d<c.length;d++)if(c[d].in==b||c[d].out==b){var e=d3.select("#"+c[d].arrow.id);null!=e&&e.remove()}N.connections.filter(function(a){return a.in==b||a.out==b});N.nodes[b]=void 0,N.params[b]=void 0,N.connections=N.connections.filter(function(a){return a.in!=b&&a.out!=b})}function o(a,b,c,d){b.append("circle").attr("class","blockHandle").attr("cx",function(a){return a.x+d.x}).attr("cy",function(a){return a.y+d.y}).attr("r",5).classed("hidden",!0).on("click",function(){p(a,b,d)})}function p(a,b,c){null==S?q(a,b,c):r(a,b,c)}function q(a,b,c){if(console.log("initActiveArrow"),t(a))return void console.log("initActiveArrow: cancel for output");var d=parseInt(b.attr("x"))+c.x,e=parseInt(b.attr("y"))+c.y,f=d,g=e;S=b,d3.selectAll(".deleteBtn").classed("active",!1),J.on("mousemove",function(){console.log("initActiveArrow: mousemove");var a=d3.mouse(this);null!=R&&R.remove(),f=a[0]>d?a[0]-2:a[0]+2,g=a[1]>e?a[1]-2:a[1]+2,R=x(d,e,f,g)})}function r(a,b,c){if(console.log("setNewConnection"),s(a))return void console.log("setNewConnection: cancel for input");if(b!=S){var d=S.attr("id"),f=b.attr("id");if(!v(d,f)){var g=R.attr("x1"),h=R.attr("y1"),i=parseInt(b.attr("x"))+c.x,j=parseInt(b.attr("y"))+c.y,k=e("arrow");S=null,J.on("mousemove",null),R.remove(),R=null;var l=x(g,h,i,j);l.attr("id",k);var m={id:k,x1:parseInt(g),y1:parseInt(h),x2:parseInt(i),y2:parseInt(j)},n={"in":d,out:f,arrow:m};return N.connections.push(n),void d3.selectAll(".deleteBtn").classed("active",!0)}}u()}function s(a){return"input"==N.params[a].type}function t(a){return"output"==N.params[a].type}function u(){null!=R&&(J.on("mousemove",null),R.remove(),R=null),null!=S&&(S=null),d3.selectAll(".deleteBtn").classed("active",!0)}function v(a,b){for(var c=N.connections,d=0;d<c.length;d++)if(c[d].in==a&&c[d].out==b||c[d].out==a&&c[d].in==b)return!0;return!1}function w(){Q==P.SELECT&&u()}function x(a,b,c,e){console.log("draw arrow");var f=16,g=J.append("g").classed("arrow",!0).attr("x1",a).attr("y1",b).attr("x2",c).attr("y2",e);return g.append("line").attr("x1",a).attr("y1",b).attr("x2",c).attr("y2",e).attr("class","arrowLine").attr("marker-end","url(#triangle)"),g.append("svg:image").attr("x",parseInt(a)+Math.round((c-a)/2)-f/2).attr("y",parseInt(b)+Math.round((e-b)/2)-f/2).attr("width",f).attr("height",f).attr("class","deleteBtn").classed("active",!0).attr("xlink:href",d+"/delete-icon.png").on("click",function(){y(g)}),g}function y(a){var b=a.attr("id");console.log("id="+b),console.log("1. conn="+JSON.stringify(N.connections)),null!=b&&(N.connections=N.connections.filter(function(a){return a.arrow.id!=b})),console.log("2. conn="+JSON.stringify(N.connections)),a.remove()}function z(){Q==P.DRAG&&d3.select(this).raise().classed("active",!0)}function A(a){if(Q==P.DRAG){var b=d3.event.dx,c=d3.event.dy;a.x+=b,a.y+=c;var d=d3.select(this);d.attr("x",a.x),d.attr("y",a.y),d.attr("transform","translate("+(a.x-a.initX)+","+(a.y-a.initY)+")"),C(d,b,c),N.nodes[a.id].x=parseInt(d.attr("x")),N.nodes[a.id].y=parseInt(d.attr("y"))}}function B(){Q==P.DRAG&&d3.select(this).classed("active",!1)}function C(a,b,c){var d,e=a.attr("id"),f=N.connections;for(d=0;d<f.length;d++)f[d].in==e?D(f[d].arrow,b,c):f[d].out==e&&E(f[d].arrow,b,c)}function D(a,b,c){var d=a.id,e=d3.select("#"+d),f=parseInt(e.attr("x1"))+b,g=parseInt(e.attr("y1"))+c,h=e.attr("x2"),i=e.attr("y2");e.remove(),e=x(f,g,h,i),e.attr("id",d),a.x1=f,a.y1=g}function E(a,b,c){var d=a.id,e=d3.select("#"+d),f=e.attr("x1"),g=e.attr("y1"),h=parseInt(e.attr("x2"))+b,i=parseInt(e.attr("y2"))+c;e.remove(),e=x(f,g,h,i),e.attr("id",d),a.x2=h,a.y2=i}function F(a){return a.charAt(0).toUpperCase()+a.slice(1)}function G(){return JSON.stringify(N)}function H(a){try{var b=JSON.parse(a);console.log("JSON loaded."),I(b)}catch(c){alert("Cannot load JSON: "+c)}}function I(a){J.remove(),f();for(var b in a.nodes){var c=a.nodes[b],d=a.params[b].type;j(b,c.x,c.y,d)}for(var e in a.connections){var g=a.connections[e].arrow,h=x(g.x1,g.y1,g.x2,g.y2);h.attr("id",g.id)}N=a,T=[];for(var b in a.nodes){var i=b.split("-"),k=i[0],l=i[1];console.log("HERE: "+T[k]+" "+b),void 0==T[k]?T[k]=0:T[k]<l&&(T[k]=l)}}var J=null,K=null,L=null,M=null,N={nodes:{},connections:[],params:{}},O=new FormParser(c),P={SELECT:0,DRAG:1},Q=P.DRAG,R=null,S=null,T=[];return{init:f,createBlock:i,setModeDrag:g,setModeSelect:h,getJSON:G,loadJSON:H}};
//# sourceMappingURL=../../../maps/custom/diagram/diagram.js.map