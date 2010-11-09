<?php

/*
 * @file
 * This is basically the Twitter OAuth library by Abraham Williams
 * with all of the authentication stripped out -- we can use it for
 * calls that do not need authentication
 * This ONLY handles GET requests!
 */

require_once($_SERVER['DOCUMENT_ROOT'] . '/config/main.conf.php');

/**
 * Twitter OAuth class
 */
class TwitterRest {
  /* Contains the last HTTP status code returned. */
  public $http_code;
  /* Contains the last API call. */
  public $url;
  /* Set up the API root URL. */
  public $host = "https://api.twitter.com/1/";
  /* Set timeout default. */
  public $timeout = 30;
  /* Set connect timeout. */
  public $connecttimeout = 30; 
  /* Verify SSL Cert. */
  public $ssl_verifypeer = FALSE;
  /* Respons format. */
  public $format = 'json';
  /* Decode returned json data. */
  public $decode_json = FALSE;
  /* Contains the last HTTP headers returned. */
  public $http_info;
  /* Set the useragnet. */
  public $useragent = T_USER_AGENT;
  /* Immediately retry the API call if the response was not successful. */
  //public $retry = TRUE;

	/**
	 * @param string $query optional
	 */
	function TwitterRest() {
		//do nothing
	}

  /**
   * GET wrapper for tRestRequest.
   */
  function get($url, $parameters = array()) {
    $response = $this->tRestRequest($url, $parameters);
    if ($this->format === 'json' && $this->decode_json) {
      return json_decode($response);
    }
    return $response;
  }

  /**
   * Format API request
   */
  function tRestRequest($url, $parameters) {
    if (strrpos($url, 'https://') !== 0 && strrpos($url, 'http://') !== 0) {
      $url = "{$this->host}{$url}.{$this->format}";
    }

	$url .= ($parameters) ? '?' . http_build_query($parameters) : '';

	return $this->http($url);
  }

  /**
   * Make an HTTP request
   *
   * @return API results
   */
  function http($url) {
    $this->http_info = array();
    $ci = curl_init();
    /* Curl settings */
    curl_setopt($ci, CURLOPT_USERAGENT, $this->useragent);
    curl_setopt($ci, CURLOPT_CONNECTTIMEOUT, $this->connecttimeout);
    curl_setopt($ci, CURLOPT_TIMEOUT, $this->timeout);
    curl_setopt($ci, CURLOPT_RETURNTRANSFER, TRUE);
    curl_setopt($ci, CURLOPT_HTTPHEADER, array('Expect:'));
    curl_setopt($ci, CURLOPT_SSL_VERIFYPEER, $this->ssl_verifypeer);
    curl_setopt($ci, CURLOPT_HEADERFUNCTION, array($this, 'getHeader'));
    curl_setopt($ci, CURLOPT_HEADER, FALSE);

    curl_setopt($ci, CURLOPT_URL, $url);
    $response = curl_exec($ci);
    $this->http_code = curl_getinfo($ci, CURLINFO_HTTP_CODE);
    $this->http_info = array_merge($this->http_info, curl_getinfo($ci));
    $this->url = $url;
    curl_close ($ci);
    return $response;
  }

  /**
   * Get the header info to store.
   */
  function getHeader($ch, $header) {
    $i = strpos($header, ':');
    if (!empty($i)) {
      $key = str_replace('-', '_', strtolower(substr($header, 0, $i)));
      $value = trim(substr($header, $i + 2));
      $this->http_header[$key] = $value;
    }
    return strlen($header);
  }
}
