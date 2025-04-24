import database from '@react-native-firebase/database'
import firestore from '@react-native-firebase/firestore'

const checkIfUserNameAvailable = async userName => {
  try {
    const nameToLowerCase = userName.toLowerCase()
    const snapshot = await database()
      .ref('/User')
      .orderByChild('userName')
      .equalTo(nameToLowerCase)
      .once('value')
    const searchedUserByName = await firestore()
      .collection('User')
      .where('userName', '==', nameToLowerCase)
      .get()
    if (!snapshot.val() && searchedUserByName.docs.length === 0) {
      return true
    } else {
      throw new Error('User name already exists')
    }
  } catch (error) {
    console.log('error =>', error.message)
    throw new Error(error.message ?? 'Something went wrong')
  }
}
export { checkIfUserNameAvailable }
