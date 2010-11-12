<?php

/**
 * TODO handle mysqli prepare errors
 * @file
 * Get voices by channel
 */

require_once('/var/www/config/main.conf.php');
require('/var/www/lib/helpers.php');

error_log("STARTING UPDATE VOICES...................");
for ($cid = 0; $cid < 10; $cid++) {
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
$stmt = $mysqli->prepare('SELECT screen_name, profile_image_url, count FROM voices
		WHERE channel_id = ? ' . $chanzero . ' 
		ORDER BY count DESC LIMIT 10'); 
$stmt->bind_param('i', $cid);
$stmt->execute();
$stmt->bind_result($screen_name, $profile_image_url, $qty);

//Add the latest top voices
while ($stmt->fetch()) {
	if ($cid == 1) {
		echo "Hey a USER: " . $screen_name . "  COUNT: " . $qty . "\n";
	}
        $users[] = array(
                'count' => $qty,
                'screen_name' => $screen_name,
                'profile_image_url' => $profile_image_url,
        );
}
$stmt->close();

$stmt_insert = $mysqli->prepare('INSERT INTO voices_latest values(?,?,?,?) ON DUPLICATE KEY UPDATE count=?');
foreach ($users as $user) {
	$stmt_insert->bind_param('ssiii', 
		$user['screen_name'],
		$user['profile_image_url'],
		$cid,
		$user['count'],
 		$user['count']);	

	if ($cid == 1) {
		echo "USER: " . $user['screen_name'] . "  COUNT: " . $user['count'] . "\n";
	}

        if(!$stmt_insert->execute()) {
		print $mysqli->error . "\n";
	}
}
$stmt_insert->close();


$stmt_deleteold = $mysqli->prepare('DELETE FROM voices_latest where channel_id = ? order by count desc limit ?');
$stmt_rowcount = 'SELECT * FROM voices_latest where channel_id = ' . $cid;
$count_result = $mysqli->query($stmt_rowcount);
$num_rows = $count_result->num_rows;

if ($num_rows > 10) {
   $num_over = $num_rows - 10;
   echo "NUM ROWS: " . $num_rows . "\n";
   echo "NUM OVER: " . $num_over . "\n";
   $stmt_deleteold->bind_param('ii',$cid, $num_over);
   if(!$stmt_deleteold->execute()) {
     print $mysqli->error . "\n";
   }
}


}
error_log("FINISHED UPDATE VOICES...................");
?>
