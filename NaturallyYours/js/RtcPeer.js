(function ($, root) {

    var rtcPeer = {};
    root.RTCPeer = rtcPeer;

    ///
    /// Public Functions
    ///

    //Generate a new PeerJS Peer
    //TODO: fill this up with more stun server options.  Also research some turn servers
    rtcPeer.GeneratePeer = function () {
        var peer = new Peer
           ({
               key: "a955wkf0jzqto6r",
               debug: 3,
               config: {
                   'iceServers': [
                       { url: 'stun:stun.l.google.com:19302' },
                       { url: 'stun:stun1.l.google.com:19302' }
                   ]
               }
           });

        return peer;
    };
})(jQuery, window);