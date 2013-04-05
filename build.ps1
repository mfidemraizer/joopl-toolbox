Clear-Host

write-host JOOPL TOOLBOX
write-host -------------------------------------
write-host 
write-host Starting combination and minimization of JavaScript files.... 

remove-item joopl.toolbox.js
remove-item joopl.toolbox.min.js

# joopl.collections
get-childitem -include List.js -recurse -force | get-content | out-file joopl.toolbox.js -append
get-childitem -include ObservableListReason.js -recurse -force  | get-content | out-file joopl.toolbox.js -append
get-childitem -include ObservableList.js -recurse -force  | get-content | out-file joopl.toolbox.js -append

# joopl.ui
get-childitem -include Binder.js -recurse -force  | get-content | out-file joopl.toolbox.js -append
get-childitem -include PropertyBinder.js -recurse -force  | get-content | out-file joopl.toolbox.js -append
get-childitem -include EventBinder.js -recurse -force  | get-content | out-file joopl.toolbox.js -append
get-childitem -include CollectionBinder.js -recurse -force  | get-content | out-file joopl.toolbox.js -append
get-childitem -include TwoWayBinder.js -recurse -force  | get-content | out-file joopl.toolbox.js -append

# MINIFY THE COMBINED FILE
$Minifier = “C:\Program Files (x86)\Microsoft\Microsoft Ajax Minifier\AjaxMin.exe”
&$Minifier joopl.toolbox.js -out joopl.toolbox.min.js -strict:true