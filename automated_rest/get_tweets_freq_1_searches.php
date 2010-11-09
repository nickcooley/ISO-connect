<?php

/**
 * @file
 * Get tweets for 'search' type rows in the 'search' table where frequency id = 1
 */

require_once('/var/www/config/main.conf.php');
require('/var/www/lib/automated_helpers.php');

$mysqli = new mysqli(DBHOST, DBUSER, DBPASS, DB);
if (mysqli_connect_error()) {
	$message = 'database error ' . mysqli_connect_errno() . ': ' . mysqli_connect_error();
	die(json_encode(array('success' => FALSE, 'code' => 10, 'message' => $message)));
}

if ($result = $mysqli->query('SELECT id, search_string, channel_id, since_id FROM search WHERE frequency_id = 1 AND type = "search"')) {
	// Call the helper to searh for and store the new tweets
	process_search_channels($mysqli, $result);
	$result->close();
}
else {
	die(date('Y-m-d H:i') . ": channel=forrester, error=cannot get channel data from database");
}
?>
