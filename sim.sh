if [[ $1 == "clean" ]]; then 
  echo cleaning...... 
  cd andr2/android
  gradlew clean;
  cd ..
else
  cd andr2
fi
npx react-native run-android 
cd ..
