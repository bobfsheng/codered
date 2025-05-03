import messaging from '@react-native-firebase/messaging'
const requestFirebaseMessagingPermission = async () => {
  const authStatus = await messaging().requestPermission({
    provisional: true,
  })
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL

  if (enabled) {
    console.log('Firebase Messaging Authorization status:', authStatus)
  } else {
    await messaging().requestPermission({
      providesAppNotificationSettings: true,
    })
  }
}
const checkFirebaseMessagingPermission = async () => {
  const authorizationStatus = await messaging().requestPermission()

  if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) {
    // console.log('User has notification permissions enabled.')
    return true
  } else if (authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL) {
    // console.log('User has provisional notification permissions.')
    return true
  } else {
    // console.log('User has notification permissions disabled')
    return false
  }
}

export { requestFirebaseMessagingPermission, checkFirebaseMessagingPermission }
