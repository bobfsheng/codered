import firestore from '@react-native-firebase/firestore'

/**
 * Cancel an order by updating its status in Firestore.
 *
 * @param {string} userId - The user's ID.
 * @param {string} selectedOrder - The Alpaca order ID of the order to cancel.
 */
const cancelOrderFirestore = async (userId, selectedOrder) => {
  try {
    console.log(`Attempting to cancel order: ${selectedOrder} for user: ${userId}`)

    // Reference the user's orders collection
    const userOrdersRef = firestore()
      .collection('Orders')
      .doc(userId)
      .collection('userOrders')

    // Query for the order with the matching Alpaca order ID
    const querySnapshot = await userOrdersRef
      .where('id', '==', selectedOrder) // Ensure correct field name
      .get()



    if (querySnapshot.empty) {
      throw new Error(`Order with Alpaca ID ${selectedOrder} not found.`)
    }

    // Update all matching documents (should ideally be one match)
    querySnapshot.forEach(async doc => {
      await doc.ref.update({
        status: 'canceled',
        canceled_at: new Date().toISOString(), // Add timestamp for cancellation
      })
    })
  } catch (error) {
    throw new Error(error.message ?? 'Failed to cancel the order.')
  }
}

export { cancelOrderFirestore }
