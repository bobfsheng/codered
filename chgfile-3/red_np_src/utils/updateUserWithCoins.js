import database from '@react-native-firebase/database'
import firestore from '@react-native-firebase/firestore'
const updateUserWithCoins = async (uid, redCoins) => {
  try {
    // const nameToLowerCase = userLevel.toLowerCase()
    await database().ref(`/User/${uid}`).update({
      redCoins: redCoins
    })
    await firestore().collection('User').doc(uid).update({
      redCoins: redCoins,
    })
  } catch (error) {
    throw new Error(error.message ?? 'Something went wrong')
  }
}
export { updateUserWithCoins }