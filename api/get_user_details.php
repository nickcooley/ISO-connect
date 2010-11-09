<?php

/**
 * TODO handle mysqli prepare errors
 * @file
 * Get details about a user account
 */

session_start();
require_once($_SERVER['DOCUMENT_ROOT'] . '/config/main.conf.php');
require($_SERVER['DOCUMENT_ROOT'] . '/lib/helpers.php');
require($_SERVER['DOCUMENT_ROOT'] . '/lib/twitrest/twitterrest.php');

check_required_get_params(array('screen_name' => 'string'));

$mysqli = new mysqli(DBHOST, DBUSER, DBPASS, DB);
if (mysqli_connect_error()) {
	$message = 'database error ' . mysqli_connect_errno() . ': ' . mysqli_connect_error();
	die(json_encode(array('success' => FALSE, 'code' => 10, 'message' => $message)));
}

$stmt = $mysqli->prepare('SELECT screen_name FROM attendee WHERE screen_name = ?');
$stmt->bind_param('s', $_GET['screen_name']);
$stmt->execute();
$stmt->store_result();
$is_attendee = ($stmt->num_rows > 0) ? TRUE : FALSE;
$stmt->close();

$twitterRest = new TwitterRest();
$twitterRest->decode_json = TRUE;

$user = $twitterRest->get('users/show', array('screen_name' => $_GET['screen_name']));
$user->is_attendee = $is_attendee;

print to_json(array('user_details' => $user));
?>
