<?php 
session_start();

?>

<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<title>ISO|connect</title>
  
</head>
<body>
 
  <script src="lib_fe/js/sencha/ext-touch-debug.js"></script>
  <script>
    var toString = Object.prototype.toString,
        ua = navigator.userAgent.toLowerCase(),
        check = function(r){
            return r.test(ua);
        },
        DOC = document,
        docMode = DOC.documentMode,
        isStrict = DOC.compatMode == "CSS1Compat",
        isOpera = check(/opera/),
        isChrome = check(/\bchrome\b/),
        isWebKit = check(/webkit/),
        isSafari = !isChrome && check(/safari/),
        isSafari2 = isSafari && check(/applewebkit\/4/), // unique to Safari 2
        isSafari3 = isSafari && check(/version\/3/),
        isSafari4 = isSafari && check(/version\/4/),
        isIE = !isOpera && check(/msie/),
        isIE7 = isIE && (check(/msie 7/) || docMode == 7),
        isIE8 = isIE && (check(/msie 8/) && docMode != 7),
        isIE6 = isIE && !isIE7 && !isIE8,
        isBlackberry = check(/blackberry/),
        isGecko = !isWebKit && check(/gecko/),
        isGecko2 = isGecko && check(/rv:1\.8/),
        isGecko3 = isGecko && check(/rv:1\.9/),
        isBorderBox = isIE && !isStrict,
        isWindows = check(/windows|win32/),
        isMac = check(/macintosh|mac os x/),
        isAir = check(/adobeair/),
        isLinux = check(/linux/),
        isSecure = /^https/i.test(window.location.protocol);
    
    alert(navigator.userAgent.toLowerCase());
    alert((Ext.is.Phone && (Ext.is.iOS || Ext.is.Android)) || Ext.is.Tablet || isChrome || isSafari)
     var d = document.createElement("div");
      d.className = "noWebkitBrowser"
      //d.innerHTML = "We're sorry, your browser is not supported"
      d.innerHTML = navigator.userAgent.toLowerCase();
      //d.innerHTML = "<img src='/img/placeholder.jpg'/><p>We're sorry, isoconnect is not available for your browser</p>"
      document.body.appendChild(d);
  </script> 
  
  
  

</body>
</html>
                                                        