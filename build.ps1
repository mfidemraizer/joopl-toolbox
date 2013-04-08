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

# joopl.collections
combineFile List.js
combineFile ObservableListReason.js
combineFile ObservableList.js


#get-childitem -include List.js -recurse -force | get-content | out-file joopl.toolbox.js -append
#get-childitem -include ObservableListReason.js -recurse -force  | get-content | out-file joopl.toolbox.js -append
#get-childitem -include ObservableList.js -recurse -force  | get-content | out-file joopl.toolbox.js -append

# joopl.ui
combineFile Binder.js
combineFile PropertyBinder.js
combineFile EventBinder.js
combineFile CollectionBinder.js
combineFile TwoWayBinder.js

#get-childitem -include Binder.js -recurse -force  | get-content | out-file joopl.toolbox.js -append -encoding
#get-childitem -include PropertyBinder.js -recurse -force  | get-content | out-file joopl.toolbox.js -append
#get-childitem -include EventBinder.js -recurse -force  | get-content | out-file joopl.toolbox.js -append
#get-childitem -include CollectionBinder.js -recurse -force  | get-content | out-file joopl.toolbox.js -append
#get-childitem -include TwoWayBinder.js -recurse -force  | get-content | out-file joopl.toolbox.js -append

# MINIFY THE COMBINED FILE
$Minifier = “C:\Program Files (x86)\Microsoft\Microsoft Ajax Minifier\AjaxMin.exe”
&$Minifier joopl.toolbox.js -out joopl.toolbox.min.js -strict:true