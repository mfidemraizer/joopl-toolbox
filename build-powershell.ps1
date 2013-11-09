Clear-Host

Add-Type -Path "C:\Program Files (x86)\Microsoft\Microsoft Ajax Minifier\AjaxMin.dll"

$ajaxMin = New-Object Microsoft.Ajax.Utilities.Minifier
$ajaxMinSettings = New-Object Microsoft.Ajax.Utilities.CodeSettings
$ajaxMinSettings.StrictMode = [System.Boolean]::Parse("true")

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

# joopl
buildFile InvalidOperationException.js
buildFile Convert.js

# joopl.collections
buildFile Collection.js
buildFile Enumerator.js
buildFile Enumerable.js
buildFile Index.js
buildFile IndexedList.js
buildFile List.js
buildFile ListEnumerator.js
buildFile ObservableChange.js
buildFile ObservableList.js
buildFile OrderedStringIndex.js
buildFile Queryable.js
buildFile Queue.js
buildFile TypedList.js

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

&$DependencyBuilder -directories "$currentDir\test" -outputdir "$currentDir\test" -excludefiles "joopl.toolbox.min.js;esprima.js;benchmark.js;qunit.min.js"

$ajaxMin.MinifyJavaScript((Get-Content .\test\DependencyUsageMap.js), $ajaxMinSettings) | Out-File .\test\DependencyUsageMap.js -Force

foreach($file in $builtFiles.Keys)
{
    write-host -NoNewline "Minifying $file..."

    $outputFileName = $builtFiles.Get_Item($file)
    $outputFileName = "test\libs\joopl-toolbox\$outputFileName"
    $fileContent = Get-Content $outputFileName
    
    if(!$file.Contains("Queue")) 
    {
        #$ajaxMin.MinifyJavaScript((Get-Content $outputFileName), $ajaxMinSettings) | Out-File $outputFileName -Force
        write-host "Done!" 
    }
    else
    {
        write-host "File discarded!"
    }
}

yuidoc -n .

write-host "Build process has finished"
Start-Sleep -s 3