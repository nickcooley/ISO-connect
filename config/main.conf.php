<?php

/**
 * @file
 * Configurations for all components of the application
 */

/**
 * Defines database connection credentials
 */
define('DBHOST', 'localhost');
define('DB', 'isoconnect');
define('DBUSER', 'isoconnectuser');
define('DBPASS', 'iso123connect');

/**
 * Configurations for ALL Twitter Requests
 */
define('T_USER_AGENT', 'http://isoconnect.isobar.com');
define('T_CLIENT_URL', 'http://isoconnect.isobar.com');

/**
 * Configurations for ALL Twitter OAuth requests
 */
define('CONSUMER_KEY', '80e4n2y55ZA2gEMBAnmwKQ');
define('CONSUMER_SECRET', '91INrNYt9KOksEjDXo0Pw9caNO5eAycpDhS62NNB4w');
define('OAUTH_CALLBACK', 'http://isoconnect.isobar.com/twitoauth/callback.php');

/**
 * To regenerate the token values, view the $_SESSION['access_token'] variable 
 * after authorizing with the "application's" account
 * There's another file in the config directory that will show you this
 * Uncomment the lines in show_session.php and browse to /config/show_session.php
 */
define('APP_OA_TOKEN', '17888120-xH12UhUa8Wk0dq6OqaUnrhZkMVr9FW2oQTPwRAUsI');
define('APP_OA_TOKEN_SECRET', 'IOLIxoLM0pO8ogLwAj8DMuxfOjDujLzz3jFJhPsqFgY');
define('APP_T_UID', '17888120');
define('APP_T_SN', 'isobarNA');
define('APP_T_PW', 'ISOBAR1');
?>
