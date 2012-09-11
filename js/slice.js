var SliceJS = {
    Uploader: function (file, options) {
        //TODO: implement

        // create new worker
        this.worker = new Worker('/assets/upload_worker.js');

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

// the webworker attribute for uploading
SliceJS.Uploader.prototype.worker = null;

// execute the given command on webworker side
SliceJS.Uploader.prototype.executeCommand = function (cmd, msg) {
    this.worker.postMessage({
        command: cmd,
        message: msg
    });
};

SliceJS.Uploader.prototype.start = function () {
    //TODO implement
};

SliceJS.Uploader.prototype.stop = function () {
    //TODO implement
};

SliceJS.Uploader.prototype.pause = function () {
    //TODO implement
};

SliceJS.Uploader.prototype.resume = function () {
    //TODO implement
}

// function for handling worker messages
SliceJS.Uploader.prototype.messageHandler = function (evt) {
    var data = evt.data;

    switch(data.command) {
        case 'progress': this.progress(data.message);
            break;
        default: this.messageHandlers.echo(data.message);
            break;
    }

    evt.stopPropagation();
};

// here all handlers for the processed events are to be found
SliceJS.Uploader.prototype.messageHandlers = { };

// just logs the events message property to the console
SliceJS.Uploader.prototype.messageHandlers.echo = function (msg) {
    console.log(msg);
};


/*
SliceJS.Uploader.prototype.fetchTicket =  function () {
    //TODO: implement
    return "RandomTicketString";
};
*/