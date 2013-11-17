Clear-Host

Import-Module "C:\Program Files (x86)\Microsoft\Microsoft Ajax Minifier\AjaxMin.dll"

$ajaxMin = New-Object Microsoft.Ajax.Utilities.Minifier
$ajaxMinSettings = New-Object Microsoft.Ajax.Utilities.CodeSettings
$ajaxMinSettings.StrictMode = $true

$DependencyBuilder = "tools\dependencybuilder\joopl.dependencybuilder.exe"
$currentDir = ([System.IO.Path]::GetDirectoryName($MyInvocation.MyCommand.Path))

Remove-Item -Recurse -Force bin -ErrorAction Continue

New-Item -ItemType directory -Path bin

write-host JOOPL TOOLBOX
write-host -------------------------------------
write-host 
write-host Starting combination and minimization of JavaScript files...

$builtFiles = @{}

function buildFile
{
	param($fileName)

    Set-Location .\src

    $fullFileName = (get-childitem -include $fileName -recurse -force).FullName

    $extensionlessFileName = [System.IO.Path]::GetFileNameWithoutExtension($fileName)
    $md5 = Get-Content $fullFileName | Get-Hash -Algorithm MD5
    $md5 = $md5.HashString.Substring(0, 6)
    $outputFileName = ("bin\$extensionlessFileName.$md5.js")

    write-host $fullFileName
    
    Set-Location ..
    
    $builtFiles.Add($fileName, [System.IO.Path]::GetFileName($outputFileName))

    Get-Content $fullFileName | Out-File ($currentDir + "\" + $outputFileName) -Force utf8
}

Foreach($file in (Get-ChildItem -Recurse -Path .\src -Filter *.js))
{
    if($file.Name -ne "DependencyMap.js" -and $file.Name -ne "DependencyUsageMap.js") {
        buildFile $file.Name
    }
}

# joopl
#buildFile InvalidOperationException.js
#buildFile Convert.js

# joopl.collections
#buildFile Enumerator.js
#buildFile Enumerable.js
#buildFile List.js
#buildFile ListEnumerator.js
#buildFile ObservableChange.js
#buildFile ObservableList.js
#buildFile Queryable.js
#buildFile Queue.js
#buildFile Index.js
#buildFile OrderedStringIndex.js
#buildFile IndexedList.js

#joopl.net.http
#buildFile HttpClient.js
#buildFile HttpContent.js
#buildFile HttpResponseMessage.js
#buildFile HttpStatusCode.js
#buildFile JQueryHttpClient.js
#buildFile StringContent.js


write-host
write-host -NoNewline "Building dependency tree..."
write-host

Remove-Item -Recurse -Force .\test\libs\joopl-toolbox -ErrorAction SilentlyContinue
robocopy .\bin .\test\libs\joopl-toolbox  /NFL /NDL /NJH /NJS /nc /ns /np /e

&$DependencyBuilder -directories "$currentDir\test\scripts\joopl.collections" -outputdir "$currentDir\test\scripts\joopl.collections" -excludefiles "joopl.toolbox.min.js;esprima.js;benchmark.js;qunit.min.js;qunit.js" -moduleFiles "joopl.collections.js"

#$ajaxMin.MinifyJavaScript((Get-Content .\test\DependencyUsageMap.js), $ajaxMinSettings) | Out-File .\test\DependencyUsageMap.js -Force

foreach($file in $builtFiles.Keys)
{
    write-host -NoNewline "Minifying $file..."

    $outputFileName = $builtFiles.Get_Item($file)
    $outputFileName = "test\libs\joopl-toolbox\$outputFileName"
    $fileContent = Get-Content $outputFileName
    
    if(!$file.Contains("Queue")) 
    {
        $ajaxMin.MinifyJavaScript((Get-Content $outputFileName), $ajaxMinSettings) | Out-File $outputFileName -Force -encoding utf8
        write-host "Done!" 
    }
    else
    {
        write-host "File discarded!"
    }
}

yuidoc ./src --themedir ./yuidoc/themes/default --no-code

write-host "Build process has finished"
Start-Sleep -s 3