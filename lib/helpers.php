<?php
/**
 * Checks required GET parameters and dies if they are not valid or found
 *
 * @param $params
 *   The $_GET parameters in an array like: 'cid' => 'numeric', 'cid' => 'string'
 * @return
 *   FALSE if params invalid or missing
 *   
 */
function check_required_get_params($params) {
	$errors = array();
	foreach ($params as $key => $type) {
		switch ($type) {
			case 'numeric':
				if (!isset($_GET[$key]) || !is_numeric($_GET[$key])) {
					$errors[] = "Missing or invalid required param: {$key} ({$type})";
				}
				break;
			case 'string':
				if (!isset($_GET[$key])) {
					$errors[] = "Missing or invalid required param: {$key} ({$type})";
				}
				break;
			default:
				if (!isset($_GET[$key])) {
					$errors[] = "Missing or invalid required param: {$key} ({$type})";
				}
		}
	}

	if (isset($errors[0])) {
		die(to_json(array('success' => FALSE, 'code' => 15, 'errors' => $errors)));
	}
}

/**
 * Encodes a value into JSON and optionally
 * wraps the value based on a "wrap" get parameter of TRUE
 * or by passing a second param of TRUE
 *
 * @param $value
 *   The value to encode
 * @param $force_wrap
 *   Force the string to come back wrapped with the JSONP callback
 * @return
 *   A JSON string with optional wrapper
 */
function to_json($value, $force_wrap = FALSE) {
	$retval = json_encode($value);
	error_log("To Json: " . $retval . " End of String");
	if ((isset($_GET['wrap']) && $_GET['wrap'] == 'true') || $force_wrap == TRUE) {
		return 'Ext.util.JSONP.callback(' . $retval . ');';
	}
	else {
		return $retval;
	}
}

/**
 * Generates 'time ago' from a timestamp
 * modified from http://www.php.net/manual/en/function.time.php#89415
 * 
 * @return
 *   String with 'time ago' value (e.g. '4 hours')
 */
function nice_time($timestamp) {
    if(empty($timestamp)) {
        return "No date provided";
    }
   
    $periods         = array("second", "minute", "hour", "day", "week", "month", "year", "decade");
    $lengths         = array("60","60","24","7","4.35","12","10");
   
    $now             = time();
   
       // check validity of date
    if(empty($timestamp)) {   
        return "Bad date";
    }

    // is it future date or past date
    if($now > $timestamp) {   
        $difference     = $now - $timestamp;
        $tense         = "ago";
       
    } else {
        $difference     = $timestamp - $now;
        $tense         = "from now";
    }
   
    for($j = 0; $difference >= $lengths[$j] && $j < count($lengths)-1; $j++) {
        $difference /= $lengths[$j];
    }
   
    $difference = round($difference);
   
    if($difference != 1) {
        $periods[$j].= "s";
    }
   
    return "$difference $periods[$j] {$tense}";
}
?>
