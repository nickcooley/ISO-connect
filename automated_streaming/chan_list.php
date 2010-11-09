<?php

/**
 * Returns terms for a specific channel
 *
 * @param $cid
 *   Channel id that contains terms to return
 * @return
 *   Array of terms
 */
function chan_get_terms($cid) {
	//TODO: verify the cid exists within the channels var -- return error if not

	$channels = get_channels();

	return $channels[$cid]['terms'];
}

/**
 * Returns available channels
 *
 * @return
 *   Array of channels
 */
function get_channels() {
	$channels = array(
		0 => array(
			'name' => 'Sencha Con',
			'terms' => array('SenchaCon'),
		),
		1 => array(
			'name' => 'Sencha',
			'terms' => array('senchaTouch', 'ExtJS', 'ExtGWT', 'ExtDesigner', 'Sencha', 'SenchaInc', 'RaphaelJS', 'jqTouch', ),
		),
		2 => array(
			'name' => 'Mobile Libraries',
			'terms' => array('phonegap', 'senchaTouch', 'jqTouch', 'appcelerator', 'jquery-mobile','zepto','xui',),
		),
		3 => array(
			'name' => 'JS Libraries',
			'terms' => array('jQuery', 'YUI2', 'YUI3', 'prototype', 'mooTools', 'node.js', 'modernizr','yui', 'yql',),
		),
		4 => array(
			'name' => 'Front-End Development',
			'terms' => array('HTML', 'HTML5', 'CSS', 'js', 'CSS3', 'ajax', 'json', 'flash',),
		),
		5 => array(
      'name' => 'Mobile Devices',
      'terms' => array('iphone', 'ipod', 'android', 'itouch', 'iphone4', 'droid', 'droidX', 'droid2', 'evo'),
    ),
		6 => array(
			'name' => 'Travel & Leisure',
			'terms' => array('hotels', 'flights', 'cheap flights', 'resort', 'travel deals', 'vacation', 'airlines', 'motels', 'camping', 'luggage', 'cruises', 'vacation rentals', 'vacation packages', 'cheap hotels', 'beach hotels', 'city hotels', 'las vegas hotels', 'hotel deals', 'luxury hotels', 'bed and breakfast', 'airfare', 'disney world', 'cheap hotels', 'hotel reservations', 'new york hotels',),
		),
		7 => array(
			'name' => 'Retail',
			'terms' => array('shoes', 'clothing', 'furniture', 'jewelry', 'dresses', "women's clothing", 'bedding', 'apparel', 'pants', 'handbags', 'tops', 'appliances', 'rings', "men's clothing", 'sunglasses', 'sandals', 'mattress', 'carpet', 'curtains', 'swimwear', 'patio furniture', "women's dresses", 'kids shoes', 'refrigerator', 'kitchen appliances',),
		),
		8 => array(
			'name' => 'Business Services',
			'terms' => array('business credit', 'business marketing', 'business services', 'market research', 'business systems', 'direct mail', 'business information', 'business solutions', 'credit reports', 'data management', 'direct marketing', 'mailing list', 'marketing services', 'marketing research', 'database management', 'business list', 'business research', 'direct mailing lists', 'payroll services', 'accounting services', 'business solution', 'direct mail advertising', 'marketing firms', 'small business services', 'database marketing',),
		),
		9 => array(
			'name' => 'San Francisco',
			'terms' => array('San Francisco', 'SF',),
		),
	);

	return $channels;
}
?>
