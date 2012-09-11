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
        case 'initialize': self.UploadWorker.initialize(data.message);
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
    // Here all settings should be stored, that we retrieve from the server or get for initialization
    settings: {
        chunk_size: 1024 * 1024 * 5
    },

    // The file we want to upload
    file: null,

    // Here all file chunk objects are stored
    chunks: [],

    ///
    // Methods
    ///
    initialize: function (data) {
        //TODO: implement
        // Assign variable values
        this.file = data.file;

        // Call method to calculate all the chunks properties
        this.calculateChunks();
    },

    start: function () {
        //TODO: implement
    },

    pause: function () {
        //TODO: implement
    },

    stop: function () {
        //TODO: implement
    }
};

// calculate the chunks start and end indices and put them in this.chunks
self.UploadWorker.calculateChunks = function() {
    var chunk_size = this.settings.chunk_size;
    var chunk_count = Math.floor(this.file.size / chunk_size);

    for(var i = 1; i <= chunk_count; i++) {
        var start = (i - 1) * chunk_size;
        var end = (i * chunk_size) - 1;

        var new_chunk = new this.Chunk(this.file, start, end);

        this.chunks.push(new_chunk);
    }

    // check whether the files size is not a multiple of the chunk size and calculate
    //  a chunk for the rest in the case, there is some leftover  
    if(chunk_count * chunk_size < this.file.size) {
        var new_chunk = new this.Chunk(this.file,
                (chunk_count * chunk_size),
                this.file.size - 1);

        this.chunks.push(new_chunk);
    }
};

self.UploadWorker.Chunk = function(file, start, end) {
    this.file = file;

    this.startIndex = start;
    this.endIndex = end;
};


self.echo = function (data) {
    self.postMessage({
        command: 'echo',
        message: JSON.stringify({data:data})
    });
};
