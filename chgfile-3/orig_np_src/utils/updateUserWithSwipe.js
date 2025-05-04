import database from '@react-native-firebase/database'
import firestore from '@react-native-firebase/firestore'
const updateUserWithSwipe = async (uid, userSwipe) => {
  try {
    // const nameToLowerCase = userLevel.toLowerCase()
    // await database().ref(`/User/${uid}`).update({
    //   userSwipe: userSwipe
    // })
    await firestore().collection('User').doc(uid).update({
      userSwipe: userSwipe
    })
  } catch (error) {
    console.log('error =>', error.message)
    throw new Error(error.message ?? 'Something went wrong')
  }
}
export { updateUserWithSwipe }