import firestore from '@react-native-firebase/firestore'

/**
 * Push game data to Firestore under gameHub/{userId}/{timestamp}.
 * @param {string} userId - The user's ID.
 * @param {Object} gameData - The game data to store.
 */
const pushGameToFirestore = async (userId, gameData) => {
  try {
    const timestamp = new Date().getTime() // Current Unix timestamp

    await firestore()
      .collection('gameHub')
      .doc(userId)
      .collection('games')
      .doc(`${timestamp}`)
      .set(gameData)

    console.log('Game data successfully pushed to Firestore')
  } catch (error) {
    console.error('Error pushing game data to Firestore:', error.message)
    throw new Error(error.message ?? 'Something went wrong')
  }
}

export { pushGameToFirestore }
