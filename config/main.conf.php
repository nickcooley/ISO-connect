<?php

/**
 * @file
 * Configurations for all components of the application
 */

/**
 * Defines database connection credentials
 */
//define('DBHOST', 'localhost');
define('DBHOST', '184.106.213.138');
define('DB', 'isoconnect');
define('DBUSER', 'isoconnectuser');
define('DBPASS', 'iso123connect');

/**
 * Configurations for ALL Twitter Requests
 */
define('T_USER_AGENT', 'http://sencha.isoconnect.isobar.com');
define('T_CLIENT_URL', 'http://sencha.isoconnect.isobar.com');

/**
 * Configurations for ALL Twitter OAuth requests
 */                    
define('CONSUMER_KEY', 'BoYJ9FslGOGJ6m1YAS3Eog');
define('CONSUMER_SECRET', 'fWwtMANWpmeSNvdhE6cdReVGaeKzAlX0Ddxv481gIk');
define('OAUTH_CALLBACK', 'http://sencha.isoconnect.isobar.com/twitoauth/callback.php');

/**
 * To regenerate the token values, view the $_SESSION['access_token'] variable 
 * after authorizing with the "application's" account
 * There's another file in the config directory that will show you this
 * Uncomment the lines in show_session.php and browse to /config/show_session.php
 */
define('APP_OA_TOKEN', '17888120-EfQ0bhTjntWJJdlpJcuQN2qZ5hDBDrm60YcteH1sU');
define('APP_OA_TOKEN_SECRET', '8D6QNuUqkBWtnHTUonTNaTbTpmtx5CEs38vCy4GrFEA');
define('APP_T_UID', '17888120');
define('APP_T_SN', 'isobarNA');
define('APP_T_PW', 'ISOBAR1');
?>
