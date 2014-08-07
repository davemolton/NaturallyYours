(function ($, root) {

    var rtcClient = {};
    root.RTCClient = rtcClient;

    //The unique Peer.js PeerId for this client
    var peerId;

    //The PeerJS peer instance
    var peer;

    //Get the utilities object off the window
    var utils = root.Utils;

    // Shim to get user media based on different browser syntax
    navigator.getWebcam = (navigator.getUserMedia ||
                           navigator.webkitGetUserMedia ||
                           navigator.mozGetUserMedia ||
                           navigator.msGetUserMedia);

       

    ///
    /// EVENT HANDLERS
    ///

    //Client attempts to call store
    $('#btnClientStartCall').on('click', function () {

        //First get audio/video stream once user allows us access to thier webcam and mic
        navigator.getWebcam({ audio: true, video: true }, function (stream) {

        //store client stream on window
        window.localStream = stream;

        //Generate new peer info for this client
        GenerateClientPeer();

        }, function () {
            console.log('error');
        });               
    });

    //Client End Call
    $('#btnClientEndCall').on('click', function () {
        //Hang up the call
        utils.EndCall();

        window.localStream.stop();

        //Hide the hangup button
        utils.ToggleButton($('#btnClientStartCall'), true);
        utils.ToggleButton($('#btnClientEndCall'), false);

    });

    ///
    /// Private Functions
    ///

    //post the unique peer id of this client to the server
    function sendPeerInfo() {
        //Post client info to node server
        //TODO: update this url with the deployed NodeJS service url.  Use mine for testing
        $.ajax({
            url: 'http://dmolton.noip.me:1337',
            data: { 'id': peerId },
            type: 'POST'
        });
    }

    //Get a new PeerJS Peer and hook up event handlers
    function GenerateClientPeer() {
      
        //Generate a new Peer.js client peer connection
        peer = root.RTCPeer.GeneratePeer();

        //Set the peer id for this client
        peer.on('open', function () {
            peerId = peer.id;
            //Send the peer info to server.  Attempt to make call
            sendPeerInfo();
        });

        //answer automatically.  Calls will come from the store to the client when store accepts the request
        peer.on('call', function (call) {
            call.answer(window.localStream)
            StartCall(call);
        });
    }
    
    //Begin streaming
    function StartCall(call) {

        if (window.existingCall) {
            window.existingCall.close();
        }

        //start streaming when ready
        call.on('stream', function (stream) {
            $('#guestVideo').prop('src', URL.createObjectURL(stream));
            utils.ToggleButton($('#btnClientStartCall'), false);
            utils.ToggleButton($('#btnClientEndCall'), true);
        });

        //Store ended the call. Cleanup here
        call.on('close', function () {
            window.localStream.stop();
            $('#guestVideo').prop('src', "");
            utils.ToggleButton($('#btnClientStartCall'), true);
            utils.ToggleButton($('#btnClientEndCall'), false);
        });

        window.existingCall = call;
    }
 
})(jQuery, window);

/// <reference path="js/vendor/peer.js" />