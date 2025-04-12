if [[ $1 == "clean" ]]; then 
  echo cleaning...... 
  cd andr2/android
  gradlew clean;
  if [[ $2 == "build" ]]; then
	gradlew build
  fi
  cd ..
elif [[ $# -eq 0 ]]; then
  cd andr2
  npx react-native run-android 
fi
cd ..
