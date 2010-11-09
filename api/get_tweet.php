<?php

/**
 * @file
 * Get tweet details based on a twitter id
 */

require_once($_SERVER['DOCUMENT_ROOT'] . '/config/main.conf.php');
require($_SERVER['DOCUMENT_ROOT'] . '/lib/helpers.php');

check_required_get_params(array('tid' => 'numeric'));

$mysqli = new mysqli(DBHOST, DBUSER, DBPASS, DB);
if (mysqli_connect_error()) {
	$message = 'database error ' . mysqli_connect_errno() . ': ' . mysqli_connect_error();
	die(json_encode(array('success' => FALSE, 'code' => 10, 'message' => $message)));
}

$tweets = array();

$stmt = $mysqli->prepare('SELECT id, screen_name, profile_image_url, created_at, source, text FROM status WHERE id = ?');
$stmt->bind_param('s', $_GET['tid']);
$stmt->execute();
$stmt->bind_result($id, $screen_name, $profile_image_url, $created_at, $source, $text);
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
}
$stmt->close();

$return_array = array('tweets' => $tweets);
print to_json($return_array);
?>
