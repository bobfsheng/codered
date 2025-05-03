import database from '@react-native-firebase/database'
import firestore from '@react-native-firebase/firestore'

const updateUserWithUserName = async (uid, userName) => {
  try {
    const nameToLowerCase = userName.toLowerCase()
    await database().ref(`/User/${uid}`).update({
      userName: nameToLowerCase,
    })
    await firestore().collection('User').doc(uid).update({
      userName: nameToLowerCase,
    })
  } catch (error) {
    console.log('error =>', error.message)
    throw new Error(error.message ?? 'Something went wrong')
  }
}
export { updateUserWithUserName }
