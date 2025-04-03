import { useEffect } from 'react'
import messaging from '@react-native-firebase/messaging'
import {
  checkFirebaseMessagingPermission,
  requestFirebaseMessagingPermission,
} from '@utils'
import { authActions, useAuthSelector, useReduxDispatch } from '@store'

const fcmTokenToRedux = () => {
  const dispatch = useReduxDispatch()
  const { fcmToken } = useAuthSelector(state => state)
  function saveTokenToDatabase(token) {
    dispatch(authActions.setFcmToken({ fcmToken: token }))
  }
  useEffect(() => {
    ;(async () => {
      const permisson = await checkFirebaseMessagingPermission()
      if (permisson) {
        if (fcmToken) return
        messaging()
          .getToken()
          .then(token => {
            return saveTokenToDatabase(token)
          })
        return messaging().onTokenRefresh(token => {
          saveTokenToDatabase(token)
        })
      } else {
        await requestFirebaseMessagingPermission()
      }
    })()
  }, [])
  return {}
}

export { fcmTokenToRedux }
