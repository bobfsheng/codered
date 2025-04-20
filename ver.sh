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
else
  echo "verbose=$verbose ; dir=$dir ; appname=$appname" > /dev/null
fi

if [[ ! -d $dir ]]; then
  echo "$dir does not exist!".
  exit 1
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
	if [[ $source == "red" ]]; then
          diff chgfile/red_jsconfig.json ${dir}/jsconfig.json > /dev/null 2>&1
	  diffcnt=$((diffcnt + $?))
	  diff chgfile/red_metro.config.js ${dir}/metro.config.js > /dev/null 2>&1
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
	  if ! diff chgfile/${source}_metro.config.js ${dir}/metro.config.js > /dev/null 2>&1; then 
	    echo --- metro_config.js.......
	    diff chgfile/${source}_metro.config.js ${dir}/metro.config.js | head -10
	  else
	    echo --- metro_config.js.......matched
	  fi
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
  local diffcnt=0
  if [[ $verbose != true ]]; then
    outputLineCnt=$(diff chgfile/${source}_App.tsx ${dir}/App.tsx | wc -l)
    if [[ $outputLineCnt -ne 5 ]] && ! diff chgfile/${source}_App.tsx ${dir}/App.tsx | grep "For bigger apps" > /dev/null; then 
      diffcnt=$((diffcnt + 1))
    fi
    diff chgfile/${source}_index.js ${dir}/index.js > /dev/null 2>&1
    diffcnt=$((diffcnt + $?))
    if [[ ${source} == "red" ]]; then
      if [[ -d ${dir}/src ]]; then 
	fileCnt=$(diff -r chgfile/red_np_src ${dir}/src | grep -v DS_Store | sort | wc -l)
      else 
	fileCnt=$(find chgfile/red_np_src | grep -v DS_Store | wc -l) 
      fi
      diffcnt=$((diffcnt + fileCnt))
    fi
    echo ${diffcnt}
  else
    outputLineCnt=$(diff chgfile/${source}_App.tsx ${dir}/App.tsx | wc -l)
    if [[ $outputLineCnt -ne 5 ]] && ! diff chgfile/${source}_App.tsx ${dir}/App.tsx | grep "For bigger apps" > /dev/null; then 
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
	if ! diff -rq chgfile/${source}_np_src ${dir}/src | grep -v DS_Store > /dev/null 2>&1; then
	  echo -- np src directory .......
	  diff -r chgfile/${source}_np_src ${dir}/src | grep -v DS_Store | sort | head -15
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
    diffFileCnt=$(diff -rq chgfile/${source}_android_src ${dir}/android/app/src | grep -v DS_Store | sort | wc -l)
    echo ${diffFileCnt}
  else
    diffFileCnt=$(diff -rq chgfile/${source}_android_src ${dir}/android/app/src |  grep -v DS_Store |sort | wc -l)
    if [[ $diffFileCnt -gt 0 ]]; then
      echo "--- diff detail......"
      diff -rq chgfile/${source}_android_src ${dir}/android/app/src |  grep -v DS_Store |sort  | head -15
    else
      echo "android source matched"
    fi
  fi
}

function app_ver {
	local dir=$1
	local appname=$2
	local found=false
  
	case $appname in 
	  
	  nodepkg )
	    found=false
	    for source in orig red ; do
		if diff chgfile/${source}_package.json ${dir}/package.json > /dev/null 2>&1 ; then 
			echo "***** $dir $appname ---> $source"
			found=true
			break;
		fi
	    done 
	    if [[ $found == false ]]; then
	      if [[ $verbose == true ]]; then
		for source in orig red ; do
		  echo "***** $dir $appname ---> diff from $source: "
		  diff chgfile/${source}_package.json ${dir}/package.json | head -20 
		done
	      else
		  echo "***** $dir $appname ---> NONE"
	      fi
	    fi  
	    ;;
	  jsconfig | gradles | jssource | android )	
	    cmd=("${appname}_diff" "orig" "false")
	    local origDiffCnt=$("${cmd[@]}")   
	    cmd[1]="red"
	    local redDiffCnt=$("${cmd[@]}") 
	    if [[ $origDiffCnt -le $redDiffCnt ]]; then 	## orig
		if [[ $origDiffCnt -eq 0 ]]; then
		  echo "***** $dir $appname ---> orig"
		else
		  echo "***** $dir $appname ~~~> orig"
		fi
		  if [[ $verbose == true ]]; then
			cmd[1]="orig"
			cmd[2]="true"
			"${cmd[@]}"	
		  fi 
	    else  					## red 
		if [[ $redDiffCnt -eq 0 ]]; then
		  echo "***** $dir $appname ---> red"
		else
		  echo "***** $dir $appname ~~~> red"
		  if [[ $verbose == true ]]; then
			cmd[1]="red"
			cmd[2]="true"
			"${cmd[@]}"	
		  fi 
		fi ###	diffCnt eq 0
	    fi ### ccompare orig and red diffCnt
	    ;;
	  *) 
	    echo "$appname is invalid. Valid apps: nodepkg, jsconfig, gradles, jssource, android" 
	    ;; 
	esac
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
