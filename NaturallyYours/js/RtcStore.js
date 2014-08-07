(function ($, root) {

    var rtcStore = {};
    root.RTCStore = rtcStore;

    // Shim to get user media based on different browser syntax
    navigator.getWebcam = (navigator.getUserMedia ||
                           navigator.webkitGetUserMedia ||
                           navigator.mozGetUserMedia ||
                           navigator.msGetUserMedia);

    var storePeer;
    var clientPeerId;
    var call;
    var socket;

    //Get the utilities object off the window
    var utils = root.Utils;

    //
    // Event Handlers
    //

    //Store Front Opens connection to web socket server and begins listening for incoming clients
    $('#btnStoreOpenConnection').on('click', function () {

        //Initialize web socket and connect to server. 
        //TODO: update this with the deployed server NodeJs socket url
        socket = io('http://dmolton.noip.me:1337/store', {'forceNew':true});

        //Generate a new PeerJs peer for the store front if needed
        storePeer = storePeer || root.RTCPeer.GeneratePeer();
        
        //Listen for incoming request
        socket.on('incomingClientRequest', function (data) {
            console.log('incoming call request from peer: ' + data);

            clientPeerId = data;

            //Show modal incoming call dialog
            $('#modalAcceptReject').modal();
        });

        //Toggle the open/close store button
        utils.ToggleButton($('#btnStoreOpenConnection'), false);
        utils.ToggleButton($('#btnStoreCloseConnection'), true);
    });

    //Close store - disconnect from socket.io 
    $('#btnStoreCloseConnection').on('click', function () {
        socket.disconnect();
        utils.ToggleButton($('#btnStoreOpenConnection'), true);
        utils.ToggleButton($('#btnStoreCloseConnection'), false);
    });

    //Accept Call Button Click
    $('#btnAcceptCall').on('click', function () {
        //Get store permission to access webcam and mic
        navigator.getWebcam({ audio: true, video: true }, function (stream) {

            //Hide the modal dialog
            $('#modalAcceptReject').modal('hide');

            //store the stores' stream on window
            window.localStream = stream;

            //The client sent us a unique peer.js id.  Call them to initiate the video session
            call = storePeer.call(clientPeerId, window.localStream);
            StartCall(call);

            //Toggle the hangup button
            utils.ToggleButton($('#btnStoreEndCall'), true);
        },
        function () {
            console.log('error');
        });
    });

    //Hang Up Button Press
    $('#btnStoreEndCall').on('click', function () {
        //Hang up the call
        utils.EndCall();

        window.localStream.stop();

        //Hide the hangup button
        utils.ToggleButton($('#btnStoreEndCall'), false);

    });


    //
    // Private Functions
    //

    //Begin streaming
    function StartCall(call) {

        //Hangup on an existing call if one is in progress
        utils.EndCall();

        //wait for stream on call 
        call.on('stream', function (stream) {
            $('#storeVideo').prop('src', URL.createObjectURL(stream));
        });

        //Client ended the call.  Cleanup on store end
        call.on('close', function () {
            window.localStream.stop();
            $('#storeVideo').prop('src', "");
            utils.ToggleButton($('#btnStoreEndCall'),false)
        });

        window.existingCall = call;
    }
})(jQuery, window);