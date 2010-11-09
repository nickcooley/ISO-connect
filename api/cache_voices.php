<?php

/**
 * TODO handle mysqli prepare errors
 * @file
 * Get voices by channel
 */

require_once('/var/www/config/main.conf.php');
require('/var/www/lib/helpers.php');

$cid = $argv[1];
$root = '/var/www/';
$cachefile = $root . '/cache_dave/get_voices_by_channel';
$cachefile .=  ".chan-{$cid}.cache";
ob_start();

$mysqli = new mysqli(DBHOST, DBUSER, DBPASS, DB);
if (mysqli_connect_error()) {
	print "Death";
	$message = 'database error ' . mysqli_connect_errno() . ': ' . mysqli_connect_error();
	die(json_encode(array('success' => FALSE, 'code' => 10, 'message' => $message)));
}

$users = array();

$chanzero_op = ($cid == 0) ? 'OR' : 'AND';
$chanzero = ($cid == 0) ? 'OR screen_name IN (SELECT screen_name FROM attendee) ' : '';

$users = array();
	$stmt = $mysqli->prepare('SELECT screen_name, profile_image_url, COUNT(screen_name) as qty FROM status
		INNER JOIN status_channel ON status.id = status_channel.status_id
		WHERE status_channel.channel_id = ? ' . $chanzero . '
		GROUP BY screen_name
		ORDER BY qty DESC LIMIT 50');
$stmt->bind_param('i', $cid);
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
print to_json($return_array, TRUE); 

	$contents = ob_get_contents();
	ob_end_clean();

	$handle = fopen($cachefile, 'w');
	fwrite($handle, $contents);
	fclose($handle);

?>
