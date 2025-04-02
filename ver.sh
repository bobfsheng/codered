dir=$1
appname=$2

if [[ -z $dir ]] ;  then 
  echo "Usage: ver.sh dir [appname]" 
  echo "   appname: np | android | gradle"
  exit 1 
fi

function app_ver {
	local dir=$1
	local appname=$2
	local app
	
  
	if [[ $appname == "np" ]]; then
	  app="nodepkg"
	  for source in orig red ; do
		if diff ${dir}/package.json chgfile/${source}_package.json > /dev/null 2>&1 ; then 
			echo "$dir $app ---> $source"
			break;
		fi
	  done 
	elif [[ $appname == "android" ]]; then 
		if [[ -d ${dir}/android/app/src/main/jni ]]; then 
			echo "$dir $appname ---> red"
		else
			echo "$dir $appname ---> orig"
		fi  
	elif [[ $appname == "gradle" ]]; then 
	  app="gradles"
	  for source in orig red ; do
		if diff ${dir}/android/build.gradle chgfile/${source}_build.gradle > /dev/null 2>&1 ; then 
			echo "$dir $app ---> $source"
			break;
		fi
	  done 
	else
	  echo "$appname has no source code."
	fi
}

if [[ -z $appname ]]; then 
	app_ver $dir np 
	app_ver $dir android 
	app_ver $dir gradle
else
	app_ver $dir $appname
fi 

