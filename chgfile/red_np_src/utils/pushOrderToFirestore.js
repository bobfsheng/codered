import firestore from '@react-native-firebase/firestore'

/**
 * Push order data to Firestore under Orders/{userId}/user_orders/{timestamp}.
 * Removes null or undefined values from orderData before pushing to Firestore.
 *
 * @param {string} userId - The user's ID.
 * @param {Object} orderData - The order data to store.
 */
const pushOrderToFirestore = async (userId, orderData) => {
  try {
    const timestamp = new Date().getTime() // Current Unix timestamp

    // Filter out null or undefined values from orderData
    const filteredOrderData = Object.fromEntries(
      Object.entries(orderData).filter(
        ([_, value]) => value !== null && value !== undefined,
      ),
    )

    await firestore()
      .collection('Orders') // Parent collection for orders
      .doc(userId) // Document for the user ID
      .collection('userOrders') // Subcollection for the user's orders
      .doc(`${timestamp}`) // Timestamp as document ID
      .set(filteredOrderData) // Filtered order data as the document content

    console.log('Order data successfully pushed to Firestore')
  } catch (error) {
    console.error('Error pushing order data to Firestore:', error.message)
    throw new Error(error.message ?? 'Something went wrong')
  }
}

export { pushOrderToFirestore }
