import database from '@react-native-firebase/database'
import firestore from '@react-native-firebase/firestore'
const updateUserWithEmoji = async (uid, userEmoji) => {
  try {
    const nameToLowerCase = userEmoji.toLowerCase()
    await database().ref(`/User/${uid}`).update({
      userEmoji: nameToLowerCase,
    })
    await firestore().collection('User').doc(uid).update({
      userEmoji: nameToLowerCase,
    })
  } catch (error) {
    console.log('error =>', error.message)
    throw new Error(error.message ?? 'Something went wrong')
  }
}
export { updateUserWithEmoji }
