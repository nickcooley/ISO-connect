<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"
        "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
	<title>Temporary unlock form (development only -- DB will be wiped)</title>
</head>
<body>
	<form name="unlockform" method="post" action="/unlock/unlock_process.php">
	<label for="email">E-mail address:</label>
	<br/>
	<input name="email" type="text" maxlength="128" size="40">
	<br/><br/>
	<input type="submit" value="Unlock">
</body>
</html>
