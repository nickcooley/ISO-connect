<?php

/**
 * TODO handle mysqli prepare errors
 * @file
 * Get voices by channel
 */

require_once($_SERVER['DOCUMENT_ROOT'] . '/config/main.conf.php');
require($_SERVER['DOCUMENT_ROOT'] . '/lib/helpers.php');

check_required_get_params(array('cid' => 'numeric'));

$mysqli = new mysqli(DBHOST, DBUSER, DBPASS, DB);
if (mysqli_connect_error()) {
	$message = 'database error ' . mysqli_connect_errno() . ': ' . mysqli_connect_error();
	die(json_encode(array('success' => FALSE, 'code' => 10, 'message' => $message)));
}

$users = array();

$chanzero_op = ($_GET['cid'] == 0) ? 'OR' : 'AND';
$chanzero = ($_GET['cid'] == 0) ? 'OR screen_name IN (SELECT screen_name FROM attendee) ' : '';

if (isset($_GET['filter']) && $_GET['filter'] == 'attendees') {
	$stmt = $mysqli->prepare('SELECT screen_name, profile_image_url, count as qty FROM voices_latest
		WHERE channel_id = ? ' . $chanzero_op . ' screen_name IN (SELECT screen_name FROM attendee)
		GROUP BY screen_name ORDER BY qty DESC LIMIT 50');
}
else {
	$stmt = $mysqli->prepare('SELECT screen_name, profile_image_url, COUNT(screen_name) as qty FROM voices_latest
		WHERE channel_id = ? ' . $chanzero . '
		GROUP BY screen_name
		ORDER BY qty DESC LIMIT 50');
}
$stmt->bind_param('i', $_GET['cid']);
$stmt->execute();
$stmt->bind_result($screen_name, $profile_image_url, $qty);
$i = 1;
while ($stmt->fetch()) {
	$users[] = array(
		'ranking' => $i,
		'num_tweets_in_chan' => $qty,
		'screen_name' => $screen_name,
		'profile_image_url' => $profile_image_url,
	);
	$i++;
}
$stmt->close();

$return_array = array('users' => $users);
print to_json($return_array);

?>
