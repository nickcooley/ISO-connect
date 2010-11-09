<?php

/**
 * TODO handle mysqli prepare errors
 * @file
 * Get tweets for a specific channel ID
 */

require_once($_SERVER['DOCUMENT_ROOT'] . '/config/main.conf.php');
require($_SERVER['DOCUMENT_ROOT'] . '/lib/helpers.php');

check_required_get_params(array('cid' => 'numeric'));

if (isset($_GET['rpp']) && is_numeric($_GET['rpp'])) {
	$limit = $_GET['rpp'];
}
else {
	$limit = 100;
}


$mysqli = new mysqli(DBHOST, DBUSER, DBPASS, DB);
if (mysqli_connect_error()) {
	$message = 'database error ' . mysqli_connect_errno() . ': ' . mysqli_connect_error();
	die(json_encode(array('success' => FALSE, 'code' => 10, 'message' => $message)));
}

$tweets = array();

$chanzero = ($_GET['cid'] == 0) ? 'OR screen_name IN (SELECT screen_name FROM attendee) ' : '';

if (isset($_GET['maxid']) && is_numeric($_GET['maxid'])) {
	$stmt = $mysqli->prepare('SELECT id, screen_name, profile_image_url, created_at, source, text, channel_id 
		FROM status_latest 
		WHERE (channel_id = ? ' . $chanzero . ') AND id < ?
		ORDER BY id DESC LIMIT ?');
	$stmt->bind_param('idi', $_GET['cid'], $_GET['maxid'], $limit);
}
else {
	$stmt = $mysqli->prepare('SELECT id, screen_name, profile_image_url, created_at, source, text, channel_id
		FROM status_latest 
		WHERE channel_id = ? ' . $chanzero . '
		ORDER BY id DESC LIMIT ?');
	$stmt->bind_param('ii', $_GET['cid'], $limit);
}

$stmt->execute();
$stmt->bind_result($id, $screen_name, $profile_image_url, $created_at, $source, $text, $channel_id);
$next_page_maxid = NULL;

while ($stmt->fetch()) {
	$created_at_timestamp = strtotime($created_at);
	$tweets[] = array(
		'id' => $id,
		'screen_name' => $screen_name,
		'profile_image_url' => $profile_image_url,
		'created_at' => nice_time($created_at_timestamp),
		'created_at_long' => date('m-d-y h:i A', $created_at_timestamp),
		'source' => $source,
		'text' => $text,
	);
	$next_page_maxid = $id;
}
$stmt->close();

$return_array = array('tweets' => $tweets, 'next_page_maxid' => $next_page_maxid);
print to_json($return_array);

?>
