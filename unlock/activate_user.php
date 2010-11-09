<?php
/**
 * TODO Add result-checking on mysqli statement calls
 * TODO Add wrap code to mysql connect error (maybe?)
 *
 * Database statuses:
 *   1) Pending confirmation
 *   2) Unlocked
 *
 * Return codes:
 *   0) success - account unlocked
 *   1) general failure
 *   2) user is already unlocked
 *   3) missing required uid (unique identifier)
 */

require_once($_SERVER['DOCUMENT_ROOT'] . '/config/main.conf.php');
require($_SERVER['DOCUMENT_ROOT'] . '/lib/helpers.php');

if (isset($_GET['uid'])) {
	$mysqli = new mysqli(DBHOST, DBUSER, DBPASS, DB);
	if (mysqli_connect_error()) {
		$message = 'database error ' . mysqli_connect_errno() . ': ' . mysqli_connect_error();
		die(json_encode(array('success' => FALSE, 'code' => 10, 'message' => $message)));
	}
	$status = uid_status($mysqli, $_GET['uid']);
	if ($status == '1') {
		if (activate_user($mysqli, $_GET['uid'])) {
			$output = array('success' => TRUE, 'code' => 0, 'message' => 'unlocked account successfully');
		}
	}
	else if ($status == '2') {
		$output = array('success' => TRUE, 'code' => 2, 'message' => 'account already unlocked');
	}
	else {
		$output = array('success' => FALSE, 'code' => 1, 'message' => 'missing required uid (unique identifier)');
	}
}
else {
	$output = array('success' => FALSE, 'code' => 3, 'message' => 'no unique identifier -- please supply a uid param');
}

/* print to_json($output); */




$dire = $output['success'];  
header('Location: ' . '/master.php?unlock='.$dire);







/**
 * Checks the status of a unique identifier
 *
 * @param $mysqli
 *   A mysqli connection
 * @param $uid
 *   Unique identifier
 * @return
 *   The status number of the row containing that unique identifier
 *   OR FALSE if the identifier doesn't exist
 */
function uid_status($mysqli, $uid) {
	$stmt = $mysqli->prepare('SELECT status FROM user WHERE uniqid = ?');
	$stmt->bind_param('s', $uid);
	$stmt->execute();
	$stmt->bind_result($row_status);
	$stmt->store_result();
	if ($stmt->num_rows > 0) {
		$stmt->fetch();
		$stmt->close(); 
		return $row_status;
	}
	else {
		$stmt->close(); 
		return FALSE;
	}
}

/**
 * Activates an email address based on a unique identifier
 *
 * @param $mysqli
 *   A mysqli connection
 * @param $uid
 *   Unique identifier
 * @return
 *   TRUE if user is successfully activated/unlocked
 */
function activate_user($mysqli, $uid) {
	if ($stmt = $mysqli->prepare('UPDATE user SET status = 2 WHERE uniqid = ?')) {
		$stmt->bind_param('s', $uid);
		$stmt->execute();
		$stmt->close(); 
		return TRUE;
	}
	else {
		return FALSE;
	}
}

$mysqli->close();
?>
