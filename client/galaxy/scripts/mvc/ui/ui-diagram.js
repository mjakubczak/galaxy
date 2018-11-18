/** Renders the color picker used e.g. in the tool form **/
define(['utils/utils'], function( Utils ) {
    return Backbone.View.extend({
		
        initialize : function( options ) {
            this.options = Utils.merge( options, {} );
            this.setElement( this._template() );
        },

        /** Get/set value */
        value : function ( new_val ) {
            return this._getValue();
        },

        /** Get value from dom */
        _getValue: function() {
            if (diagram != null && typeof diagram !== 'undefined') {
                return diagram.getJSON();
            }
            return "{}";
        },

        /** Main template */
        _template: function() {
            var script = '<script>$(document).ready(function() {' +
                'loadDiagram("#diagramWrapper", 1500, 1000, "/static/scripts/custom/diagram/form-def.json", "/static/style/custom/diagram/");' +
                '});' +
                '</script>';
			return  '<div id="diagramWrapper"></div>' + script;
        }
    });
});