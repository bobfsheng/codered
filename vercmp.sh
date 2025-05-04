function compare_for {
	local appname=$1
	if [[ $appname == "nodepkg" ]]; then
	  echo "***** package.json (orig -> red) *****"
	  diff chgfile/orig_package.json chgfile/red_package.json 
	
	elif [[ $appname == "jsconfig" ]]; then
	  echo "***** jsconfig (orig -> red) *****"
	  echo "--- app.json"
	  diff chgfile/orig_app.json chgfile/red_app.json 
	  echo "--- tsconfig.json"
	  diff chgfile/orig_tsconfig.json chgfile/red_tsconfig.json
	  if [[ -e chgfile/orig_jsconfig.json ]]; then 
	    echo "--- jsconfig.json"
	    diff chgfile/orig_jsconfig.json chgfile/red_jsconfig.json 
 	  else
	    echo "--- only red has jsconfig.json" 
	  fi
	  if [[ -e chgfile/orig_metro.config.js ]]; then
	    echo "--- metro.config.js"
	    diff chgfile/orig_metro.config.js chgfile/red_metro.config.js 
	  else
	    echo "--- only red has metro.config.js" 
	  fi
	 
	elif [[ $appname == "jssource" ]]; then
	  echo "***** jssource (orig -> red) *****"
	  echo "--- App.tsx"
	  diff chgfile/orig_App.tsx chgfile/red_App.tsx 
	  echo "--- index.js" 
	  diff chgfile/orig_index.js chgfile/red_index.js 
	  echo "--- only red has src" 
	
	elif [[ $appname == "android" ]]; then 
	  echo "***** android (orig -> red) *****"
	  diff -rq chgfile/orig_android_src chgfile/red_android_src  | grep -v DS_Store
	
	elif [[ $appname == "gradles" ]]; then 
	  echo "***** gradles (orig -> red) *****"
	  echo "--- build.gradle"
	  diff chgfile/orig_build.gradle chgfile/red_build.gradle 
	  echo "--- gradle.properties"
	  diff chgfile/orig_gradle.properties chgfile/red_gradle.properties 
	  echo "--- settings.gradle"
	  diff chgfile/orig_settings.gradle chgfile/red_settings.gradle 
	  echo "--- adroid/app/build.gradle"
	  diff chgfile/orig_app_build.gradle chgfile/red_app_build.gradle 
	
	else
	  echo "$appname has no source code to compare."
	
	fi
}	

appname=$1
if [[ -z $appname ]];  then 
  echo "Usage: vercmp.sh appname" 
  echo "   appname: nodepkg | jsconfig | jssource | android | gradles"
  echo "appname empty, will compare all apps."
  compare_for nodepkg
  compare_for jsconfig
  compare_for jssource
  compare_for android
  compare_for gradles
else
  compare_for $appname
fi

