import database from '@react-native-firebase/database'
import firestore from '@react-native-firebase/firestore'
const updateUserWithBio = async (uid, userBio) => {
  try {
    await database().ref(`/User/${uid}`).update({
      userBio,
    })
    await firestore().collection('User').doc(uid).update({
      userBio,
    })
  } catch (error) {
    console.log('error =>', error.message)
    throw new Error(error.message ?? 'Something went wrong')
  }
}
export { updateUserWithBio }
