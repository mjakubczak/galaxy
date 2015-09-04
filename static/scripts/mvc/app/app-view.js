define(["utils/utils","mvc/ui/ui-portlet","mvc/ui/ui-misc","galaxy.masthead","galaxy.menu","mvc/ui/ui-modal","galaxy.frame","mvc/user/user-model","mvc/user/user-quotameter","mvc/app/app-analysis"],function(a,b,c,d,e,f,g,h,i,j){return Backbone.View.extend({initialize:function(b){this.options=a.merge(b,{}),this.setElement(this._template(b)),$("body").append(this.$el),ensure_dd_helper();var c=$(this.$el.parent()).attr("scroll","no").addClass("full-content");this.options.message_box_visible&&(c.addClass("has-message-box"),this.$("#messagebox").show()),this.options.show_inactivity_warning&&(c.addClass("has-inactivity-box"),this.$("#inactivebox").show()),Galaxy.currUser||(Galaxy.currUser=new h.User(b.user.json)),Galaxy.masthead||(Galaxy.masthead=new d.GalaxyMasthead(b),Galaxy.modal=new f.View,Galaxy.frame=new g.GalaxyFrame,Galaxy.menu=new e.GalaxyMenu({masthead:Galaxy.masthead,config:b}),Galaxy.quotaMeter=new i.UserQuotaMeter({model:Galaxy.currUser,el:Galaxy.masthead.$(".quota-meter-container")}).render()),this._buildPanels(j,b)},_buildPanels:function(b,c){var d=["left","center","right"];for(var e in d){var f=d[e],g=new b[f](c);if("center"==f)this.$("#center").append(g.$el);else{var h=a.merge(g.components,{header:{title:"",cls:"",buttons:[]},body:{cls:""}}),i=$(this._templatePanel(f));i.find(".panel-header-text").html(h.header.title),i.find(".unified-panel-header-inner").addClass(h.header.cls);for(var e in h.header.buttons)i.find(".panel-header-buttons").append(h.header.buttons[e].$el);i.find(".unified-panel-body").addClass(h.body.cls).append(g.$el);{new Panel({center:this.$("#center"),panel:i,drag:i.find(".unified-panel-footer > .drag"),toggle:i.find(".unified-panel-footer > .panel-collapse"),right:"right"==f})}this.$el.append(i)}}},_templatePanel:function(a){return'<div id="'+a+'"><div class="unified-panel-header" unselectable="on"><div class="unified-panel-header-inner"><div class="panel-header-buttons" style="float: right"/><div class="panel-header-text"/></div></div><div class="unified-panel-body"/><div class="unified-panel-footer"><div class="panel-collapse '+a+'"/><div class="drag"/></div></div>'},_template:function(){return'<div id="everything" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"><div id="background"/><div id="messagebox" class="panel-'+Galaxy.config.message_box_class+'-message" style="display: none;">'+Galaxy.config.message_box_content+'</div><div id="inactivebox" class="panel-warning-message" style="display: none;">'+Galaxy.config.inactivity_box_content+' <a href="'+Galaxy.root+'user/resend_verification">Resend verification.</a></div><div id="center" class="inbound"/></div>'}})});
//# sourceMappingURL=../../../maps/mvc/app/app-view.js.map