// This is a partwise implementation of the FormData "class" for WebWorkers

// Constructor
self.SliceJSFormData = function() {
    this.data = new Blob();

    // TODO: remove static boundary string
    // this.boundary = this._generateBoundary();
    this.boundary = "----WebKitFormBoundaryp7RLQscVtfBzlXIE";

    this.lineSeparator = "\r\n";
};

self.SliceJSFormData.prototype = {
    // This property contains the boundary string
    boundary: null,

    // This property contains the form data
    data: null,

    // This property contains the line separator for submitting the form data
    lineSeparator: null,

    append: function(name, value, filename) {
        if(value instanceof Blob) {
            var new_file_name = filename || 'blob';
            var new_data_string = '--' + this.boundary + this.lineSeparator;
            new_data_string += 'Content-Disposition: form-data; name="' + name + '"; filename="' + new_file_name + '"' + this.lineSeparator;
            new_data_string += 'Content-Type: ' + 'application/octet-stream' + this.lineSeparator;
            new_data_string += this.lineSeparator;

            this.data = new Blob( [this.data, new_data_string, value, this.lineSeparator]);
        } else {
            var new_data_string = '--' + this.boundary + this.lineSeparator;
            new_data_string += 'Content-Disposition: form-data; name="' + name + '"' + this.lineSeparator;
            new_data_string += this.lineSeparator;
            new_data_string += value + this.lineSeparator;

            this.data = new Blob( [this.data, new_data_string] );
        }
    },

    toBlob: function() {
        var finalization = '--' + this.boundary + '--' + this.lineSeparator;
        return new Blob( [this.data, finalization] );
    },

    _generateBoundary: function() {
        const BASE = '----SliceJSFormBoundary';
        const EXTENSION = (Math.random()).toString(36);

        return BASE + EXTENSION;
    }
};

// Content-Type: multipart/form-data; boundary=----WebKitFormBoundaryePkpFF7tjBAqx29L
// <other headers>

// ------WebKitFormBoundaryePkpFF7tjBAqx29L
// Content-Disposition: form-data; name="MAX_FILE_SIZE"

// 100000
// ------WebKitFormBoundaryePkpFF7tjBAqx29L
// Content-Disposition: form-data; name="uploadedfile"; filename="hello.o"
// Content-Type: application/x-object

// <file data>
// ------WebKitFormBoundaryePkpFF7tjBAqx29L--