Clear-Host

$scriptPath = $MyInvocation.MyCommand.Definition
$scriptDir = $scriptPath.Replace($MyInvocation.MyCommand.Name, "")

pushd $scriptDir

write-host JOOPL TOOLBOX
write-host -------------------------------------
write-host 
write-host Starting combination and minimization of JavaScript files.... 

grunt

# Move the minified file to /test
copy-item bin\joopl-toolbox.js -destination test\joopl.toolbox.min.js