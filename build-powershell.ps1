param([Boolean] $minimize = $false)
param([Boolean] $compiledoc = $true)

Clear-Host

Import-Module "C:\Program Files (x86)\Microsoft\Microsoft Ajax Minifier\AjaxMin.dll"

if($minimize) {
    $ajaxMin = New-Object Microsoft.Ajax.Utilities.Minifier
    $ajaxMinSettings = New-Object Microsoft.Ajax.Utilities.CodeSettings
    $ajaxMinSettings.StrictMode = $true
}

$DependencyBuilder = "tools\dependencybuilder\joopl.dependencybuilder.exe"
$currentDir = ([System.IO.Path]::GetDirectoryName($MyInvocation.MyCommand.Path))

write-host JOOPL TOOLBOX
write-host -------------------------------------
write-host 
write-host Starting combination and minimization of JavaScript files...
write-host
write-host -NoNewline "Building dependency tree..." -ForegroundColor Green
write-host

Remove-Item -Recurse -Force .\test\scripts\joopl-toolbox -ErrorAction SilentlyContinue
robocopy .\src .\test\scripts\joopl-toolbox  /NFL /NDL /NJH /NJS /nc /ns /np /e

&$DependencyBuilder -directories "$currentDir\test" -outputdir "$currentDir\test" -excludefiles "joopl.toolbox.min.js;esprima.js;benchmark.js;qunit.min.js;qunit.js;joopl.min.js"

if($minimize) {
    $ajaxMin.MinifyJavaScript((Get-Content .\test\moduleinfo.js), $ajaxMinSettings) | Out-File .\test\moduleinfo.js -Force -Encoding utf8
}

if($minimize) {
    foreach($file in (Get-ChildItem -Path .\test\scripts\joopl-toolbox -Filter *.js -Recurse))
    {
        write-host -NoNewline "Minifying $file..."

        $fileContent = (Get-Content $file.FullName)
    
        if(!$file.Name.Contains("Queue")) 
        {
            $ajaxMin.MinifyJavaScript($fileContent, $ajaxMinSettings) | Out-File $file.FullName -Force -encoding utf8
            write-host "Done!" 
        }
        else
        {
            write-host "File discarded!"
        }
    }
}

if($compiledoc) {
    Write-Host "Compiling documentation.." -ForegroundColor Green
    yuidoc ./src --themedir ./yuidoc/themes/default --no-code --quiet
}

write-host "Build process has finished" -ForegroundColor Green
Start-Sleep -s 3