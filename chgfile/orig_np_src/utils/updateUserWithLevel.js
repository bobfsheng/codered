import database from '@react-native-firebase/database'
import firestore from '@react-native-firebase/firestore'

const updateUserWithLevel = async (uid, categoryName, level) => {
  try {
    await firestore().collection('User').doc(uid).update({
      [`userLevel.${categoryName}`]: level,  // Update just the level for the given category
    })
  } catch (error) {
    console.log('error =>', error.message)
    throw new Error(error.message ?? 'Something went wrong')
  }
}
export { updateUserWithLevel }


