<?php

/**
 * @file
 * Get tweets for 'search' type rows in the 'search' table where frequency id = 0
 */

require_once($_SERVER['DOCUMENT_ROOT'] . '/config/main.conf.php');
require($_SERVER['DOCUMENT_ROOT'] . '/lib/automated_helpers.php');

$mysqli = new mysqli(DBHOST, DBUSER, DBPASS, DB);
if (mysqli_connect_error()) {
	$message = 'database error ' . mysqli_connect_errno() . ': ' . mysqli_connect_error();
	die(json_encode(array('success' => FALSE, 'code' => 10, 'message' => $message)));
}

if ($result = $mysqli->query('SELECT id, search_string, channel_id, since_id FROM search WHERE frequency_id = 0 AND type = "search"')) {
	// Call the helper to searh for and store the new tweets
	process_search_channels($mysqli, $result);
	$result->close();
}
else {
	die(date('Y-m-d H:i') . ": channel=unavailable, error=cannot get channel data from database");
}
?>
