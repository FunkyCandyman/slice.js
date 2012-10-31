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
        case 'resume': self.UploadWorker.resume();
            break;
        case 'cancel': self.UploadWorker.cancel();
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

    // This is the encryptor object, which enables us to use progressive encryption
    encryptor: null,

    ///
    // Methods
    ///
    initialize: function (data) {
        //TODO: implement
        // Assign variable values
        this.file = data.file;

        // Call method to calculate all the chunks properties
        this.calculateChunks();

        importScripts('/assets/crypto-js.js');

        // Initialize the encryptor object with test data
        // TODO: Implement methods to use randomly generated or user-passed encryption parameters
        var encryptionKey = CryptoJS.enc.Utf8.parse("MyPrettyrandomPassword 123");
        var encryptionIv = CryptoJS.enc.Utf8.parse("qrhouIHiuw3r23/8uh )");
        var encryptionSalt = CryptoJS.enc.Utf8.parse("LapsSwu3%$76uahw");

        this.encryptor = CryptoJS.algo.AES.createEncryptor(encryptionKey, 
                            {
                                iv: encryptionIv,
                                salt: encryptionSalt
                            }
        );
    },

    start: function () {
        //TODO: implement
    },

    pause: function () {
        //TODO: implement
    },

    resume: function() {

    },

    cancel: function () {
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

        var new_chunk = new this.Chunk(this.encryptor, this.file, i - 1, start, end);

        this.chunks.push(new_chunk);
    }

    // check whether the files size is not a multiple of the chunk size and calculate
    //  a chunk for the rest in the case, there is some leftover  
    if(chunk_count * chunk_size < this.file.size) {
        var new_chunk = new this.Chunk(this.encryptor, this.file, this.chunks.length,
                (chunk_count * chunk_size),
                this.file.size - 1);

        this.chunks.push(new_chunk);
    }
};

// Represents a files' chunk that gets encrypted and uploaded
self.UploadWorker.Chunk = function(encryptor, file, id, start, end) {
    this.file = file;
    this.file_id = id;

    this.startIndex = start;
    this.endIndex = end;

    this.encryptor = encryptor;
    this.data = null;

    this.status = self.states.INITIALIZED;
};

self.UploadWorker.Chunk.prototype = {
    states: {
        INITIALIZED: 1, // The chunk object has been initialized
        READ: 2,        // The chunk data has been read and is ready for encryption
        ENCRYPTED: 3,   // The chunk data is now encrypted an ready to be uploaded
        UPLOADED: 4     // The chunk has been completely processed
    }

    status: null,

    // Read the file chunks content
    read: function() {
        // TODO: implement
    },

    // Encrypt the content of the chunk
    encrypt: function() {
        // TODO: implement
    },

    // Upload the encrypted content of the chunk
    upload: function() {
        // TODO: implement    
    }
};

self.echo = function (data) {
    self.postMessage({
        command: 'echo',
        message: JSON.stringify({data:data})
    });
};
