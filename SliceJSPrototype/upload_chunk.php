<?php
    if(isset($_POST['upload_ticket']) && isset($_FILES['encrypted_chunk'])) {
        $ticket = $_POST['upload_ticket'];
        $file_dir = 'files/' . $ticket;

        // Create storage dir if it doesn't already exist
        if(!(file_exists($file_dir) && is_dir($file_dir))) {
            mkdir($file_dir);
        }

        // Check whether the storage dir was created or not
        if(file_exists($file_dir) && is_dir($file_dir)) {

        } else {
            http_response_code(500);
            echo('The storage directory doesn\'t exist and could not be created!');
        }

        move_uploaded_file($_FILES['encrypted_chunk']['tmp_name'], $file_dir . '/' . basename($_FILES['encrypted_chunk']['name']));

        echo(md5_file($file_dir . '/' . basename($_FILES['encrypted_chunk']['name'])));

        die();
    }

    var_dump($_POST);
    var_dump($_FILES);
?>
