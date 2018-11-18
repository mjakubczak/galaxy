var Diagram=function(){function a(a){return void 0==P[a]?P[a]=0:P[a]++,a+"-"+P[a]}function b(){F=d3.select("body").select("#svgDiagramWrapper").append("svg").attr("class","dynamicDiagram").attr("width",width).attr("height",height);var a=F.append("defs"),b=d3.range(0,width,25),c=d3.range(0,height,25);H=d3.select("body").select("#diagramSettings"),I=d3.select("body").select("#closeSettingsBtn").on("click",function(){H.style("display","none")}),F.selectAll(".line").data(b).enter().append("line").attr("x1",function(a){return a}).attr("y1",0).attr("x2",function(a){return a}).attr("y2",width).attr("stroke","#eee").attr("stroke-width",1).on("click",s),F.selectAll(".line2").data(c).enter().append("line").attr("x1",0).attr("y1",function(a){return a}).attr("x2",width).attr("y2",function(a){return a}).attr("stroke","#eee").attr("stroke-width",1).on("click",s),a.append("svg:marker").attr("id","triangle").attr("refX",3).attr("refY",2).attr("markerWidth",30).attr("markerHeight",20).attr("orient","auto").append("path").attr("d","M 0 0 4 2 0 4 1 2"),G=F.append("rect").classed("background",!0).attr("x",0).attr("y",0).attr("width",width).attr("height",height).attr("fill","white").style("opacity","0").on("click",s)}function c(){console.log("set mode: DRAG"),M=L.DRAG,d3.selectAll(".block").style("cursor","move"),d3.selectAll(".blockHandle").classed("hidden",!0),d3.selectAll(".deleteBtn").classed("active",!1),d3.selectAll(".diagramBtn.modeBtn").classed("active",!1),d3.selectAll("#setModeDragBtn").classed("active",!0)}function d(){console.log("set mode: SELECT"),M=L.SELECT,d3.selectAll(".block").style("cursor","default"),d3.selectAll(".blockHandle").classed("hidden",!1),d3.selectAll(".deleteBtn").classed("active",!0),d3.selectAll(".diagramBtn.modeBtn").classed("active",!1),d3.selectAll("#setModeSelectBtn").classed("active",!0)}function e(b,c,d,e){var g=a(e);f(g,b,c,d)}function f(a,b,d,e){var f=[{id:a,initX:b,initY:d,x:b,y:d,title:e}],i=70;J.nodes[a]={x:b,y:d};var l=F.append("g").classed("block",!0).classed("draggable",!0).classed("block"+B(e),!0).attr("id",a).data(f).attr("x",function(a){return a.x}).attr("y",function(a){return a.y}).attr("transform","translate(0,0)").call(d3.drag().on("start",v).on("drag",w).on("end",x));l.append("rect").data(f).attr("x",function(a){return a.x}).attr("y",function(a){return a.y}).attr("class","blockElem").attr("width",i).attr("height",i).attr("rx",4).attr("ry",4);var m=l.append("text").attr("x",function(a){return a.x+i/2}).attr("y",function(a){return a.y+i/2-15}).attr("class","blockName").attr("text-anchor","middle").text(a);l.append("text").attr("x",function(a){return a.x+i/2}).attr("y",function(a){return a.y+i/2+5}).attr("class","blockLabel").attr("text-anchor","middle").text(function(a){return a.title}),l.append("svg:image").attr("x",function(a){return a.x+5}).attr("y",function(a){return a.y+i-20}).attr("width",15).attr("height",15).attr("class","deleteBtn").attr("xlink:href",style_root+"/delete-icon.png").on("click",function(){j(l)}),l.append("svg:image").attr("x",function(a){return a.x+i-22}).attr("y",function(a){return a.y+i-20}).attr("width",15).attr("height",15).attr("class","deleteBtn").attr("xlink:href",style_root+"/edit-icon.png").on("click",function(){h(a,m,e)}),k(a,l,f,{x:0,y:i/2}),k(a,l,f,{x:i,y:i/2}),k(a,l,f,{x:i/2,y:0}),k(a,l,f,{x:i/2,y:i}),g(e,a),c()}function g(a,b){var c=K.getForm(a);$("#diagramSettingsWrapper").html(c);var d=K.formToJSON(),e=JSON.parse(d);J.params[b]=e,J.params[b].name=b}function h(a,b,c){var d=J.params[a],e=K.getForm(c,d);$("#diagramSettingsWrapper").html(e),i(a,b),K.setBehavior(),H.style("display","block")}function i(a,b){K.setValues(J.params[a]);var c=d3.select("body").select("#btnDiagramSettingsOK");c.on("click",function(){var c=K.formToJSON(),d=JSON.parse(c);b.text(d.name),J.params[a]=d,H.style("display","none")})}function j(a){console.log("delete btn");var b=a.attr("id");a.remove();for(var c=J.connections,d=0;d<c.length;d++)if(c[d].in==b||c[d].out==b){var e=d3.select("#"+c[d].arrow.id);null!=e&&e.remove()}J.connections.filter(function(a){return a.in==b||a.out==b});J.nodes[b]=void 0,J.params[b]=void 0,J.connections=J.connections.filter(function(a){return a.in!=b&&a.out!=b})}function k(a,b,c,d){b.append("circle").attr("class","blockHandle").attr("cx",function(a){return a.x+d.x}).attr("cy",function(a){return a.y+d.y}).attr("r",5).classed("hidden",!0).on("click",function(){l(a,b,d)})}function l(a,b,c){null==O?m(a,b,c):n(a,b,c)}function m(a,b,c){if(console.log("initActiveArrow"),p(a))return void console.log("initActiveArrow: cancel for output");var d=parseInt(b.attr("x"))+c.x,e=parseInt(b.attr("y"))+c.y,f=d,g=e;O=b,d3.selectAll(".deleteBtn").classed("active",!1),F.on("mousemove",function(){console.log("initActiveArrow: mousemove");var a=d3.mouse(this);null!=N&&N.remove(),f=a[0]>d?a[0]-2:a[0]+2,g=a[1]>e?a[1]-2:a[1]+2,N=t(d,e,f,g)})}function n(b,c,d){if(console.log("setNewConnection"),o(b))return void console.log("setNewConnection: cancel for input");if(c!=O){var e=O.attr("id"),f=c.attr("id");if(!r(e,f)){var g=N.attr("x1"),h=N.attr("y1"),i=parseInt(c.attr("x"))+d.x,j=parseInt(c.attr("y"))+d.y,k=a("arrow");O=null,F.on("mousemove",null),N.remove(),N=null;var l=t(g,h,i,j);l.attr("id",k);var m={id:k,x1:parseInt(g),y1:parseInt(h),x2:parseInt(i),y2:parseInt(j)},n={"in":e,out:f,arrow:m};return J.connections.push(n),void d3.selectAll(".deleteBtn").classed("active",!0)}}q()}function o(a){return"input"==J.params[a].type}function p(a){return"output"==J.params[a].type}function q(){null!=N&&(F.on("mousemove",null),N.remove(),N=null),null!=O&&(O=null),d3.selectAll(".deleteBtn").classed("active",!0)}function r(a,b){for(var c=J.connections,d=0;d<c.length;d++)if(c[d].in==a&&c[d].out==b||c[d].out==a&&c[d].in==b)return!0;return!1}function s(){M==L.SELECT&&q()}function t(a,b,c,d){console.log("draw arrow");var e=16,f=F.append("g").classed("arrow",!0).attr("x1",a).attr("y1",b).attr("x2",c).attr("y2",d);return f.append("line").attr("x1",a).attr("y1",b).attr("x2",c).attr("y2",d).attr("class","arrowLine").attr("marker-end","url(#triangle)"),f.append("svg:image").attr("x",parseInt(a)+Math.round((c-a)/2)-e/2).attr("y",parseInt(b)+Math.round((d-b)/2)-e/2).attr("width",e).attr("height",e).attr("class","deleteBtn").classed("active",!0).attr("xlink:href",style_root+"/delete-icon.png").on("click",function(){u(f)}),f}function u(a){var b=a.attr("id");console.log("id="+b),console.log("1. conn="+JSON.stringify(J.connections)),null!=b&&(J.connections=J.connections.filter(function(a){return a.arrow.id!=b})),console.log("2. conn="+JSON.stringify(J.connections)),a.remove()}function v(){M==L.DRAG&&d3.select(this).raise().classed("active",!0)}function w(a){if(M==L.DRAG){var b=d3.event.dx,c=d3.event.dy;a.x+=b,a.y+=c;var d=d3.select(this);d.attr("x",a.x),d.attr("y",a.y),d.attr("transform","translate("+(a.x-a.initX)+","+(a.y-a.initY)+")"),y(d,b,c),J.nodes[a.id].x=parseInt(d.attr("x")),J.nodes[a.id].y=parseInt(d.attr("y"))}}function x(){M==L.DRAG&&d3.select(this).classed("active",!1)}function y(a,b,c){var d,e=a.attr("id"),f=J.connections;for(d=0;d<f.length;d++)f[d].in==e?z(f[d].arrow,b,c):f[d].out==e&&A(f[d].arrow,b,c)}function z(a,b,c){var d=a.id,e=d3.select("#"+d),f=parseInt(e.attr("x1"))+b,g=parseInt(e.attr("y1"))+c,h=e.attr("x2"),i=e.attr("y2");e.remove(),e=t(f,g,h,i),e.attr("id",d),a.x1=f,a.y1=g}function A(a,b,c){var d=a.id,e=d3.select("#"+d),f=e.attr("x1"),g=e.attr("y1"),h=parseInt(e.attr("x2"))+b,i=parseInt(e.attr("y2"))+c;e.remove(),e=t(f,g,h,i),e.attr("id",d),a.x2=h,a.y2=i}function B(a){return a.charAt(0).toUpperCase()+a.slice(1)}function C(){return JSON.stringify(J)}function D(a){try{var b=JSON.parse(a);console.log("JSON loaded."),E(b)}catch(c){alert("Cannot load JSON: "+c)}}function E(a){F.remove(),b();for(var c in a.nodes){var d=a.nodes[c],e=a.params[c].type;f(c,d.x,d.y,e)}for(var g in a.connections){var h=a.connections[g].arrow,i=t(h.x1,h.y1,h.x2,h.y2);i.attr("id",h.id)}J=a,P=[];for(var c in a.nodes){var j=c.split("-"),k=j[0],l=j[1];console.log("HERE: "+P[k]+" "+c),void 0==P[k]?P[k]=0:P[k]<l&&(P[k]=l)}}var F=null,G=null,H=null,I=null,J={nodes:{},connections:[],params:{}},K=new FormParser(form_config_file),L={SELECT:0,DRAG:1},M=L.DRAG,N=null,O=null,P=[];return{init:b,createBlock:e,setModeDrag:c,setModeSelect:d,getJSON:C,loadJSON:D}};
//# sourceMappingURL=../../../maps/custom/diagram/diagram.js.map