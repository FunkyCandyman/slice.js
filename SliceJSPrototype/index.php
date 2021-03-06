<!doctype html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />
    <title>Slice JS Prototype</title>
    <script type="text/javascript" src="assets/slice.js"></script>
    <script type="text/javascript">
        window.addEventListener('load', function () {
        // initialize upload handler
            document.forms[0].addEventListener('submit', handleOnSubmit, false);
        }, false);

        var uploader;

        function handleOnSubmit(evt) {
            var file = document.getElementById('file_selector').files[0];

            var options = {
                ticket: "blubb",
                chunk_size: 1024 * 1024
            };

            uploader = new SliceJS.Uploader(file, options);
            uploader.start();
        }

    </script>
    <!--<script type="text/javascript" src="/assets/crypto-js.js"></script>-->
    <script type="text/javascript" src="assets/crypto-js/aes.js"></script>
</head>
<body>
    <h1>Uploads#index</h1>
    <p>Find me in app/views/uploads/index.html.erb</p>

    <form action="javascript:void(0);" method="POST" enctype="multipart/form-data">
        <input type="file" id="file_selector" name="file" /><br />
        <input type="submit" value="Start!" id="submit_button" />
    </form>
</body>
</html>
