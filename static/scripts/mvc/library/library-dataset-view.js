define(["libs/toastr","mvc/library/library-model","utils/utils","mvc/ui/ui-select"],function(a,b,c,d){var e=Backbone.View.extend({el:"#center",model:null,options:{},defaults:{edit_mode:!1},events:{"click .toolbtn_modify_dataset":"enableModification","click .toolbtn_cancel_modifications":"render","click .toolbtn-download-dataset":"downloadDataset","click .toolbtn-import-dataset":"importIntoHistory","click .copy-link-to-clipboard":"copyToClipboard","click .make-private":"makeDatasetPrivate","click .remove-restrictions":"removeDatasetRestrictions","click .toolbtn_save_permissions":"savePermissions","click .toolbtn_save_modifications":"saveModifications"},select_genome:null,select_extension:null,list_extensions:[],auto:{id:"auto",text:"Auto-detect",description:"This system will try to detect the file type automatically. If your file is not detected properly as one of the known formats, it most likely means that it has some format problems (e.g., different number of columns on different rows). You can still coerce the system to set your data to the format you think it should be. You can also upload compressed files, which will automatically be decompressed."},list_genomes:[],initialize:function(a){this.options=_.extend(this.options,a),this.fetchExtAndGenomes(),this.options.id&&this.fetchDataset()},fetchDataset:function(c){this.options=_.extend(this.options,c),this.model=new b.Item({id:this.options.id});var d=this;this.model.fetch({success:function(){d.options.show_permissions?d.showPermissions():d.options.show_version?d.fetchVersion():d.render()},error:function(b,c){"undefined"!=typeof c.responseJSON?a.error(c.responseJSON.err_msg+" Click this to go back.","",{onclick:function(){Galaxy.libraries.library_router.back()}}):a.error("An error ocurred. Click this to go back.","",{onclick:function(){Galaxy.libraries.library_router.back()}})}})},render:function(a){this.options=_.extend(this.options,a),$(".tooltip").remove();var b=this.templateDataset();this.$el.html(b({item:this.model})),$(".peek").html(this.model.get("peek")),$("#center [data-toggle]").tooltip()},fetchVersion:function(c){this.options=_.extend(this.options,c),that=this,this.options.ldda_id?(this.ldda=new b.Ldda({id:this.options.ldda_id}),this.ldda.url=this.ldda.urlRoot+this.model.id+"/versions/"+this.ldda.id,this.ldda.fetch({success:function(){that.renderVersion()},error:function(b,c){a.error("undefined"!=typeof c.responseJSON?c.responseJSON.err_msg:"An error ocurred.")}})):(this.render(),a.error("Library dataset version requested but no id provided."))},renderVersion:function(){$(".tooltip").remove();var a=this.templateVersion();this.$el.html(a({item:this.model,ldda:this.ldda})),$(".peek").html(this.ldda.get("peek"))},enableModification:function(){$(".tooltip").remove();var a=this.templateModifyDataset();this.$el.html(a({item:this.model})),this.renderSelectBoxes({genome_build:this.model.get("genome_build"),file_ext:this.model.get("file_ext")}),$(".peek").html(this.model.get("peek")),$("#center [data-toggle]").tooltip()},downloadDataset:function(){var a=Galaxy.root+"api/libraries/datasets/download/uncompressed",b={ld_ids:this.id};this.processDownload(a,b)},processDownload:function(b,c,d){if(b&&c){c="string"==typeof c?c:$.param(c);var e="";$.each(c.split("&"),function(){var a=this.split("=");e+='<input type="hidden" name="'+a[0]+'" value="'+a[1]+'" />'}),$('<form action="'+b+'" method="'+(d||"post")+'">'+e+"</form>").appendTo("body").submit().remove(),a.info("Your download will begin soon.")}},importIntoHistory:function(){this.refreshUserHistoriesList(function(a){var b=a.templateBulkImportInModal();a.modal=Galaxy.modal,a.modal.show({closing_events:!0,title:"Import into History",body:b({histories:a.histories.models}),buttons:{Import:function(){a.importCurrentIntoHistory()},Close:function(){Galaxy.modal.hide()}}})})},refreshUserHistoriesList:function(c){var d=this;this.histories=new b.GalaxyHistories,this.histories.fetch({success:function(b){0===b.length?a.warning("You have to create history first. Click this to do so.","",{onclick:function(){window.location=Galaxy.root}}):c(d)},error:function(b,c){a.error("undefined"!=typeof c.responseJSON?c.responseJSON.err_msg:"An error ocurred.")}})},importCurrentIntoHistory:function(){this.modal.disableButton("Import");var b=this.modal.$("input[name=history_name]").val(),c=this;if(""!==b)$.post(Galaxy.root+"api/histories",{name:b}).done(function(a){c.processImportToHistory(a.id)}).fail(function(){a.error("An error ocurred.")}).always(function(){c.modal.enableButton("Import")});else{var d=$(this.modal.$el).find("select[name=dataset_import_single] option:selected").val();this.processImportToHistory(d),this.modal.enableButton("Import")}},processImportToHistory:function(c){var d=new b.HistoryItem;d.url=d.urlRoot+c+"/contents",jQuery.getJSON(Galaxy.root+"history/set_as_current?id="+c),d.save({content:this.id,source:"library"},{success:function(){Galaxy.modal.hide(),a.success("Dataset imported. Click this to start analyzing it.","",{onclick:function(){window.location=Galaxy.root}})},error:function(b,c){a.error("undefined"!=typeof c.responseJSON?"Dataset not imported. "+c.responseJSON.err_msg:"An error occured. Dataset not imported. Please try again.")}})},showPermissions:function(b){var c=this.templateDatasetPermissions(),d=this;this.options=_.extend(this.options,b),$(".tooltip").remove(),void 0!==this.options.fetched_permissions&&this.model.set(0===this.options.fetched_permissions.access_dataset_roles.length?{is_unrestricted:!0}:{is_unrestricted:!1}),this.$el.html(c({item:this.model,is_admin:Galaxy.config.is_admin_user})),$.get(Galaxy.root+"api/libraries/datasets/"+d.id+"/permissions?scope=current").done(function(a){d.prepareSelectBoxes({fetched_permissions:a,is_admin:Galaxy.config.is_admin_user})}).fail(function(){a.error("An error occurred while attempting to fetch dataset permissions.")}),$("#center [data-toggle]").tooltip(),$("#center").css("overflow","auto")},_serializeRoles:function(a){for(var b=[],c=0;c<a.length;c++)b.push(a[c][1]+":"+a[c][0]);return b},prepareSelectBoxes:function(a){this.options=_.extend(this.options,a),this.accessSelectObject=new d.View(this._generate_select_options({selector:"access_perm",initialData:this._serializeRoles(this.options.fetched_permissions.access_dataset_roles)})),this.modifySelectObject=new d.View(this._generate_select_options({selector:"modify_perm",initialData:this._serializeRoles(this.options.fetched_permissions.modify_item_roles)})),this.manageSelectObject=new d.View(this._generate_select_options({selector:"manage_perm",initialData:this._serializeRoles(this.options.fetched_permissions.manage_dataset_roles)}))},_generate_select_options:function(a){var b={minimumInputLength:0,multiple:!0,placeholder:"Click to select a role",formatResult:function(a){return a.name+" type: "+a.type},formatSelection:function(a){return a.name},initSelection:function(a,b){var c=[];$(a.val().split(",")).each(function(){var a=this.split(":");c.push({id:a[0],name:a[1]})}),b(c)},dropdownCssClass:"bigdrop"};return b.container=this.$el.find("#"+a.selector),b.css=a.selector,b.initialData=a.initialData.join(","),b.ajax={url:Galaxy.root+"api/libraries/datasets/"+this.id+"/permissions?scope=available",dataType:"json",quietMillis:100,data:function(a,b){return{q:a,page_limit:10,page:b}},results:function(a,b){var c=10*b<a.total;return{results:a.roles,more:c}}},b},saveModifications:function(){var b=!1,c=this.model,d=this.$el.find(".input_dataset_name").val();if("undefined"!=typeof d&&d!==c.get("name")){if(!(d.length>0))return void a.warning("Library dataset name has to be at least 1 character long.");c.set("name",d),b=!0}var e=this.$el.find(".input_dataset_misc_info").val();"undefined"!=typeof e&&e!==c.get("misc_info")&&(c.set("misc_info",e),b=!0);var f=this.select_genome.$el.select2("data").id;"undefined"!=typeof f&&f!==c.get("genome_build")&&(c.set("genome_build",f),b=!0);var g=this.select_extension.$el.select2("data").id;"undefined"!=typeof g&&g!==c.get("file_ext")&&(c.set("file_ext",g),b=!0);var h=this;b?c.save(null,{patch:!0,success:function(){h.render(),a.success("Changes to library dataset saved.")},error:function(b,c){a.error("undefined"!=typeof c.responseJSON?c.responseJSON.err_msg:"An error occured while attempting to update the library dataset.")}}):(h.render(),a.info("Nothing has changed."))},copyToClipboard:function(){var a=Backbone.history.location.href;-1!==a.lastIndexOf("/permissions")&&(a=a.substr(0,a.lastIndexOf("/permissions"))),window.prompt("Copy to clipboard: Ctrl+C, Enter",a)},makeDatasetPrivate:function(){var b=this;$.post(Galaxy.root+"api/libraries/datasets/"+b.id+"/permissions?action=make_private").done(function(c){b.model.set({is_unrestricted:!1}),b.showPermissions({fetched_permissions:c}),a.success("The dataset is now private to you.")}).fail(function(){a.error("An error occurred while attempting to make dataset private.")})},removeDatasetRestrictions:function(){var b=this;$.post(Galaxy.root+"api/libraries/datasets/"+b.id+"/permissions?action=remove_restrictions").done(function(c){b.model.set({is_unrestricted:!0}),b.showPermissions({fetched_permissions:c}),a.success("Access to this dataset is now unrestricted.")}).fail(function(){a.error("An error occurred while attempting to make dataset unrestricted.")})},_extractIds:function(a){for(var b=[],c=a.length-1;c>=0;c--)b.push(a[c].id);return b},savePermissions:function(){var b=this,c=this._extractIds(this.accessSelectObject.$el.select2("data")),d=this._extractIds(this.manageSelectObject.$el.select2("data")),e=this._extractIds(this.modifySelectObject.$el.select2("data"));$.post(Galaxy.root+"api/libraries/datasets/"+b.id+"/permissions?action=set_permissions",{"access_ids[]":c,"manage_ids[]":d,"modify_ids[]":e}).done(function(c){b.showPermissions({fetched_permissions:c}),a.success("Permissions saved.")}).fail(function(){a.error("An error occurred while attempting to set dataset permissions.")})},fetchExtAndGenomes:function(){var a=this;0==this.list_genomes.length&&c.get({url:Galaxy.root+"api/datatypes?extension_only=False",success:function(b){for(var c in b)a.list_extensions.push({id:b[c].extension,text:b[c].extension,description:b[c].description,description_url:b[c].description_url});a.list_extensions.sort(function(a,b){return a.id>b.id?1:a.id<b.id?-1:0}),a.list_extensions.unshift(a.auto)}}),0==this.list_extensions.length&&c.get({url:Galaxy.root+"api/genomes",success:function(b){for(var c in b)a.list_genomes.push({id:b[c][1],text:b[c][0]});a.list_genomes.sort(function(a,b){return a.id>b.id?1:a.id<b.id?-1:0})}})},renderSelectBoxes:function(a){var b=this,c="?",e="auto";"undefined"!=typeof a&&("undefined"!=typeof a.genome_build&&(c=a.genome_build),"undefined"!=typeof a.file_ext&&(e=a.file_ext)),this.select_genome=new d.View({css:"dataset-genome-select",data:b.list_genomes,container:b.$el.find("#dataset_genome_select"),value:c}),this.select_extension=new d.View({css:"dataset-extension-select",data:b.list_extensions,container:b.$el.find("#dataset_extension_select"),value:e})},templateDataset:function(){return _.template(['<div class="library_style_container">','<div id="library_toolbar">','<button data-toggle="tooltip" data-placement="top" title="Download dataset" class="btn btn-default toolbtn-download-dataset primary-button toolbar-item" type="button">','<span class="fa fa-download"></span>',"&nbsp;Download","</button>",'<button data-toggle="tooltip" data-placement="top" title="Import dataset into history" class="btn btn-default toolbtn-import-dataset primary-button toolbar-item" type="button">','<span class="fa fa-book"></span>',"&nbsp;to History","</button>",'<% if (item.get("can_user_modify")) { %>','<button data-toggle="tooltip" data-placement="top" title="Modify library item" class="btn btn-default toolbtn_modify_dataset primary-button toolbar-item" type="button">','<span class="fa fa-pencil"></span>',"&nbsp;Modify","</button>","<% } %>",'<% if (item.get("can_user_manage")) { %>','<a href="#folders/<%- item.get("folder_id") %>/datasets/<%- item.id %>/permissions">','<button data-toggle="tooltip" data-placement="top" title="Manage permissions" class="btn btn-default toolbtn_change_permissions primary-button toolbar-item" type="button">','<span class="fa fa-group"></span>',"&nbsp;Permissions","</button>","</a>","<% } %>","</div>",'<ol class="breadcrumb">','<li><a title="Return to the list of libraries" href="#">Libraries</a></li>','<% _.each(item.get("full_path"), function(path_item) { %>',"<% if (path_item[0] != item.id) { %>",'<li><a title="Return to this folder" href="#/folders/<%- path_item[0] %>"><%- path_item[1] %></a> </li> ',"<% } else { %>",'<li class="active"><span title="You are here"><%- path_item[1] %></span></li>',"<% } %>","<% }); %>","</ol>",'<% if (item.get("is_unrestricted")) { %>',"<div>",'This dataset is unrestricted so everybody with the link can access it. Just share <span class="copy-link-to-clipboard"><a>this page</a></span>.',"</div>","<% } %>",'<div class="dataset_table">','<table class="grid table table-striped table-condensed">',"<tr>",'<th class="dataset-first-column" scope="row" id="id_row" data-id="<%= _.escape(item.get("ldda_id")) %>">Name</th>','<td><%= _.escape(item.get("name")) %></td>',"</tr>",'<% if (item.get("file_ext")) { %>',"<tr>",'<th scope="row">Data type</th>','<td><%= _.escape(item.get("file_ext")) %></td>',"</tr>","<% } %>",'<% if (item.get("genome_build")) { %>',"<tr>",'<th scope="row">Genome build</th>','<td><%= _.escape(item.get("genome_build")) %></td>',"</tr>","<% } %>",'<% if (item.get("file_size")) { %>',"<tr>",'<th scope="row">Size</th>','<td><%= _.escape(item.get("file_size")) %></td>',"</tr>","<% } %>",'<% if (item.get("date_uploaded")) { %>',"<tr>",'<th scope="row">Date uploaded (UTC)</th>','<td><%= _.escape(item.get("date_uploaded")) %></td>',"</tr>","<% } %>",'<% if (item.get("uploaded_by")) { %>',"<tr>",'<th scope="row">Uploaded by</th>','<td><%= _.escape(item.get("uploaded_by")) %></td>',"</tr>","<% } %>",'<% if (item.get("metadata_data_lines")) { %>',"<tr>",'<th scope="row">Data Lines</th>','<td scope="row"><%= _.escape(item.get("metadata_data_lines")) %></td>',"</tr>","<% } %>",'<% if (item.get("metadata_comment_lines")) { %>',"<tr>",'<th scope="row">Comment Lines</th>','<td scope="row"><%= _.escape(item.get("metadata_comment_lines")) %></td>',"</tr>","<% } %>",'<% if (item.get("metadata_columns")) { %>',"<tr>",'<th scope="row">Number of Columns</th>','<td scope="row"><%= _.escape(item.get("metadata_columns")) %></td>',"</tr>","<% } %>",'<% if (item.get("metadata_column_types")) { %>',"<tr>",'<th scope="row">Column Types</th>','<td scope="row"><%= _.escape(item.get("metadata_column_types")) %></td>',"</tr>","<% } %>",'<% if (item.get("message")) { %>',"<tr>",'<th scope="row">Message</th>','<td scope="row"><%= _.escape(item.get("message")) %></td>',"</tr>","<% } %>",'<% if (item.get("misc_blurb")) { %>',"<tr>",'<th scope="row">Misc. blurb</th>','<td scope="row"><%= _.escape(item.get("misc_blurb")) %></td>',"</tr>","<% } %>",'<% if (item.get("misc_info")) { %>',"<tr>",'<th scope="row">Misc. info</th>','<td scope="row"><%= _.escape(item.get("misc_info")) %></td>',"</tr>","<% } %>",'<% if (item.get("tags")) { %>',"<tr>",'<th scope="row">Tags</th>','<td scope="row"><%= _.escape(item.get("tags")) %></td>',"</tr>","<% } %>","</table>","<div>",'<pre class="peek">',"</pre>","</div>",'<% if (item.get("has_versions")) { %>',"<div>","<h3>Expired versions:</h3>","<ul>",'<% _.each(item.get("expired_versions"), function(version) { %>','<li><a title="See details of this version" href="#folders/<%- item.get("folder_id") %>/datasets/<%- item.id %>/versions/<%- version[0] %>"><%- version[1] %></a></li>',"<% }) %>","<ul>","</div>","<% } %>","</div>","</div>"].join(""))},templateVersion:function(){return _.template(['<div class="library_style_container">','<div id="library_toolbar">','<a href="#folders/<%- item.get("folder_id") %>/datasets/<%- item.id %>">','<button data-toggle="tooltip" data-placement="top" title="Go to latest dataset" class="btn btn-default primary-button toolbar-item" type="button">','<span class="fa fa-caret-left fa-lg"></span>',"&nbsp;Latest dataset","</button>","<a>","</div>",'<ol class="breadcrumb">','<li><a title="Return to the list of libraries" href="#">Libraries</a></li>','<% _.each(item.get("full_path"), function(path_item) { %>',"<% if (path_item[0] != item.id) { %>",'<li><a title="Return to this folder" href="#/folders/<%- path_item[0] %>"><%- path_item[1] %></a> </li> ',"<% } else { %>",'<li class="active"><span title="You are here"><%- path_item[1] %></span></li>',"<% } %>","<% }); %>","</ol>",'<div class="alert alert-warning">This is an expired version of the library dataset: <%= _.escape(item.get("name")) %></div>','<div class="dataset_table">','<table class="grid table table-striped table-condensed">',"<tr>",'<th scope="row" id="id_row" data-id="<%= _.escape(ldda.id) %>">Name</th>','<td><%= _.escape(ldda.get("name")) %></td>',"</tr>",'<% if (ldda.get("file_ext")) { %>',"<tr>",'<th scope="row">Data type</th>','<td><%= _.escape(ldda.get("file_ext")) %></td>',"</tr>","<% } %>",'<% if (ldda.get("genome_build")) { %>',"<tr>",'<th scope="row">Genome build</th>','<td><%= _.escape(ldda.get("genome_build")) %></td>',"</tr>","<% } %>",'<% if (ldda.get("file_size")) { %>',"<tr>",'<th scope="row">Size</th>','<td><%= _.escape(ldda.get("file_size")) %></td>',"</tr>","<% } %>",'<% if (ldda.get("date_uploaded")) { %>',"<tr>",'<th scope="row">Date uploaded (UTC)</th>','<td><%= _.escape(ldda.get("date_uploaded")) %></td>',"</tr>","<% } %>",'<% if (ldda.get("uploaded_by")) { %>',"<tr>",'<th scope="row">Uploaded by</th>','<td><%= _.escape(ldda.get("uploaded_by")) %></td>',"</tr>","<% } %>",'<% if (ldda.get("metadata_data_lines")) { %>',"<tr>",'<th scope="row">Data Lines</th>','<td scope="row"><%= _.escape(ldda.get("metadata_data_lines")) %></td>',"</tr>","<% } %>",'<% if (ldda.get("metadata_comment_lines")) { %>',"<tr>",'<th scope="row">Comment Lines</th>','<td scope="row"><%= _.escape(ldda.get("metadata_comment_lines")) %></td>',"</tr>","<% } %>",'<% if (ldda.get("metadata_columns")) { %>',"<tr>",'<th scope="row">Number of Columns</th>','<td scope="row"><%= _.escape(ldda.get("metadata_columns")) %></td>',"</tr>","<% } %>",'<% if (ldda.get("metadata_column_types")) { %>',"<tr>",'<th scope="row">Column Types</th>','<td scope="row"><%= _.escape(ldda.get("metadata_column_types")) %></td>',"</tr>","<% } %>",'<% if (ldda.get("message")) { %>',"<tr>",'<th scope="row">Message</th>','<td scope="row"><%= _.escape(ldda.get("message")) %></td>',"</tr>","<% } %>",'<% if (ldda.get("misc_blurb")) { %>',"<tr>",'<th scope="row">Miscellaneous blurb</th>','<td scope="row"><%= _.escape(ldda.get("misc_blurb")) %></td>',"</tr>","<% } %>",'<% if (ldda.get("misc_info")) { %>',"<tr>",'<th scope="row">Miscellaneous information</th>','<td scope="row"><%= _.escape(ldda.get("misc_info")) %></td>',"</tr>","<% } %>",'<% if (item.get("tags")) { %>',"<tr>",'<th scope="row">Tags</th>','<td scope="row"><%= _.escape(item.get("tags")) %></td>',"</tr>","<% } %>","</table>","<div>",'<pre class="peek">',"</pre>","</div>","</div>","</div>"].join(""))},templateModifyDataset:function(){return _.template(['<div class="library_style_container">','<div id="library_toolbar">','<button data-toggle="tooltip" data-placement="top" title="Cancel modifications" class="btn btn-default toolbtn_cancel_modifications primary-button toolbar-item" type="button">','<span class="fa fa-times"></span>',"&nbsp;Cancel","</button>",'<button data-toggle="tooltip" data-placement="top" title="Save modifications" class="btn btn-default toolbtn_save_modifications primary-button toolbar-item" type="button">','<span class="fa fa-floppy-o"></span>',"&nbsp;Save","</button>","</div>",'<ol class="breadcrumb">','<li><a title="Return to the list of libraries" href="#">Libraries</a></li>','<% _.each(item.get("full_path"), function(path_item) { %>',"<% if (path_item[0] != item.id) { %>",'<li><a title="Return to this folder" href="#/folders/<%- path_item[0] %>"><%- path_item[1] %></a> </li> ',"<% } else { %>",'<li class="active"><span title="You are here"><%- path_item[1] %></span></li>',"<% } %>","<% }); %>","</ol>",'<div class="dataset_table">','<table class="grid table table-striped table-condensed">',"<tr>",'<th class="dataset-first-column" scope="row" id="id_row" data-id="<%= _.escape(item.get("ldda_id")) %>">Name</th>','<td><input class="input_dataset_name form-control" type="text" placeholder="name" value="<%= _.escape(item.get("name")) %>"></td>',"</tr>","<tr>",'<th scope="row">Data type</th>',"<td>",'<span id="dataset_extension_select" class="dataset-extension-select" />',"</td>","</tr>","<tr>",'<th scope="row">Genome build</th>',"<td>",'<span id="dataset_genome_select" class="dataset-genome-select" />',"</td>","</tr>","<tr>",'<th scope="row">Size</th>','<td><%= _.escape(item.get("file_size")) %></td>',"</tr>","<tr>",'<th scope="row">Date uploaded (UTC)</th>','<td><%= _.escape(item.get("date_uploaded")) %></td>',"</tr>","<tr>",'<th scope="row">Uploaded by</th>','<td><%= _.escape(item.get("uploaded_by")) %></td>',"</tr>",'<tr scope="row">','<th scope="row">Data Lines</th>','<td scope="row"><%= _.escape(item.get("metadata_data_lines")) %></td>',"</tr>",'<th scope="row">Comment Lines</th>','<% if (item.get("metadata_comment_lines") === "") { %>','<td scope="row"><%= _.escape(item.get("metadata_comment_lines")) %></td>',"<% } else { %>",'<td scope="row">unknown</td>',"<% } %>","</tr>","<tr>",'<th scope="row">Number of Columns</th>','<td scope="row"><%= _.escape(item.get("metadata_columns")) %></td>',"</tr>","<tr>",'<th scope="row">Column Types</th>','<td scope="row"><%= _.escape(item.get("metadata_column_types")) %></td>',"</tr>","<tr>",'<th scope="row">Message</th>','<td scope="row"><%= _.escape(item.get("message")) %></td>',"</tr>","<tr>",'<th scope="row">Misc. blurb</th>','<td scope="row"><%= _.escape(item.get("misc_blurb")) %></td>',"</tr>","<tr>",'<th scope="row">Misc. information</th>','<td><input class="input_dataset_misc_info form-control" type="text" placeholder="info" value="<%= _.escape(item.get("misc_info")) %>"></td>',"</tr>",'<% if (item.get("tags")) { %>',"<tr>",'<th scope="row">Tags</th>','<td scope="row"><%= _.escape(item.get("tags")) %></td>',"</tr>","<% } %>","</table>","<div>",'<pre class="peek">',"</pre>","</div>","</div>","</div>"].join(""))},templateDatasetPermissions:function(){return _.template(['<div class="library_style_container">','<div id="library_toolbar">','<a href="#folders/<%- item.get("folder_id") %>/datasets/<%- item.id %>">','<button data-toggle="tooltip" data-placement="top" title="Go back to dataset" class="btn btn-default primary-button toolbar-item" type="button">','<span class="fa fa-file-o"></span>',"&nbsp;Dataset Details","</button>","<a>","</div>",'<ol class="breadcrumb">','<li><a title="Return to the list of libraries" href="#">Libraries</a></li>','<% _.each(item.get("full_path"), function(path_item) { %>',"<% if (path_item[0] != item.id) { %>",'<li><a title="Return to this folder" href="#/folders/<%- path_item[0] %>"><%- path_item[1] %></a> </li> ',"<% } else { %>",'<li class="active"><span title="You are here"><%- path_item[1] %></span></li>',"<% } %>","<% }); %>","</ol>",'<h1>Dataset: <%= _.escape(item.get("name")) %></h1>','<div class="alert alert-warning">',"<% if (is_admin) { %>","You are logged in as an <strong>administrator</strong> therefore you can manage any dataset on this Galaxy instance. Please make sure you understand the consequences.","<% } else { %>","You can assign any number of roles to any of the following permission types. However please read carefully the implications of such actions.","<% } %>","</div>",'<div class="dataset_table">',"<h2>Library-related permissions</h2>","<h4>Roles that can modify the library item</h4>",'<div id="modify_perm" class="modify_perm roles-selection"></div>','<div class="alert alert-info roles-selection">User with <strong>any</strong> of these roles can modify name, metadata, and other information about this library item.</div>',"<hr/>","<h2>Dataset-related permissions</h2>",'<divclass="alert alert-warning">Changes made below will affect <strong>every</strong> library item that was created from this dataset and also every history this dataset is part of.</div>','<% if (!item.get("is_unrestricted")) { %>','<p>You can <span class="remove-restrictions"><a>remove all access restrictions</a></span> on this dataset.</p>',"<% } else { %>",'<p>You can <span class="make-private"><a>make this dataset private</a></span> to you.</p>',"<% } %>","<h4>Roles that can access the dataset</h4>",'<div id="access_perm" class="access_perm roles-selection"></div>','<div class="alert alert-info roles-selection">',"User has to have <strong>all these roles</strong> in order to access this dataset."," Users without access permission <strong>cannot</strong> have other permissions on this dataset."," If there are no access roles set on the dataset it is considered <strong>unrestricted</strong>.","</div>","<h4>Roles that can manage permissions on the dataset</h4>",'<div id="manage_perm" class="manage_perm roles-selection"></div>','<div class="alert alert-info roles-selection">',"User with <strong>any</strong> of these roles can manage permissions of this dataset. If you remove yourself you will loose the ability manage this dataset unless you are an admin.","</div>",'<button data-toggle="tooltip" data-placement="top" title="Save modifications made on this page" class="btn btn-default toolbtn_save_permissions primary-button" type="button">','<span class="fa fa-floppy-o"></span>',"&nbsp;Save","</button>","</div>","</div>"].join(""))},templateBulkImportInModal:function(){return _.template(["<div>",'<div class="library-modal-item">',"Select history: ",'<select id="dataset_import_single" name="dataset_import_single" style="width:50%; margin-bottom: 1em; " autofocus>',"<% _.each(histories, function(history) { %>",'<option value="<%= _.escape(history.get("id")) %>"><%= _.escape(history.get("name")) %></option>',"<% }); %>","</select>","</div>",'<div class="library-modal-item">',"or create new: ",'<input type="text" name="history_name" value="" placeholder="name of the new history" style="width:50%;">',"</input>","</div>","</div>"].join(""))}});return{LibraryDatasetView:e}});
//# sourceMappingURL=../../../maps/mvc/library/library-dataset-view.js.map