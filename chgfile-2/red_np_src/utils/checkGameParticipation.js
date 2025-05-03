import firestore from '@react-native-firebase/firestore'


const checkGameParticipation = async (userId, secretCode) => {
  try {
    const docSnapshot = await firestore()
      .collection('Games')
      .doc(secretCode.toUpperCase())
      .collection('Leaderboard')
      .doc(userId)
      .get()

    if (docSnapshot.exists) {
      console.log('Document exists:', docSnapshot.data())
      return true
    } else {
      console.log('Document does not exist')
      return false
    }
  } catch (error) {
    console.log('Error:', error.message)
    throw new Error(error.message ?? 'Something went wrong')
  }
}

export { checkGameParticipation }