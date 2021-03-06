<?php 
session_start();

?>

<!DOCTYPE html>
<html manifest="/cache.manifest">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<title>ISO|connect</title>
  <link rel="stylesheet" href="lib_fe/css/style.css">
  <link rel="stylesheet" href="lib_fe/css/ext-touch.css" type="text/css">
  
  <!-- [if IE ]>
  <script>
  
    document.location = "/unsupportedBrowser.php";
  
  </script>
  </-->
  
</head>
<body>
 
  <script type="text/javascript">
    var _gaq = _gaq || [];
    _gaq.push(['_setAccount', 'UA-19632046-1']);
    _gaq.push(['_trackPageview']);
   
  
    (function() {
      var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
      ga.src = ('https:' == document.location.protocol ? ' https://ssl ' : ' http://www' ) + '.google-analytics.com/ga.js';
      var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
    })();
  </script>
 
 <script src="lib_fe/js/sencha/sencha-touch.js"></script>
  <script src="lib_fe/js/templates.js"></script>
  <script src="lib_fe/js/categoryList2.js"></script>
  <script src="lib_fe/js/sharing4.js"></script>
  <script src="lib_fe/js/voices.js"></script>
  <script src="lib_fe/js/tabs2.js"></script>
  <script src="lib_fe/js/unlock2.js"></script>
  <script src="/lib_fe/js/master.js"></script> 
  
  <script>
  if(localStorage != undefined){
  <?php     
    
    if(isset($_SESSION['access_token'])){
      print("localStorage.setItem('oAuth','true');");        
    }
    else{
      print("localStorage.removeItem('oAuth');");
    }  
    
  ?>
  }
  
  
  
  </script> 
  
  
  

</body>
</html>
                                                        