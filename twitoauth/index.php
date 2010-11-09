<?php

/**
 * @file
 * User has successfully authenticated with Twitter. Access tokens saved to session and DB.
 */

session_start();
require_once($_SERVER['DOCUMENT_ROOT'] . '/config/main.conf.php');

// If access tokens are not available redirect to connect page
if (empty($_SESSION['access_token']) || empty($_SESSION['access_token']['oauth_token']) || empty($_SESSION['access_token']['oauth_token_secret'])) {
	header('Location: ./clearsessions.php');
}

// Get user access tokens out of the session
$access_token = $_SESSION['access_token'];

// Create a TwitterOauth object with consumer/user tokens
$connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET, $access_token['oauth_token'], $access_token['oauth_token_secret']);

$content = "Thanks! Eventually, we'll redirect you right back to where you left off.";

// Include HTML to display on the page
include('html.inc');
