## get version, print detail diff if closest but not 100% match 
# set -x

positional_args=()
verbose=false

while [[ $# -gt 0 ]]; do
	case "$1" in 
	  -v)	verbose=true; shift ;;
	  -*)   echo "Unknown options: $1" ; exit 1;;
	  *)	positional_args+=("$1"); shift ;; 
	esac
done
dir="${positional_args[0]}"
appname="${positional_args[1]}"

if [[ -z $dir ]] ;  then 
  echo "Usage: ver.sh [-v] dir [appname]" 
  echo "   -v could be at any position"
  echo "   appname: nodepkg | jsconfig | jssource | android | gradles"
  exit 1 
# else
#   echo "verbose=$verbose ; dir=$dir ; appname=$appname"
fi

function jsconfig_diff {
  local source=$1
  local verbose=$2
  local diffcnt=0;
  if [[ $verbose != true ]]; then 
	diff chgfile/${source}_app.json ${dir}/app.json > /dev/null 2>&1
	diffcnt=$((diffcnt + $?))
	diff chgfile/${source}_tsconfig.json ${dir}/tsconfig.json > /dev/null 2>&1
	diffcnt=$((diffcnt + $?))
	diff chgfile/${source}_metro.config.js ${dir}/metro.config.js > /dev/null 2>&1
	diffcnt=$((diffcnt + $?))
	if [[ $source == "red" ]]; then
          diff chgfile/red_jsconfig.json ${dir}/jsconfig.json > /dev/null 2>&1
	  diffcnt=$((diffcnt + $?))
	fi
	echo $diffcnt	
  else 
	if ! diff chgfile/${source}_app.json ${dir}/app.json > /dev/null 2>&1; then  
	  echo --- app.json.......
	  diff chgfile/${source}_app.json ${dir}/app.json | head -10
	else
	  echo --- app.json.......matched
	fi
	if ! diff chgfile/${source}_tsconfig.json ${dir}/tsconfig.json > /dev/null 2>&1; then
	  echo --- tsconfig.json.......
	  diff chgfile/${source}_tsconfig.json ${dir}/tsconfig.json | head -10
	else
	  echo --- tsconfig.json.......matched
	fi
	if [[ $source == "red" ]]; then
	  if diff chgfile/red_jsconfig.json ${dir}/jsconfig.json > /dev/null 2>&1; then
		echo --- jsconfig.json.......
          	diff chgfile/red_jsconfig.json ${dir}/jsconfig.json | head -10
	  else
	  	echo --- jsconfig.json.......matched
	  fi
	fi
	if ! diff chgfile/${source}_metro.config.js ${dir}/metro.config.js > /dev/null 2>&1; then 
	  echo --- metro_config.js.......
	  diff chgfile/${source}_metro.config.js ${dir}/metro.config.js | head -10
	else
	  echo --- metro_config.js.......matched
	fi
  fi
}

function gradles_diff {
  local source=$1
  local verbose=$2
  local diffcnt=0;
  if [[ $verbose != true ]]; then 
	diff chgfile/${source}_build.gradle ${dir}/android/build.gradle > /dev/null 2>&1
	diffcnt=$((diffcnt + $?))
	diff chgfile/${source}_gradle.properties ${dir}/android/gradle.properties > /dev/null 2>&1
	diffcnt=$((diffcnt + $?))
	diff chgfile/${source}_settings.gradle ${dir}/android/settings.gradle > /dev/null 2>&1
	diffcnt=$((diffcnt + $?))
	diff chgfile/${source}_app_build.gradle ${dir}/android/app/build.gradle > /dev/null 2>&1
	diffcnt=$((diffcnt + $?))
	echo $diffcnt	
  else 
	if ! diff chgfile/${source}_build.gradle ${dir}/android/build.gradle > /dev/null 2>&1; then  
	  echo --- build.gradle.......
	  diff chgfile/${source}_build.gradle ${dir}/android/build.gradle | head -10
	else
	  echo --- build.gradle.......matched
	fi
	if ! diff chgfile/${source}_gradle.properties ${dir}/android/gradle.properties > /dev/null 2>&1; then
	  echo --- gradle.properties.......
	  diff chgfile/${source}_gradle.properties ${dir}/android/gradle.properties | head -10
	else
	  echo --- gradle.properties.......matched
	fi
	if ! diff chgfile/${source}_settings.gradle ${dir}/android/settings.gradle > /dev/null 2>&1; then 
	  echo --- settings.gradle.......
	  diff chgfile/${source}_settings.gradle ${dir}/android/settings.gradle | head -10
	else
	  echo --- settings.gradle.......matched
	fi
	if ! diff chgfile/${source}_app_build.gradle ${dir}/android/app/build.gradle > /dev/null 2>&1; then 
	  echo --- app/build.gradle.......
	  diff chgfile/${source}_app_build.gradle ${dir}/android/app/build.gradle | head -10
	else
	  echo --- app/build.gradle.......matched
	fi
  fi ## verbose or no
}

function jssource_diff {
  local source=$1
  local verbose=$2
  local diffcnt=0;
  if [[ $verbose != true ]]; then
    diff chgfile/${source}_App.tsx ${dir}/App.tsx > /dev/null 2>&1
    diffcnt=$((diffcnt + $?))
    diff chgfile/${source}_index.js ${dir}/index.js > /dev/null 2>&1
    diffcnt=$((diffcnt + $?))
    if [[ ${source} == "red" ]]; then
      fileCnt=$(diff -r chgfile/${source}_np_src ${dir}/src | sort | wc -l)
      diffcnt=$((diffcnt + fileCnt))
    fi
    echo ${diffcnt}
  else
    if ! diff chgfile/${source}_App.tsx ${dir}/App.tsx > /dev/null 2>&1; then
      echo --- App.tsx......
      diff chgfile/${source}_App.tsx ${dir}/App.tsx > /dev/null 2>&1
    else
      echo --- App.tsx......matched
    fi
    if ! diff chgfile/${source}_index.js ${dir}/index.js > /dev/null 2>&1; then
      echo --- index.js......
      diff chgfile/${source}_index.js ${dir}/index.js > /dev/null 2>&1
    else
      echo --- index.js......matched
    fi
    if [[ -d chgfile/${source}_np_src ]]; then
	if ! diff -rq chgfile/${source}_np_src ${dir}/src > /dev/null 2>&1; then
	  echo -- np src directory .......
	  diff -r chgfile/${source}_np_src ${dir}/src | sort | head -15
	else
	  echo -- np src directory ......matched
	fi
    fi
  fi ## verbose or no
}

function android_diff {
  local source=$1
  local verbose=$2
  local diffcnt=0;
  if [[ $verbose != true ]]; then
    diffFileCnt=$(diff -r chgfile/${source}_android_src ${dir}/android/app/src | sort | wc -l)
    echo ${diffcnt}
  else
    if ! diff -rq chgfile/${source}_android_src ${dir}/android/app/src > /dev/null 2>&1; then
      echo "--- diff detail......"
      diff -r chgfile/${source}_android_src ${dir}/android/app/src | sort | head -15
    else
      echo "--- all files matched."
    fi
  fi
}

function app_ver {
	local dir=$1
	local appname=$2
	local found=false
  
	if [[ $appname == "nodepkg" ]]; then
	  found=false
	  for source in orig red ; do
		if diff ${dir}/package.json chgfile/${source}_package.json > /dev/null 2>&1 ; then 
			echo "$dir $appname ---> $source"
			found=true
			break;
		fi
	  done 
	  if [[ ! $found ]] && [[ $verbose == true ]]; then
		for source in orig red ; do
		  echo "$dir $appname ---> diff from $source: "
		  diff ${dir}/package.json chgfile/${source}_package.json | head -10 
		done
	  fi  

	elif [[ $appname == "jsconfig" ]]; then
	  local origDiffCnt=$(jsconfig_diff orig false)   
	  local redDiffCnt=$(jsconfig_diff red false)   
	  if [[ $origDiffCnt -le $redDiffCnt ]]; then 	## orig
		if [[ $origDiffCnt -eq 0 ]]; then
		  echo "$dir $appname ---> orig"
		else
		  echo "$dir $appname ~~~> orig"
		  if [[ $verbose == true ]]; then
			jsconfig_diff orig true
		  fi 
		fi
	  else  					## red 
		if [[ $redDiffCnt -eq 0 ]]; then
		  echo "$dir $appname ---> red"
		else
		  echo "$dir $appname ~~~> red"
		  if [[ $verbose == true ]]; then
			jsconfig_diff red true
		  fi 
		fi	
	  fi

	elif [[ $appname == "gradles" ]]; then 
	  local origDiffCnt=$(gradles_diff orig false)   
	  local redDiffCnt=$(gradles_diff red false)   

	  if [[ $origDiffCnt -le $redDiffCnt ]]; then 	## orig
		if [[ $origDiffCnt -eq 0 ]]; then
		  echo "$dir $appname ---> orig"
		else
		  echo "$dir $appname ~~~> orig"
		  if [[ $verbose == true ]]; then
			gradles_diff orig true
		  fi 
		fi
	  else  					## red 
		if [[ $redDiffCnt -eq 0 ]]; then
		  echo "$dir $appname ---> red"
		else
		  echo "$dir $appname ~~~> red"
		  if [[ $verbose == true ]]; then
			gradles_diff red true
		  fi 
		fi	
	  fi

	elif [[ $appname == "jssource" ]]; then
	  local origDiffCnt=$(jssource_diff orig false)   
	  local redDiffCnt=$(jssource_diff red false)   
	  if [[ $origDiffCnt -le $redDiffCnt ]]; then 	## orig
		if [[ $origDiffCnt -eq 0 ]]; then
		  echo "$dir $appname ---> orig"
		else
		  echo "$dir $appname ~~~> orig"
		  if [[ $verbose == true ]]; then
			jssource_diff orig true
		  fi 
		fi
	  else  					## red 
		if [[ $redDiffCnt -eq 0 ]]; then
		  echo "$dir $appname ---> red"
		else
		  echo "$dir $appname ~~~> red"
		  if [[ $verbose == true ]]; then
			jssource_diff red true
		  fi 
		fi	
	  fi

	elif [[ $appname == "android" ]]; then 
	  local origDiffCnt=$(android_diff orig false)   
	  local redDiffCnt=$(android_diff red false)   
	  if [[ $origDiffCnt -le $redDiffCnt ]]; then 	## orig
		if [[ $origDiffCnt -eq 0 ]]; then
		  echo "$dir $appname ---> orig"
		else
		  echo "$dir $appname ~~~> orig"
		  if [[ $verbose == true ]]; then
			android_diff orig true
		  fi 
		fi
	  else  					## red 
		if [[ $redDiffCnt -eq 0 ]]; then
		  echo "$dir $appname ---> red"
		else
		  echo "$dir $appname ~~~> red"
		  if [[ $verbose == true ]]; then
			android_diff red true
		  fi 
		fi	
	  fi

	else
	  echo "$appname has no source code."
	fi
}

if [[ -z $appname ]]; then 
	app_ver $dir nodepkg 
	app_ver $dir jsconfig 
	app_ver $dir gradles
	app_ver $dir jssource 
	app_ver $dir android 
else
	app_ver $dir $appname
fi 

#set -x
