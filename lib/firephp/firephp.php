<?php
/**
 * FirePHP setup.
 * This code should only be found ONCE on your site, Add it to an include file.
 * If site has single index.php (Magento, Drupal, etc.), call the include file once (there)
 * using require_once(...);
 *
 * If you need this to be global, please replace $firephp with $GLOBALS['firephp'] everywhere!
 * so: $GLOBALS['firebug'] = FirePHP::getInstance(true);
 * and in your php code: $GLOBALS['firephp']->log('test of global firephp');
 */
require($_SERVER['DOCUMENT_ROOT'] . '/lib/firephp/lib/FirePHPCore/FirePHP.class.php');
$firephp = FirePHP::getInstance(true);

// Add allowed ip addresses below, comma-separated
$allowedIpArr = array('127.0.0.1', '72.45.168.194', '38.97.130.2');

if(in_array($_SERVER['REMOTE_ADDR'], $allowedIpArr)){
    $firephp->setEnabled(true);
}else{
    $firephp->setEnabled(false);
}

// Log all errors, exceptions, and assertion errors to Firebug
$firephp->registerErrorHandler($throwErrorExceptions=true);
$firephp->registerExceptionHandler();
$firephp->registerAssertionHandler(
    $convertAssertionErrorsToExceptions=true,
	$throwAssertionExceptions=false
);
