(function ($, root) {

    var utils = {};
    root.Utils = utils;

    ///
    /// Public functions
    ///

    utils.ToggleButton = function (button, enabled) {
        enabled ? button.show() : button.hide();
    };

    utils.EndCall = function ()
    {
        //End the node.js call
        if (window.existingCall) {
            window.existingCall.close();
        }
    };


})(jQuery, window);