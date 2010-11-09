<?php

/**
 * @file
 * Processes tweets using the streaming API
 */

require_once('../config/main.conf.php');
require_once('../lib/automated_helpers.php');
require('chan_list.php');

/**
 * Connect to the database
 */
$mysqli = new mysqli(DBHOST, DBUSER, DBPASS, DB);
if (mysqli_connect_error()) {
	$message = 'database error ' . mysqli_connect_errno() . ': ' . mysqli_connect_error();
	die(json_encode(array('success' => FALSE, 'code' => 10, 'message' => $message)));
}

$all_terms = array();

$track = '';
// Get channel search terms
$channels = get_channels();
foreach ($channels as $chan_id => $channel) {
	foreach ($channel['terms'] as $term) {
		$track .= ',' . $term;
	}
}
$track = ltrim($track, ',');

// Get attendee user ids
$uids = '';
$result = $mysqli->query('SELECT uid FROM attendee WHERE uid IS NOT NULL');
while ($obj = $result->fetch_object()) {
	$uids .= ',' . $obj->uid;
}
$result->close();
$uids = ltrim($uids, ',');

$opts = array(
	'http'=>array(
		'method' => "POST", 
		'content' => 'follow=' . $uids . '&track=' . $track,
		'header' => "Content-Type: application/x-www-form-urlencoded\r\n",
	),
);

//Status insert and delete for the latest list
$stmt_addnew = $mysqli->prepare('INSERT INTO status_latest (id, screen_name, profile_image_url, created_at, source, text, channel_id) VALUES (?, ?, ?, ?, ?, ?, ?)');
$stmt_deleteold = $mysqli->prepare('DELETE FROM status_latest where channel_id = ? order by created_at limit 1');


//Voices inserts for full list and top 100, delete from the top 100
$stmt_vupdate = $mysqli->prepare('INSERT INTO voices VALUES(?,?,?,1,?) ON DUPLICATE KEY UPDATE count=count+1');
$stmt_vlupdate = $mysqli->prepare('INSERT INTO voices_latest VALUES(?,?,?,1,?) ON DUPLICATE KEY UPDATE count=count+1');
$stmt_vdeleteold = $mysqli->prepare('DELETE FROM voices_latest where channel_id = ? order by count ASC limit 1');

	$context = stream_context_create($opts);
	while (1){
		$instream = fopen('http://' . APP_T_SN . ':' . APP_T_PW . '@stream.twitter.com/1/statuses/filter.json', 'r' ,false, $context);
		while(!feof($instream)) {
			if(!($line = stream_get_line($instream, 2000000, "\n"))) {
				continue;
			}else{
				$tweet = json_decode($line);
				if (!isset($tweet->text)) {
					print 'x';
					continue;
				}

				$channel_id_matches = get_channel_matches($tweet->text, $channels);

				if (!isset($channel_id_matches[0])) {
					continue; // Break out of the loop
				}

				// Add entries to the status_channel table relating a tweet to channel(s)
				foreach ($channel_id_matches as $cid) {

					$stmt_rowcount = 'SELECT id FROM status_latest where channel_id = ' . $cid;
					$count_result = $mysqli->query($stmt_rowcount);
					$num_rows = $count_result->num_rows;

					if ($num_rows > 1000) {
						$stmt_deleteold->bind_param('i',$cid);	
						$stmt_deleteold->execute();
					}
					$stmt_addnew->bind_param('dsssssi', 
						$tweet->id, 
						$tweet->user->screen_name, 
						$tweet->user->profile_image_url, 
						date('Y-m-d H:i:s'),
						$tweet->source, 
						$tweet->text,
						$cid
					);

					if (!$stmt_addnew->execute()) {
						print $mysqli->error . "\n";
					}


					//Add voices
                                        $stmt_vupdate->bind_param('ssi',
                                                $tweet->user->screen_name,
                                                $tweet->user->profile_image_url,
                                                $cid,
						$tweet->id
                                        );

                                        if (!$stmt_vupdate->execute()) {
                                                print $mysqli->error . "\n";
                                        }


                                        $stmt_vlupdate->bind_param('ssi',
                                                $tweet->user->screen_name,
                                                $tweet->user->profile_image_url,
                                                $cid,
						$tweet->id
                                        );

                                        if (!$stmt_vlupdate->execute()) {
                                                print $mysqli->error . "\n";
                                        }

                                        $stmt_vrowcount = 'SELECT screen_name FROM voices_latest where channel_id = ' . $cid;
                                        $vcount_result = $mysqli->query($stmt_vrowcount);
                                        $vnum_rows = $vcount_result->num_rows;


                                        if ($vnum_rows > 10) {
                                                $stmt_vdeleteold->bind_param('i',$cid);
						echo "Deleting from channel . " . $cid . "\n";
                                                $stmt_vdeleteold->execute();
                                        }
					
				}

				flush();
			}
		}
	}
	$stmt_vupdate->close();
	$stmt_vlupdate->close();
	$stmt_addnew->close();
	$stmt_deleteold->close();
	$stmt_vdeleteold->close();

/**
 * Checks if a text has an exact term
 *
 * @param $text
 *   Text to search
 * @param $terms
 *   An array of terms for matching
 * @return
 *   TRUE if any of the terms are found
 */
function get_channel_matches($text, $channels) {
	$channel_id_matches = array();
	foreach ($channels as $chan_id => $channel) {
		foreach ($channel['terms'] as $term) {
			if (stripos($text, $term) !== FALSE) {
				$channel_id_matches[] = $chan_id;
				break; //already matched a term from this channel, break out of the terms loop
			}
		}
	}
	if (isset($channel_id_matches[0])) {
		return $channel_id_matches;
	}
	else {
		return FALSE;
	}
}
?>
