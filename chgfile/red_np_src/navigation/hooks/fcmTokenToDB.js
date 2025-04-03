import { useEffect } from 'react'
import firestore from '@react-native-firebase/firestore'
import { useAuthSelector } from '@store'

const fcmTokenToDB = () => {
  const { fcmToken, userId } = useAuthSelector(state => state)
  const saveTokenToDB = async (userId, fcmToken) => {
    const documentSnapshot = await firestore().collection('User').doc(userId).get()
    const fcmTokens = documentSnapshot.data()?.fcmTokens || []
    const uid = documentSnapshot.data()?.uid
    if (!uid) return
    if (!fcmTokens?.includes(fcmToken)) {
      await firestore()
        .collection('User')
        .doc(userId)
        .update({
          fcmTokens: [fcmToken],
        })
    }
    if (!uid) {
      await firestore().collection('User').doc(userId).update({
        uid: userId,
      })
    }
  }
  useEffect(() => {
    if (!userId || !fcmToken) return
    saveTokenToDB(userId, fcmToken)
  }, [userId, fcmToken])
  return {}
}

export { fcmTokenToDB }
