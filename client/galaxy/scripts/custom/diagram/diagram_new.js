var Diagram = function(id){
  var value = null;

  function getValue() {
    alert('getValue');
    return value;
  }

  function setValue(newValue) {
    alert('setValue');
    value = newValue;
  }

  return {
    getValue:getValue,
    setValue:setValue
  }
}
