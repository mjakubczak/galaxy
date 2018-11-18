var FormParser = function(filePath) {

  var json = "";
  loadFile(filePath);
  initPrototypes();
  
  function initPrototypes() {
    if (!String.prototype.startsWith) {
      String.prototype.startsWith = function(searchString, position) {
        position = position || 0;
        return this.indexOf(searchString, position) === position;
      };
    }
  }
  
  function loadFile(filepath) {
    $.ajax({
        url: filepath,
        success: function (result) {
            if (result.isOk == false) 
              alert(result.message);
            else {
              json = result;
            }
        },
        async: false
    });
  }
  
  function setBehavior() {
    $( document ).ready(function() {
      // Show/hide optional forms
      $( ".selectWrapper > select" ).each(function() {
        showHideOptionalForms(this);
      });
      $( ".selectWrapper > select" ).change(function() {
        showHideOptionalForms(this);
      });
    });
  }
  
  // Generate JSON from form inputs
  function formToJSON() {
    var params = {};
    var attrNames = [];
    $(".formElement").each(function() {
      var name = $(this).attr('name');
      var value = getValue(this);
      var parametrized = $(this).hasClass('parametrized');
      attrNames.push({name:name, value:value, isParametrized:parametrized});
    }); 
    
    setParams(params, attrNames);
    
    function setParams(params, attrs) {
      for(var i=0; i<attrs.length; i++) {
        var attr = attrs[i];
        if(isDirectChild(attr.name)) {
          if(attr.isParametrized) {
            params[attr.name] = {value:attr.value, params:{}}
            findSubforms(params, attrs, attr);
          } else {
            params[attr.name] = attr.value;
          }
        }
      }
    }
    
    function isDirectChild(name) { 
      return name.split('.').length == 1; 
    }
    
    function findSubforms(params, attrs, attr) {
      var subAttrs = [];
      var prefix = attr.name + '.' + attr.value;
      for(var i=0; i<attrs.length; i++) {
        var name = attrs[i].name;
        if(name.startsWith(prefix)) {
          var newName = name.substring(prefix.length + 1);
          subAttrs.push({name:newName, value:attrs[i].value, isParametrized:attrs[i].isParametrized});
        }
      }
      setParams(params[attr.name].params, subAttrs);
    }
    return JSON.stringify(params);
  }
  
  function getValue(input) {
    if($(input).attr('type') == 'checkbox') {
      return $(input).is(':checked');
    } else {
      return $(input).val();
    }
  }
  
  function showHideOptionalForms(node) {
    var selected = "";
    $(node).find("option:selected").each(function() {
      selected = $(this).attr('value');
    });
    var directOptionalForms = "> div.optionalForm";
    $(node).parent().find(directOptionalForms).each(function() {
      var name = $(this).attr('name');
      if(name == selected) {
        $(this).css('display','block');
      } else {
        $(this).css('display','none');
      }
    });
  }

  function getForm(name) {
    var result = '<div class="formWrapper">';
    result += '<h1>' + json.forms[name].label + '</h1>';
    result += '<input type="hidden" class="formElement" id="formElem_type" name="type" value="' + name + '">';
    var formElements = arrayOrEmpty(json.forms[name].elements);
    var comonElements = arrayOrEmpty(json.each.elements);
    var elements = comonElements.concat(formElements);
    for(var i=0; i<elements.length; i++) {
      result += parseFormElement(elements[i], elements[i].name);
    }
    result += '<button id="btnDiagramSettingsOK">OK</button>';
    result += '</div>';
    return result;
  }

  function setValues(values) {
    doSetValues(values, 'formElem_'); 
  }
  
  function doSetValues(values, prefix) {    
    for (var key in values) {
      if (values.hasOwnProperty(key)) {
        var node = values[key];
        if(node.hasOwnProperty('params')) {
          var newPrefix = prefix + key + '.' + node.value + '.';
          setValue(prefix+key, values[key].value, true);
          doSetValues(node.params, newPrefix);
        } else if(key != 'value') {
          setValue(prefix+key, values[key], false);
        }
      }
    }
  }
  
  function setValue(id, value, isSelect) {
    var selector = '[id="'+id+'"]';
    var elem = $(selector);
    if(isSelect) {
      $(selector + ' option[value=' + value + ']').prop('selected', true);
    } else {
      if(elem.attr('type') == 'checkbox' ) {
        elem.prop('checked', value);
      } else if(elem.attr('type') == 'text') {
        $(selector).val(value);
      }
    }
  }
  
  function arrayOrEmpty(array) {
    return array == undefined ? [] : array;
  }
  
  function parseFormElement(element, name) {
    var formElement = "<h2>"+element.label+"</h2>";
    var type = element.type;
    if (type == "select") {
      formElement += parseSelect(element, name);
    } else if (type == "integer") {
      formElement += parseIntegerField(name);
    } else if (type == "text") {
      formElement += parseTextField(name);
    } else if (type == "float") {
      formElement += parseFloatField(name);
    } else if (type == "boolean") {
      formElement += parseBooleanField(name);
    }
    formElement += "<br>";
    return formElement;
  }

  function parseSelect(element, name) {
    var select = '<div class="selectWrapper" name="' + element.name + '">';
    select += '<select class="formElement parametrized" id="formElem_' + name + '" name=' + name + '>';
    var options = element.options;
    for(var i=0; i<options.length; i++) {
      var option = options[i];
      select += '<option value="' + option.value + '">' + option.label + "</option>\n";
    }
    select += '</select>';
    select += parseSubform(options, element, name);
    select += '</div>';
    return select;
  }
  
  function parseTextField(name) {
    return '<input type="text" class="formElement" id="formElem_' + name + '" name="' + name + '">';
  }
  
  function parseIntegerField(name) {
    return '<input type="text" class="formElement" id="formElem_' + name + '" name="' + name + '">';
  }

  function parseFloatField(name) {
    return '<input type="text" class="formElement" id="formElem_' + name + '" name="' + name + '">';
  }

  function parseBooleanField(name) {
    return '<input type="checkbox" class="formElement" id="formElem_' + name + '" name="' + name + '">';
  }

  function parseSubform(options, element, parentName) {
    var subform = "";
    for(var i=0; i<options.length; i++) {
      var option = options[i];
      subform += '<div name="' + option.value + '" class="optionalForm">';
      if(option.form != undefined) {
        var elements = option.form.elements;
        if(elements != undefined) {
          for(var i=0; i<elements.length; i++) {
             var elementName = parentName + '.' + option.value + '.' + elements[i].name;
             subform += parseFormElement(elements[i], elementName);
          }
        }
      }
      subform += '</div>';
    }
    return subform;
  }
  
  return {
    getForm:getForm,
    setBehavior:setBehavior,
    formToJSON:formToJSON,
    setValues:setValues
  }
}
