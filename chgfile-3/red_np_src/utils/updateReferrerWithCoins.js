import firestore from '@react-native-firebase/firestore'

const updateReferrerWithCoins = async (uid, redCoinsToAdd) => {
  try {
    // Fetch the current redCoins value from Firestore
    const userDoc = await firestore().collection('User').doc(uid).get()
    const currentRedCoins = userDoc.data()?.redCoins || 0 // Default to 0 if redCoins doesn't exist

    // Calculate the new redCoins value by adding redCoinsToAdd
    const newRedCoins = currentRedCoins + redCoinsToAdd

    // Update the redCoins value for the user in Firestore
    await firestore().collection('User').doc(uid).update({
      redCoins: newRedCoins,
    })
  } catch (error) {
    throw new Error(error.message ?? 'Something went wrong')
  }
}

export { updateReferrerWithCoins }
