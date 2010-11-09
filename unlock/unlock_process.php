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
 *   0) Success - Activation email sent
 *   1) general failure
 *   2) user is already unlocked
 *   3) user is pending confirmation
 *   5) valid email required
 *   6) email field required
 */

require($_SERVER['DOCUMENT_ROOT'] . '/lib/helpers.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/config/main.conf.php');

//User is submitting unlock form
$regexp = "/^[^0-9][A-z0-9_]+([.][A-z0-9_]+)*[@][A-z0-9_]+([.][A-z0-9_]+)*[.][A-z]{2,4}$/";
if(isset($_POST['email']) && $_POST['email'] != '') {
	$email = $_POST['email'];
	if(!preg_match($regexp, $email)) {
		$output = array('success' => FALSE, 'code' => 5, 'message' => 'valid email required');
	}
	else {
		$mysqli = new mysqli(DBHOST, DBUSER, DBPASS, DB);
		if (mysqli_connect_error()) {
			$message = 'database error ' . mysqli_connect_errno() . ': ' . mysqli_connect_error();
			die(json_encode(array('success' => FALSE, 'code' => 10, 'message' => $message)));
		}

		$user = get_user($mysqli, $email);
		if ($user == FALSE) {
			if (create_user_send_activation($mysqli, $email)) {
				$output = array('success' => TRUE, 'code' => 1, 'message' => 'created user and sent activation mail');
			}
		}
		else if ($user['status'] == 1) {
			$output = array('success' => FALSE, 'code' => 2, 'message' =>'pending confirmation');
		}
		else if ($user['status'] == 2) {
			$output = array('success' => TRUE, 'code' => 3, 'message' => 'user is already unlocked');
		}
	}
}
else {
	$output = array('success' => FALSE, 'code' => 6, 'message' => 'email field required');
}

print to_json($output);

/**
 * Adds a user to the db and sends the activation email
 *
 * @param $mysqli
 *   A mysqli connection
 * @param $email
 *   Email address of user
 * @return
 *   TRUE if user is successfully added user and sent mail
 */
function create_user_send_activation($mysqli, $email) {
	$unique = uniqid();
	if ($stmt = $mysqli->prepare('INSERT INTO user (email, status, uniqid) VALUES (?, 1, ?)')) {
		$stmt->bind_param('ss', $email, $unique);
		$stmt->execute();
		$stmt->close(); 
		$url = /*$_SERVER['HTTP_HOST'] . */"http://isoconnect.isobar.com/unlock/activate_user.php?uid={$unique}";
		$message = "Thank you for registering for ISO|connect.  To confirm your registration, please click on the following link: {$url} .  If you are not automatically redirected back to ISO|connect, please copy and paste the link into your iPad, iPhone, Android device, Blackberry Torch, desktop Safari or Chrome web browser.";
		$headers = "From: events@isobar.com" . "\r\n" .
		            "Reply-To: events@isobar.com" . "\r\n" .
		            "X-Mailer: PHP/" . phpversion();
		mail($email, 'ISO|connect Registration', $message, $headers);
		return TRUE;
	}
	else {
		return FALSE;
	}
}

/**
 * Check if an email is in the system and get the status and uniqid if it is
 *
 * @param $mysqli
 *   A mysqli connection
 * @param $email
 *   Email address of user
 * @return
 *   Email, status, and uniqid for a valid user
 *   FALSE if the user doesn't exist
 */
function get_user($mysqli, $email) {
	$stmt = $mysqli->prepare('SELECT status, uniqid FROM user WHERE email = ?');
	$stmt->bind_param('s', $email);
	$stmt->execute();
	$stmt->bind_result($row_status, $row_uniqid);
	$stmt->store_result();
	if ($stmt->num_rows > 0) {
		$stmt->fetch();
		$stmt->close(); 
		return array('email' => $email, 'status' => $row_status, 'uniqid' => $row_uniqid);
	}
	else {
		$stmt->close(); 
		return FALSE;
	}
}

$mysqli->close();
?>
