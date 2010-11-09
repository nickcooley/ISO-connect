<?php

/**
 * @file
 * Build Authorization URL and send it to Twitter
 */

session_start();
require_once($_SERVER['DOCUMENT_ROOT'] . '/config/main.conf.php');
require($_SERVER['DOCUMENT_ROOT'] . '/lib/twitoauth/twitteroauth.php');

// Build TwitterOAuth object with client credentials
$connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET);
 
// Get temporary credentials
$request_token = $connection->getRequestToken(OAUTH_CALLBACK);

// Save temporary credentials to session
$_SESSION['oauth_token'] = $token = $request_token['oauth_token'];
$_SESSION['oauth_token_secret'] = $request_token['oauth_token_secret'];
 
// If last connection failed don't display authorization link
switch ($connection->http_code) {
	case 200:
		// Build authorize URL and redirect user to Twitter
		$url = $connection->getAuthorizeURL($token);
		header('Location: ' . $url); 
		break;
	default:
		// Show notification if something went wrong
		echo 'Could not connect to Twitter. Refresh the page or try again later.';
}
