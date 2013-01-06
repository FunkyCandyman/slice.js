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

    // Here all file chunk objects are stored
    chunks: [],

    // This is the container object, where the encryption data is stored
    encryptionOptions: null,

    // The file we want to upload
    file: null,

    // 
    uploadTicket: null,

    ///
    // Methods
    ///
    initialize: function (data) {
        //TODO: implement
        // import crypto library
        importScripts('/assets/crypto-js/aes.js');
        importScripts('/assets/FormData.js');

        // Assign variable values
        this.file = data.file;

        // TODO: remove testdata and implement routines to get this data from anywhere else
        // Use testdata for encryption and upload
        this.encryptionKey = CryptoJS.enc.Utf8.parse("MyPrettyran|)omPasswörd 123");
        this.uploadTicket = 'q8PiEId8FNsL';

        // TODO: Add some facilities for setting other options too
        this.encryptionOptions = {
            
        };

        // Call method to calculate all the chunks properties
        this.calculateChunks();

        
    },

    start: function () {
        //TODO: implement
        for(var i = 0; i < this.chunks.length; i++) {
            var chunk = this.chunks[i];
            chunk.read();
            chunk.encrypt();
            chunk.upload();
        }
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

        var new_chunk = new Chunk(this.file, i - 1, start, end, this.encryptionKey, this.encryptionOptions);

        this.chunks.push(new_chunk);
        self.log(['neu', this.chunks[i-1].encryptionOptions.iv]);
    }

    // check whether the files size is not a multiple of the chunk size and calculate
    //  a chunk for the rest in the case, there is some leftover  
    if(chunk_count * chunk_size < this.file.size) {
        var new_chunk = new Chunk(this.file, this.chunks.length,
                (chunk_count * chunk_size),
                this.file.size - 1, this.encryptionKey, this.encryptionOptions);

        this.chunks.push(new_chunk);
        self.log(['neu', new_chunk.encryptionOptions.iv]);
    }
};

// Represents a files' chunk that gets encrypted and uploaded
self.Chunk = function(file, id, start, end, encryption_key, encryption_options) {
    this.file = file;
    this.sliceId = id;

    this.startIndex = start;
    this.endIndex = end;

    this.data = null;
 
    this.encryptionKey = encryption_key;

    this.encryptionOptions = { /*empty object*/ };
    this.encryptionOptions.mode = CryptoJS.mode.CBC;
    this.encryptionOptions.padding = CryptoJS.pad.Pkcs7;
    this.encryptionOptions.iv = CryptoJS.lib.WordArray.random(128 / 8);
    this.encryptionOptions.salt = CryptoJS.lib.WordArray.random(128 / 8);

    this.status = this.states.INITIALIZED;

    // self.log(['Uploadworker.Chunk()', encryption_options]);
};

self.Chunk.prototype = {
    encryptionKey: null,

    encryptionOptions: {
        // mode: CryptoJS.mode.CBC
        // padding: CryptoJS.pad.Pkcs7
        // iv: CryptoJS.lib.WordArray.random(128/8)
        // salt: CryptoJS.lib.WordArray.random(128/8)
    },

    states: {
        INITIALIZED: 1, // The chunk object has been initialized
        READ: 2,        // The chunk data has been read and is ready for encryption
        ENCRYPTED: 3,   // The chunk data is now encrypted an ready to be uploaded
        UPLOADED: 4     // The chunk has been completely processed
        // TODO: add "ERROR: 666"
    },

    status: null,

    // Read the file chunks content
    read: function() {
        // TODO: extend
        if(this.status != this.states.INITIALIZED) {
            this.statusError('Chunk.read()', 'Trying to read data, but status is not INITIALIZED!', this.status);
        }

        // TODO: add browser engine prefixes for compatibility when needed (e.g. Safari: webkitSlice)
        var slice = this.file.slice(this.startIndex, this.endIndex);

        // Set the MIME-type of the data url; this makes it easier to detect the MIME-type while not letting us store additional data (encrypted in database or so)
        slice.type = this.file.type;

        var reader = new FileReaderSync();

        this.data = reader.readAsDataURL(slice);

        // File has successfully been read; set status
        this.status = this.states.READ;
        self.log(['Chunk.read()', this.data.length]);
    },

    // Encrypt the content of the chunk
    encrypt: function() {
        // TODO: extend
        if(this.status != this.states.READ) {
            this.statusError('Chunk.encrypt()', 'Trying to encrypt data, but status is not READ!', this.status);
        }

        var encrypted_data = CryptoJS.AES.encrypt(this.data,
                                                  this.encryptionKey,
                                                  this.encryptionOptions
                                                 ).toString();
        this.data = new SliceJSFormData();

self.log(['Chunk.encrypt()', 'md5-Hash', CryptoJS.MD5(encrypted_data).toString()]);

        encrypted_data = new Blob( [encrypted_data] );

        // Construct form data object for upload
        // TODO: eventually move this functionality to a separate method
        this.data.append('upload_ticket', self.UploadWorker.uploadTicket); // TODO: remove quick&dirty hack to get uploadTicket
        this.data.append('encrypted_chunk', encrypted_data, 'slice.' + this.sliceId + '.enc'); // TODO: use a different file names
        this.data.append('encryption_iv', this.encryptionOptions.iv.toString());
        this.data.append('encryption_salt', this.encryptionOptions.salt.toString());

        // The read data has successfully been encryptet; set status
        this.status = this.states.ENCRYPTED;
        // self.log(['Chunk.encrypt()', this]);
    },

    // Upload the encrypted content of the chunk
    upload: function() {
        // TODO: extend
        if(this.status != this.states.ENCRYPTED) {
            this.statusError('Chunk.upload()', 'Trying to upload data, but status is not ENCRYPTED - will not upload unencrypted data!', this.status);
        }

        var xhr2 = new XMLHttpRequest();

        // TODO: use dynamically generated URL for uploading the chunk (use URL pattern)
        // TODO: add username (TicketID) + password for authentication
        xhr2.open('POST', '/upload_chunk.php', true);

        xhr2.onload = function(evt) {
            self.log(['Chunk.upload()', 'xhr2.onload()', evt]);
        };

        xhr2.upload.onprogress = function(evt) {
            self.log(['Chunk.upload()', 'xhr2.upload.onprogress()', evt]);
        };

        var content_type_header_value = 'multipart/form-data; boundary=' + this.data.getBoundary();
        xhr2.setRequestHeader('Content-Type', content_type_header_value);

        this.data = this.data.toBlob();
        xhr2.send(this.data);

        this.status = this.states.UPLOADED;
        self.log(['Chunk.upload()', this.data.size]);
    },

    statusError: function(method, message, status) {
        self.log(
            {
                'method': method,
                'message': message,
                'status': status
            });
    }
};

self.log = function (data) {
    self.postMessage({
        command: 'log',
        message: JSON.stringify({data:data})
    });
};
