import firestore from '@react-native-firebase/firestore'


const pushGameLeaderboardScore = async (userId, score, secretCode, userName) => {
  try {
    await firestore()
      .collection('Games')
      .doc(secretCode?.toUpperCase())
      .collection('Leaderboard')
      .doc(userId)
      .set(
        {
          userName: userName,
          score: score,
        },
        { merge: true },
      )
    console.log('helloooo') // Successfully created or updated the document
  } catch (error) {
    console.log('Error:', error.message)
    throw new Error(error.message ?? 'Something went wrong')
  }
}


export { pushGameLeaderboardScore }
