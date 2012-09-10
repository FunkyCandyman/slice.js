self.addEventListener('message', function (evt) {
    // Sample data object - NOT YET IMPLEMENTED!
    // var data = { 
    //      command: 'initialize',
    //      message: {
    //          file: file2upload,
    //          mode: "freeforall",
    //          configUrl: "/uploads/config.json"
    //      }
    // }

    // var data = { 
    //      command: 'initialize',
    //      message: {
    //          file: file2upload,
    //          configUrl: "/uploads/config.json"
    //      }
    // }

    var data = evt.data;

    switch(data.command) {
        case 'initialize': self.UploadWorker.initialize(data);
            break;
        case 'start': self.UploadWorker.start();
            break;
        case 'pause': self.UploadWorker.pause();
            break;
        case 'stop': self.UploadWorker.stop();
            break;
        default: self.echo(data);
            break;
    }

}, false);

//TODO: implement self.Chunk or self.UploadWorker.Chunk

self.UploadWorker = {
    settings: {

    },

    settings: {
        }
    },

    initialize: function (data) {
        //TODO: implement
        echo(data);
    },

    start: function (data) {
        //TODO: implement
    },

    pause: function (data) {
        //TODO: implement
    },

    stop: function (data) {
        //TODO: implement
    }
};

self.echo = function (data) {
    self.postMessage({
        command: 'echo',
        message: data
    });
};