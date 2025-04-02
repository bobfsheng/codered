dir=$1
appname=$2
source=$3

if [[ -z $dir ]] || [[ -z $appname ]] || [[ -z $source ]];  then 
  echo "Usage: chg.sh dir appname source" 
  echo "   appname: np | android | gradle"
  echo "   source:  orig | red"  
  exit 1 
fi

echo "changing $dir $appname $source ......"

if [[ $appname == "np" ]]; then
  cp chgfile/${source}_App.tsx ${dir}/App.tsx 
  cp chgfile/${source}_app.json ${dir}/app.json 
  cp chgfile/${source}_package.json ${dir}/package.json 
  if [[ $source == "red" ]]; then
	cp chgfile/red_jsconfig.json ${dir}/jsconfig.json 
  	rm -fr ${dir}/src
	cp chgfile/red_np_src ${dir}/src 
  fi
  cp chgfile/${source}_tsconfig.json ${dir}/tsconfig.json 
  cp chgfile/${source}_metro.config.js ${dir}/metro.config.js 
  cp chgfile/${source}_index.js ${dir}/index.js 
 
elif [[ $appname == "android" ]]; then 
  rm -fr ${dir}/android/app/src
  cp -fr chgfile/${source}_android_src ${dir}/android/app/src

elif [[ $appname == "gradle" ]]; then 
  cp chgfile/${source}_build.gradle ${dir}/android/build.gradle
  cp chgfile/${source}_gradle.properties ${dir}/android/gradle.properties
  cp chgfile/${source}_settings.gradle ${dir}/android/settings.gradle
  cp chgfile/${source}_app_build.gradle ${dir}/android/app/build.gradle

else
  echo "$appname has no source code to copy."

fi

echo "done."
