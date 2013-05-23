Clear-Host

write-host JOOPL TOOLBOX
write-host -------------------------------------
write-host 
write-host Starting combination and minimization of JavaScript files.... 

remove-item joopl.toolbox.js -ErrorAction SilentlyContinue
remove-item joopl.toolbox.min.js -ErrorAction SilentlyContinue

function combineFile
{
    param ($fileName)
    
    get-childitem -include $fileName -recurse -force | get-content | out-file joopl.toolbox.js -append -encoding UTF8
}

# joopl
combineFile InvalidOperationException.js
combineFile Convert.js

# joopl.collections
combineFile Enumerator.js
combineFile Enumerable.js
combineFile ListEnumerator.js
combineFile List.js
combineFile TypedList.js
combineFile ObservableChange.js
combineFile ObservableList.js
combineFile Index.js
combineFile OrderedStringIndex.js
combineFile IndexedList.js

# joopl.ui
#combineFile Binder.js
#combineFile PropertyBinder.js
#combineFile EventBinder.js
#combineFile CollectionBinder.js
#combineFile TwoWayBinder.js

# MINIFY THE COMBINED FILE
$Minifier = “C:\Program Files (x86)\Microsoft\Microsoft Ajax Minifier\AjaxMin.exe”
&$Minifier joopl.toolbox.js -out joopl.toolbox.min.js -strict:true

# Move the minified file to /test
copy-item joopl.toolbox.js -destination test\joopl.toolbox.min.js