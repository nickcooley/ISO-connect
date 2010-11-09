<?php

/**
 * @file
 * Get tweet details based on a twitter id
 */

session_start();
require_once($_SERVER['DOCUMENT_ROOT'] . '/config/main.conf.php');
require($_SERVER['DOCUMENT_ROOT'] . '/lib/helpers.php');
require($_SERVER['DOCUMENT_ROOT'] . '/lib/twitoauth/twitteroauth.php');

check_required_get_params(array('tid' => 'numeric'));

/* If access tokens are not available redirect to connect page. */
if (empty($_SESSION['access_token']) || empty($_SESSION['access_token']['oauth_token']) || empty($_SESSION['access_token']['oauth_token_secret'])) {
    header('Location: /twitoauth/clearsessions.php');
	exit();
}

$access_token = $_SESSION['access_token'];
$connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET, $access_token['oauth_token'], $access_token['oauth_token_secret']);
$connection->decode_json = TRUE;
$result = $connection->post("statuses/retweet/{$_GET['tid']}");
$success = (isset($result->new_id)) ? TRUE : FALSE;
$message = (isset($result->errors)) ? $result->errors : NULL;

$return_array = array('success' => $success, 'message' => $message);
$json_string = to_json($return_array);
error_log("Retweet JSON String: " . $json_string);
print $json_string;
?>
