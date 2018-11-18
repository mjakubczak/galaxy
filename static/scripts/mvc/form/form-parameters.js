define(["utils/utils","mvc/ui/ui-misc","mvc/ui/ui-select-content","mvc/ui/ui-select-library","mvc/ui/ui-select-ftp","mvc/ui/ui-color-picker","mvc/ui/ui-diagram"],function(a,b,c,d,e,f,g){return Backbone.Model.extend({types:{text:"_fieldText",select:"_fieldSelect",data_column:"_fieldSelect",genomebuild:"_fieldSelect",data:"_fieldData",data_collection:"_fieldData",integer:"_fieldSlider","float":"_fieldSlider","boolean":"_fieldBoolean",drill_down:"_fieldDrilldown",color:"_fieldColor",hidden:"_fieldHidden",hidden_data:"_fieldHidden",baseurl:"_fieldHidden",library_data:"_fieldLibrary",ftpfile:"_fieldFtp",diagram:"_fieldDiagram"},create:function(a){var b=this.types[a.type],c="function"==typeof this[b]?this[b].call(this,a):null;return c||(c=a.options?this._fieldSelect(a):this._fieldText(a),Galaxy.emit.debug("form-parameters::_addRow()","Auto matched field type ("+a.type+").")),void 0===a.value&&(a.value=null),c.value(a.value),c},_fieldData:function(a){return new c.View({id:"field-"+a.id,extensions:a.extensions,optional:a.optional,multiple:a.multiple,type:a.type,flavor:a.flavor,data:a.options,onchange:a.onchange})},_fieldSelect:function(a){if(a.is_workflow)return this._fieldText(a);"data_column"==a.type&&(a.error_text="Missing columns in referenced dataset.");var c=a.data;c||(c=[],_.each(a.options,function(a){c.push({label:a[0],value:a[1]})}));var d=b.Select;switch(a.display){case"checkboxes":d=b.Checkbox;break;case"radio":d=b.Radio;break;case"radiobutton":d=b.RadioButton}return new d.View({id:"field-"+a.id,data:c,error_text:a.error_text||"No options available",multiple:a.multiple,optional:a.optional,onchange:a.onchange,searchable:"workflow"!==a.flavor})},_fieldDrilldown:function(a){return a.is_workflow?this._fieldText(a):new b.Drilldown.View({id:"field-"+a.id,data:a.options,display:a.display,optional:a.optional,onchange:a.onchange})},_fieldText:function(c){if(c.options&&c.data)if(c.area=c.multiple,a.isEmpty(c.value))c.value=null;else if($.isArray(c.value)){var d="";for(var e in c.value){if(d+=String(c.value[e]),!c.multiple)break;d+="\n"}c.value=d}return new b.Input({id:"field-"+c.id,area:c.area,placeholder:c.placeholder,onchange:c.onchange})},_fieldSlider:function(a){return new b.Slider.View({id:"field-"+a.id,precise:"float"==a.type,is_workflow:a.is_workflow,min:a.min,max:a.max,onchange:a.onchange})},_fieldHidden:function(a){return new b.Hidden({id:"field-"+a.id,info:a.info})},_fieldDiagram:function(a){return new g({id:"field-"+a.id,onchange:a.onchange})},_fieldBoolean:function(a){return new b.RadioButton.View({id:"field-"+a.id,data:[{label:"Yes",value:"true"},{label:"No",value:"false"}],onchange:a.onchange})},_fieldColor:function(a){return new f({id:"field-"+a.id,onchange:a.onchange})},_fieldLibrary:function(a){return new d.View({id:"field-"+a.id,optional:a.optional,multiple:a.multiple,onchange:a.onchange})},_fieldFtp:function(a){return new e.View({id:"field-"+a.id,optional:a.optional,multiple:a.multiple,onchange:a.onchange})}})});
//# sourceMappingURL=../../../maps/mvc/form/form-parameters.js.map