import { useState } from 'react'
import firestore from '@react-native-firebase/firestore'
import { authActions, useAuthSelector, useReduxDispatch } from '@store'
import { Alert } from 'react-native'
import { sendBetNotification } from '@utils'
const usePlaceBetting = () => {
  const dispatch = useReduxDispatch()
  const { userId, userName } = useAuthSelector(state => state)
  const [betLoading, setBetLoading] = useState(false)
  const [showBetConfirmModal, setShowBetConfirmModal] = useState(false)
  const handleNotification = async (
    betAmount,
    timeline,
    challengeType,
    friendId,
    bettingId,
  ) => {
    try {
      await firestore().collection('Notifications').add({
        uid: friendId, // to whom notification will be sent !!
        friendId: userId, // for referece to get request sending user !!
        betAmount,
        timeline,
        challengeType,
        bettingId,
        notficationType: 'bettingRequest',
        challengeStatus: 'pending',
        createdAt: new Date().toISOString(),
        seen: false,
      })
      sendBetNotification(
        'Challenge',
        `You have a new challenge from ${userName}`,
        friendId,
      )
    } catch (error) {
      console.log('error handleNotification =>', error)
    }
  }
  const handlePlaceBet = async (betAmount, timeline, challengeType, friendId) => {
    try {
      setBetLoading(true)
      const userDate = await firestore().collection('User').doc(userId).get()
      const rtRedCoins = userDate.data().redCoins
      if (rtRedCoins < betAmount) {
        Alert.alert('Alert', `You don't have enough red coins for the challenge`, [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ])
        setBetLoading(false)
        return
      }
      const userQuery1 = firestore()
        .collection('Bettings')
        .where('uid', '==', userId)
        .where('friendId', '==', friendId)
        .where('status', '==', 'pending')
        .get()

      const userQuery2 = firestore()
        .collection('Bettings')
        .where('uid', '==', userId)
        .where('friendId', '==', friendId)
        .where('status', '==', 'accepted')
        .get()

      const friendQuery1 = firestore()
        .collection('Bettings')
        .where('uid', '==', userId)
        .where('friendId', '==', friendId)
        .where('status', '==', 'pending')
        .get()

      const friendQuery2 = firestore()
        .collection('Bettings')
        .where('uid', '==', userId)
        .where('friendId', '==', friendId)
        .where('status', '==', 'accepted')
        .get()
      const [result1, result2] = await Promise.all([userQuery1, userQuery2])
      const [result3, result4] = await Promise.all([friendQuery1, friendQuery2])

      const alreadyBettingByMe = [...result1.docs, ...result2.docs]
      const alreadyBettingByFriend = [...result3.docs, ...result4.docs]
      const bettingByMe = []
      const bettingByFriend = []
      alreadyBettingByMe.forEach(doc => {
        bettingByMe.push(doc.data())
      })
      alreadyBettingByFriend.forEach(doc => {
        bettingByFriend.push(doc.data())
      })
      if (bettingByMe.length > 0) {
        setBetLoading(false)
        Alert.alert('Alert', 'Your challenge has already been sent', [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ])
        return
      }
      if (bettingByFriend.length > 0) {
        setBetLoading(false)
        Alert.alert(
          'Alert',
          'You have a pending challenge request or an active challenge',
          [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
        )
        return
      }
      const bettingPlaced = await firestore().collection('Bettings').add({
        uid: userId,
        friendId,
        betAmount,
        timeline,
        challengeType,
        createdAt: new Date().toISOString(),
        status: 'pending',
      })
      await firestore()
        .collection('User')
        .doc(userId)
        .update({
          redCoins: rtRedCoins - parseInt(betAmount),
        })
      dispatch(authActions.setRedCoins({ redCoins: rtRedCoins - parseInt(betAmount) }))
      handleNotification(betAmount, timeline, challengeType, friendId, bettingPlaced.id)
      setShowBetConfirmModal(true)
      // NavigationService.goBack()
      setBetLoading(false)
    } catch (error) {
      console.log('error handlePlaceBet =>', error)
      setBetLoading(false)
    }
  }
  const handleCancelBet = async (bettingId, betAmount) => {
    try {
      setBetLoading(true)
      await firestore().collection('Bettings').doc(bettingId).update({
        status: 'cancelled',
        updatedAt: new Date().toISOString(),
      })
      const notifDoc = await firestore()
        .collection('Notifications')
        .where('uid', '==', userId)
        .where('bettingId', '==', bettingId)
        .where('notficationType', '==', 'bettingRequest')
        .where('challengeStatus', '==', 'pending')
        .get()
      if (notifDoc?.docs.length > 0 && notifDoc?.docs[0]?.data()) {
        await firestore().collection('Notifications').doc(notifDoc?.docs[0]?.id).update({
          challengeStatus: 'cancelled',
          updatedAt: new Date().toISOString(),
        })
      }
      const userDate = await firestore().collection('User').doc(userId).get()
      const rtRedCoins = userDate.data().redCoins
      await firestore()
        .collection('User')
        .doc(userId)
        .update({
          redCoins: rtRedCoins + parseInt(betAmount),
        })
      setBetLoading(false)
    } catch (error) {
      console.log('error handleCancelBet =>', error)
      setBetLoading(false)
    }
  }
  return {
    betLoading,
    showBetConfirmModal,
    setShowBetConfirmModal,
    handlePlaceBet,
    handleCancelBet,
  }
}

export { usePlaceBetting }
