<?php

/**
 * @file
 * For any attendees without uid's, use their screen_name to get their UID from twitter
 */

require_once('../config/main.conf.php');
require('../lib/helpers.php');
require('../lib/twitrest/twitterrest.php');

check_required_get_params(array('screen_name' => 'string'));
$screen_name = $_GET['screen_name'];

$mysqli = new mysqli(DBHOST, DBUSER, DBPASS, DB);
if (mysqli_connect_error()) {
	$message = 'database error ' . mysqli_connect_errno() . ': ' . mysqli_connect_error();
	die(to_json(array('success' => FALSE, 'code' => 10, 'message' => $message)));
}

$twitterRest = new TwitterRest();
$twitterRest->decode_json = TRUE;

$i = 0;
if ($stmt = $mysqli->prepare("INSERT into attendee (screen_name, uid) values(?, ?) ON DUPLICATE KEY UPDATE uid=?")) {
	$user = $twitterRest->get('users/show', array('screen_name' => $screen_name));
	if ($user->error) {
		die(to_json(array('success' => FALSE, 'code' => 10, 'message' => $user->error)));
	}
	else {
		$stmt->bind_param('sdd', $screen_name, $user->id, $user->id);
		if (!$stmt->execute()) {
			error_log("Failed to update or add attendee: " . $mysqli->error);	
		}
		$stmt->close(); 
	}
}
print to_json(array('success' => TRUE))
?>
