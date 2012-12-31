var SliceJS = {
    Uploader: function (file, options) {
        //TODO: implement

        // create new worker
        this.worker = new Worker('/assets/upload_worker.js?' + Math.random());

        // register messageHandler as listener for the message event on the worker
        // this is a little hack to recover the right this-context in the messageHandler method
        var _this = this;
        function handleMessage(evt) {
            _this.messageHandler.call(_this, evt);
        }
        this.worker.addEventListener('message', handleMessage, false);

        // send initialize message to the webworker
        this.executeCommand('initialize', {
            file: file,
            options: options
        });
    },

    Downloader: function () {
        console.log('TODO: create new downloader object');
    }
};

SliceJS.Uploader.prototype = {
    worker: null,

    executeCommand: function (cmd, msg) {
        this.worker.postMessage({
            command: cmd,
            message: msg
        });
    },

    start: function() {
        //TODO implement
        this.executeCommand('start', null);
    },

    pause: function() {
        //TODO implement
    },

    resume: function() {
        //TODO implement
    },

    cancel: function() {
        //TODO implement
    },

    messageHandler: function (evt) {
        var data = evt.data;

        switch(data.command) {
            case 'progress': this.progress(data.message);
                break;
            case 'dl': console.log(data.message);
                break;
            default: this.messageHandlers.log(data.message);
               break;
        }

        evt.stopPropagation();
    },

    messageHandlers: {
        log: function(msg) {
            console.log(msg);
        }
    }
};

// SliceJS.Uploader.prototype.messageHandlers = {
//     echo: function (msg) {
//         console.log(msg);
//     }
// };

/*
SliceJS.Uploader.prototype.fetchTicket =  function () {
    //TODO: implement
    return "RandomTicketString";
};
*/