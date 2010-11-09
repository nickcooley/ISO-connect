<?php

/**
 * @file
 * Get tweets for 'list' type rows in the 'search' table where frequency id = 1
 */

require_once($_SERVER['DOCUMENT_ROOT'] . '/config/main.conf.php');
require($_SERVER['DOCUMENT_ROOT'] . '/lib/automated_helpers.php');
require($_SERVER['DOCUMENT_ROOT'] . '/lib/twitoauth/twitteroauth.php');

$mysqli = new mysqli(DBHOST, DBUSER, DBPASS, DB);
if (mysqli_connect_error()) {
	$message = 'database error ' . mysqli_connect_errno() . ': ' . mysqli_connect_error();
	die(json_encode(array('success' => FALSE, 'code' => 10, 'message' => $message)));
}

// TODO die if the connection doesn't work
$twitterOauth = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET, APP_OA_TOKEN, APP_OA_TOKEN_SECRET);
$twitterOauth->decode_json = TRUE;

if ($result = $mysqli->query('SELECT id, search_string, channel_id, since_id FROM search WHERE frequency_id = 1 AND type = "list"')) {
	// Call the helper to searh for and store the new tweets
	process_list_channels($mysqli, $twitterOauth, $result);
	$result->close();
}
else {
	die(date('Y-m-d H:i') . ": channel=unavailable, error=cannot get channel data from database");
}
?>
