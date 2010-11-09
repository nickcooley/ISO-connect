<?php
/**
 * @file
 * Contains helpers for automated processes
 */

/**
 * Loop through 'search' row types from the 'search'
 * table and get tweets for each channel. Store them, and
 * update the since_id for those channels
 *
 * @param $mysqli
 *   A mysqli object
 * @param $searches
 *   Row(s) from the 'search' table
 */
function process_search_channels($mysqli, $searches) {
	$loop_max = 20;
	while ($obj = $searches->fetch_object()) {
		// TEMP: Search only channel 1 for now! TODO REMOVE THIS LINE and the corresponding curly
		if ($obj->channel_id == 1 || $obj->channel_id == 0) {

			// Another script (open_stream_work) is already deleting old records from status_latest!

			$match = FALSE;
			$i = $records = $inserts = 0;
			$url = 'http://search.twitter.com/search.json?result_type=recent&since_id=' . $obj->since_id . '&rpp=100&q=' . $obj->search_string;
			$stmt_add_latest = $mysqli->prepare('INSERT INTO status_latest (id, screen_name, profile_image_url, created_at, source, text, channel_id) VALUES (?, ?, ?, ?, ?, ?, ?)');
			$stmt_statchan = $mysqli->prepare('INSERT INTO status_channel (status_id, channel_id) VALUES (?, ?)');
			if ($stmt = $mysqli->prepare('INSERT INTO status (id, screen_name, profile_image_url, created_at, source, text) VALUES (?, ?, ?, ?, ?, ?)')) {
				while ($match == FALSE) {
					if ($search_result = search($url)) {
						$search_result_obj = json_decode($search_result);
						$i++; 
						foreach ($search_result_obj->results as $key => $t) {
							if (!isset($next_since_id)) {
								$next_since_id = $t->id;
							}

							if ($t->id == $obj->since_id) {
								$match = TRUE;
								break; //foreach
							}
							else {
								$max_id = $t->id;
								$created = date('Y-m-d H:i:s', strtotime($t->created_at));
								$stmt->bind_param('dsssss', $t->id, $t->from_user, $t->profile_image_url, $created, $t->source, $t->text);
								print $t->id . ' - ' . $t->from_user . "\r\n";
								if ($stmt->execute()) {
									$stmt_statchan->bind_param('dd', $t->id, $obj->channel_id);
									if ($stmt_statchan->execute()) {
										$inserts++;
									}

									$stmt_add_latest->bind_param('dsssssi', $t->id, $t->from_user, $t->profile_image_url, $created, $t->source, $t->text, $obj->channel_id);
									if (!$stmt_add_latest->execute()) {
										print $mysqli->error . "\n";
									}
								}
								$records++;
							}
						}

						$url = 'http://search.twitter.com/search.json?result_type=recent&max_id=' . $max_id . '&rpp=100&q=' . $obj->search_string;

						if ($match == TRUE || count($search_result_obj->results) != 100) {
							$hit_since_id = TRUE;
							break; // while loop
						}

						// SAFETY NET
						if ($i >= $loop_max) {
							$forced_quit = TRUE;
							break; // while loop
						}
					}
					else {
						die(date('Y-m-d H:i') . ": channel={$obj->id}, error=problem with twitter search response");
					}
				}
				$stmt->close(); // INSERT INTO tweet...
			}
			else {
				die(date('Y-m-d H:i') . ": channel={$obj->id}, error={$mysqli->error}");
			}

			$message = array(
				'search.id' => $obj->id, 'channel' => $obj->channel_id, 'queries' => $i, 'added to db' => $inserts,
				'search matches' => $records, 'newest id' => $next_since_id, 'oldest id' => $max_id,
				'used since_id' => $obj->since_id, 'max loops reached' => isset($forced_quit),
				'hit since_id successfully (or did not need to)' => isset($hit_since_id),
			);

			write_log($message);

			// Update the since_id so next time we run the query we don't get duplicates
			$mysqli->query('UPDATE search SET since_id = ' . $next_since_id . ' WHERE id = ' . $obj->id);
			unset($next_since_id);
		}
	}
}

/**
 * TODO Add remote
 * Unfortunately, this function is mostly a clone of process_search_channels().
 * Due to time constraints, these functions will remain separate even though
 * there are sub-processes that could be method-ized
 *
 * @param $mysqli
 *   A mysqli object
 * @param $twitterOauth
 *   A twitter Oauth object (app-credentials)
 * @param $lists
 *   Row(s) from the 'search' table
 */
function process_list_channels($mysqli, $twitterOauth, $lists) {
	$loop_max = 10;
	while ($obj = $lists->fetch_object()) {
		$match = FALSE;
		$i = $records = $inserts = 0;
		$list = explode('/', $obj->search_string);
		$params = array('since_id' => $obj->since_id, 'per_page' => 200);
		$end_url = "{$list[0]}/lists/{$list[1]}/statuses";
		if ($stmt = $mysqli->prepare('INSERT INTO tweet (id, from_user, from_user_id, profile_image_url, created_at, source, text, channel_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')) {
			while ($match == FALSE) {
				// Process - already json_decoded
				$result_obj = $twitterOauth->get($end_url, $params);
				if (!isset($result_obj->error)) {
					$i++; 
					foreach ($result_obj as $key => $t) {
						if (!isset($next_since_id)) {
							$next_since_id = $t->id;
						}

						if ($t->id == $obj->since_id) {
							$match = TRUE;
							break; //foreach
						}
						else {
							$max_id = $t->id;
							$created = strtotime($t->created_at);
							$stmt->bind_param('dsdssssi', $t->id, $t->user->name, $t->user->id, $t->user->profile_image_url, $created, $t->source, $t->text, $obj->channel_id);
							if ($stmt->execute()) {
								$inserts++;
							}
							$records++;
						}
					}

					$params = array('max_id' => $max_id, 'per_page' => 200);

					if ($match == TRUE || count($search_result_obj->results) != 100) {
						$hit_since_id = TRUE;
						break; // while loop
					}

					// SAFETY NET
					if ($i >= $loop_max) {
						$forced_quit = TRUE;
						break; // while loop
					}
				}
				else {
					die(date('Y-m-d H:i') . ": channel={$obj->id}, error=problem with twitter search response. {$result_obj->error}");
				}
			}
			$stmt->close(); // INSERT INTO tweet...
		}
		else {
			die(date('Y-m-d H:i') . ": channel={$obj->id}, error={$mysqli->error}");
		}

		$message = array(
			'search.id' => $obj->id, 'channel' => $obj->channel_id, 'queries' => $i, 'added to db' => $inserts,
			'search matches' => $records, 'newest id' => $next_since_id, 'oldest id' => $max_id,
			'used since_id' => $obj->since_id, 'max loops reached' => isset($forced_quit),
			'hit since_id successfully (or did not need to)' => isset($hit_since_id),
		);

		write_log($message);

		// Update the since_id so next time we run the query we don't get duplicates
		$mysqli->query('UPDATE search SET since_id = ' . $next_since_id . ' WHERE id = ' . $obj->id);
		unset($next_since_id);
	}
}

/**
 * TODO: Make this actually write to a log file!
 * Appends the array values to a line in a log file
 *
 * @param $values
 *   An array of named values
 * @return
 * 	 TRUE if appending to log file is successful
 */
function write_log($values) {
	$message = date('Y-m-d H:i');
	foreach ($values as $key => $value) {
		$message .= ", {$key}: {$value}";
	}
	//error_log($message, 1, "adam@transitid.com");
	error_log($message, 0);
	print $message . "\r\n";
	return TRUE;
}

/**
 * Performs the search on a query using curl
 *
 * @param $url
 *   Required. API URL to request
 * @param $postargs
 *   Optional. Urlencoded query string to append to the $url
 * @return
 *   The response from Twitter
 */
function search($url, $postargs=false) {
	$headers = array('X-Twitter-Client: PHPTwitterSearch','X-Twitter-Client-Version: 0.1','X-Twitter-Client-URL: ' . T_CLIENT_URL);
	$user_agent = T_USER_AGENT;
	$ch = curl_init($url);
	if ($postargs !== false) {
		curl_setopt($ch, CURLOPT_POST, true);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $postargs);
	}
	curl_setopt($ch, CURLOPT_VERBOSE, 1);
	curl_setopt($ch, CURLOPT_NOBODY, 0);
	curl_setopt($ch, CURLOPT_HEADER, 0);
	curl_setopt($ch, CURLOPT_USERAGENT, $user_agent);
	curl_setopt($ch, CURLOPT_FOLLOWLOCATION,0);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

	$response = curl_exec($ch);

	$response_info = curl_getinfo($ch);
	curl_close($ch);

	if (intval($response_info['http_code']) == 200) {
		return $response;
	}
	else {
		return false;
	}
}
?>
