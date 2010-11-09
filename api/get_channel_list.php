<?php

/**
 * @file
 * Gets the channel list
 */

require_once($_SERVER['DOCUMENT_ROOT'] . '/config/main.conf.php');
require($_SERVER['DOCUMENT_ROOT'] . '/lib/helpers.php');

$mysqli = new mysqli(DBHOST, DBUSER, DBPASS, DB);
if (mysqli_connect_error()) {
	$message = 'database error ' . mysqli_connect_errno() . ': ' . mysqli_connect_error();
	die(json_encode(array('success' => FALSE, 'code' => 10, 'message' => $message)));
}

// Loop through each channel in the 'search' table
if ($result = $mysqli->query('SELECT name, id from channel ORDER BY id ASC')) {
	$channels = array();
	while ($obj = $result->fetch_object()) {
		$channels[] = array('cid' => (int)$obj->id, 'name' => $obj->name);
	}

	$categories = array('categories' => $channels);
	print to_json($categories);
	$result->close();
}
else {
	$message = 'database error ' . $mysqli->error;
	die(json_encode(array('success' => FALSE, 'code' => 10, 'message' => $message)));
}
?>
