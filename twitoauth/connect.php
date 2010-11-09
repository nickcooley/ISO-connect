<?php

/**
 * @file
 * Check if consumer token is set and if so send user to get a request token.
 *
 * Exit with an error message if the CONSUMER_KEY or CONSUMER_SECRET is not defined
 */

require_once($_SERVER['DOCUMENT_ROOT'] . '/config/main.conf.php');

if (CONSUMER_KEY === '' || CONSUMER_SECRET === '') {
	echo 'You need a consumer key and secret. Get one from <a href="https://twitter.com/apps">https://twitter.com/apps</a>';
	exit;
}

// Build an image link to start the redirect process
$content = '<a href="./redirect.php"><img src="./images/lighter.png" alt="Sign in with Twitter"/></a>';
 
// Include HTML to display on the page
include('html.inc');
