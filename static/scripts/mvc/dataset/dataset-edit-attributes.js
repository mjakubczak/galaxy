define("mvc/dataset/dataset-edit-attributes",["exports","utils/utils","mvc/ui/ui-tabs","mvc/ui/ui-misc","mvc/form/form-view"],function(t,e,a,i,s){"use strict";function o(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(t,"__esModule",{value:!0});o(e);var n=o(a),r=o(i),d=o(s),u=Backbone.View.extend({initialize:function(){this.setElement("<div/>"),this.model=new Backbone.Model({dataset_id:Galaxy.params.dataset_id}),this.message=new r.default.Message({persistent:!0}),this.tabs=this._createTabs(),this.$el.append($("<h4/>").append("Edit dataset attributes")).append(this.message.$el).append("<p/>").append(this.tabs.$el).hide(),this.render()},render:function(){var t=this;$.ajax({url:Galaxy.root+"dataset/get_edit?dataset_id="+t.model.get("dataset_id"),success:function(e){!t.initial_message&&t.message.update(e),t.initial_message=!0,_.each(t.forms,function(t,a){t.model.set("inputs",e[a+"_inputs"]),t.model.set("hide_operations",e[a+"_disable"]),t.render()}),t.$el.show()},error:function(e){var a=e.responseJSON&&e.responseJSON.err_msg;t.message.update({status:"danger",message:a||"Error occured while loading the dataset."})}})},_submit:function(t,e){var a=this,i=e.data.create();i.dataset_id=this.model.get("dataset_id"),i.operation=t,$.ajax({type:"PUT",url:Galaxy.root+"dataset/set_edit",data:i,success:function(t){a.message.update(t),a.render(),a._reloadHistory()},error:function(t){var e=t.responseJSON&&t.responseJSON.err_msg;a.message.update({status:"danger",message:e||"Error occured while editing the dataset attributes."})}})},_createTabs:function(){this.forms={attribute:this._getAttribute(),conversion:this._getConversion(),datatype:this._getDatatype(),permission:this._getPermission()};var t=new n.default.View;return t.add({id:"attribute",title:"Attributes",icon:"fa fa-bars",tooltip:"Edit dataset attributes",$el:this.forms.attribute.$el}),t.add({id:"convert",title:"Convert",icon:"fa-gear",tooltip:"Convert to new format",$el:this.forms.conversion.$el}),t.add({id:"datatype",title:"Datatypes",icon:"fa-database",tooltip:"Change data type",$el:this.forms.datatype.$el}),t.add({id:"permissions",title:"Permissions",icon:"fa-user",tooltip:"Permissions",$el:this.forms.permission.$el}),t},_getAttribute:function(){var t=this,e=new d.default({title:"Edit attributes",operations:{submit_attributes:new r.default.ButtonIcon({tooltip:"Save attributes of the dataset.",icon:"fa-floppy-o",title:"Save",onclick:function(){t._submit("attributes",e)}}),submit_autodetect:new r.default.ButtonIcon({tooltip:"This will inspect the dataset and attempt to correct the values of fields if they are not accurate.",icon:"fa-undo",title:"Auto-detect",onclick:function(){t._submit("autodetect",e)}})}});return e},_getConversion:function(){var t=this,e=new d.default({title:"Convert to new format",operations:{submit_conversion:new r.default.ButtonIcon({tooltip:"Convert the datatype to a new format.",title:"Convert datatype",icon:"fa-exchange",onclick:function(){t._submit("conversion",e)}})}});return e},_getDatatype:function(){var t=this,e=new d.default({title:"Change datatype",operations:{submit_datatype:new r.default.ButtonIcon({tooltip:"Change the datatype to a new type.",title:"Change datatype",icon:"fa-exchange",onclick:function(){t._submit("datatype",e)}})}});return e},_getPermission:function(){var t=this,e=new d.default({title:"Manage dataset permissions",operations:{submit_permission:new r.default.ButtonIcon({tooltip:"Save permissions.",title:"Save permissions",icon:"fa-floppy-o ",onclick:function(){t._submit("permission",e)}})}});return e},_reloadHistory:function(){window.Galaxy&&window.Galaxy.currHistoryPanel.loadCurrentHistory()}});t.default={View:u}});
//# sourceMappingURL=../../../maps/mvc/dataset/dataset-edit-attributes.js.map