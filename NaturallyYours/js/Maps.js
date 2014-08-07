(function ($, root) {

    var updatedAlready = false;
    var Map = {};
    root.GMap = Map;

    //
    //Public Functions
    //

    Map.Update = function () {
        if (!updatedAlready) {
            var map = $('iframe');            
            var src = 'https://www.google.com/maps/embed/v1/place?key=AIzaSyAxoSv5WhaKc9LlLy7R7nFSfJprpVkmMTI&q=Naturally+Yours,Jim+Thorpe+PA&zoom=19';
            map.attr('src', src);
            updatedAlready = true;
        }
    };
})(jQuery, window);
