<?php

/**
 * @file
 * For any attendees without uid's, use their screen_name to get their UID from twitter
 */

require_once('../config/main.conf.php');
require('../lib/helpers.php');
require('../lib/twitrest/twitterrest.php');

$mysqli = new mysqli(DBHOST, DBUSER, DBPASS, DB);
if (mysqli_connect_error()) {
	$message = 'database error ' . mysqli_connect_errno() . ': ' . mysqli_connect_error();
	die(json_encode(array('success' => FALSE, 'code' => 10, 'message' => $message)));
}

$twitterRest = new TwitterRest();
$twitterRest->decode_json = TRUE;

$i = 0;
if ($stmt = $mysqli->prepare("UPDATE attendee SET uid = ? WHERE screen_name = ?")) {
	if ($result = $mysqli->query('SELECT screen_name from attendee WHERE uid IS NULL')) {
		$users = array();
		while ($obj = $result->fetch_object()) {
			$user = $twitterRest->get('users/show', array('screen_name' => $obj->screen_name));
			$stmt->bind_param('ds', $user->id, $obj->screen_name);
			if ($stmt->execute()) {
				$i++;
			}
			print $obj->screen_name . ': ' . $user->id . "\r\n";
		}
		$stmt->close(); 
		$result->close();
	}
	else {
		$message = 'database error ' . $mysqli->error;
		die(json_encode(array('success' => FALSE, 'code' => 10, 'message' => $message)));
	}
}
print "Added {$i} uids\r\n";
?>
