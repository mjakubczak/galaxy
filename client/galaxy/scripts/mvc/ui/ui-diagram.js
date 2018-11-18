/** Renders the color picker used e.g. in the tool form **/
define(['utils/utils'], function( Utils ) {

var View = Backbone.View.extend({
    initialize : function( options ) {
        var self = this;
        this.diagram = new Diagram( options.id );
        this.setElement( this._template( options ) );
    },

    /** Get/set value */
    value : function ( new_value ) {
        // check if new_value is defined
        if (new_value !== undefined) {
            this._setValue(new_value);
        }

        return this._getValue();
    },

    /** Get value from dom */
    _getValue: function() {
        return this.diagram.getValue();
    },

    _setValue: function(new_value) {
        this.diagram.setValue(new_value);
    },

    /** Main template */
    _template: function( options ) {
        return '<div id="' + options.id + '" class="model-diagram"></div>';
    }
});

return {
    View : View
};

});
