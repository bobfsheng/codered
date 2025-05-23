dir=$1
appname=$2
source=$3

if [[ -z $dir ]] || [[ -z $appname ]] || [[ -z $source ]];  then 
  echo "Usage: chg.sh dir appname source" 
  echo "   appname: nodepkg | jsconfig | jssource | android | gradles"
  echo "   source:  orig | red"  
  exit 1 
fi

### TBI: get seq from dir, which is after andr2-, and use the correspondent chgfile- directory
###      E.g., andr2 -> chgfile,  andr2-2 -> chgfile-2

echo "changing $dir $appname to $source ......"

if [[ $appname == "nodepkg" ]]; then
  cp chgfile/${source}_package.json ${dir}/package.json 
  cd $dir
  rm -fr *lock node_modules
  npm install
  cd ..

elif [[ $appname == "jsconfig" ]]; then
  cp chgfile/${source}_app.json ${dir}/app.json 
  cp chgfile/${source}_tsconfig.json ${dir}/tsconfig.json 
  if [[ -e chgfile/${source}_jsconfig.json ]]; then
    cp chgfile/${source}_jsconfig.json ${dir}/jsconfig.json 
  else
    rm ${dir}/jsconfig.json 
  fi
  if [[ -e chgfile/${source}_metro.config.js ]]; then
    cp chgfile/${source}_metro.config.js ${dir}/metro.config.js 
  else
    rm ${dir}/metro.config.js 
  fi
 
elif [[ $appname == "jssource" ]]; then
  cp chgfile/${source}_App.tsx ${dir}/App.tsx 
  if [[ -d chgfile/${source}_np_src ]]; then
	cp -fr chgfile/${source}_np_src ${dir}/src 
  else
  	rm -fr ${dir}/src
  fi
  cp chgfile/${source}_index.js ${dir}/index.js 

elif [[ $appname == "android" ]]; then 
  rm -fr ${dir}/android/app/src
  cp -fr chgfile/${source}_android_src ${dir}/android/app/src

elif [[ $appname == "gradles" ]]; then 
  cp chgfile/${source}_build.gradle ${dir}/android/build.gradle
  cp chgfile/${source}_gradle.properties ${dir}/android/gradle.properties
  cp chgfile/${source}_settings.gradle ${dir}/android/settings.gradle
  cp chgfile/${source}_app_build.gradle ${dir}/android/app/build.gradle

else
  echo "$appname has no source code to copy."

fi

echo "done."
