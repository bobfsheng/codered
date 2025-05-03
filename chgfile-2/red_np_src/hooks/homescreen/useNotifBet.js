import firestore from '@react-native-firebase/firestore'
import { useAuthSelector } from '@store'
import { sendBetNotification } from '@utils'
import axios from 'axios'
import { validationServer } from '@hooks'
import { useEffect, useState } from 'react'

const useNotifBet = ({
  id,
  friendId,
  seen,
  bettingId,
  betAmount,
  timeline,
  challengeType,
  challengeStatus: dbchallengeStatus,
}) => {
  const { userId, userName } = useAuthSelector(state => state)
  const [friendInfo, setFriendInfo] = useState({})
  const [bettigInfo, setBettingInfo] = useState({})
  const [challengeStatus, setChallengedStatus] = useState(dbchallengeStatus)
  const [challengeAcceptLoading, setChallengeAcceptLoading] = useState(false)
  const [challengeDenyLoading, setChallengeDenyLoading] = useState(false)

  const handleNotification = async (
    betAmount,
    timeline,
    challengeType,
    friendId,
    bettingId,
    challengeStatus,
  ) => {
    try {
      await firestore().collection('Notifications').add({
        uid: friendId, // to whom notification will be sent !!
        friendId: userId, // for referece to get request sending user !!
        betAmount,
        timeline,
        challengeType,
        bettingId,
        notficationType: 'bettingResponse',
        challengeStatus,
        createdAt: new Date().toISOString(),
        seen: false,
      })
      const status = challengeStatus.charAt(0).toUpperCase() + challengeStatus.slice(1)
      const message =
        challengeStatus === 'denied'
          ? `Your challenge has been denied by ${userName ?? 'anonymous'} `
          : `Your challenge has been appcepted by ${userName ?? 'anonymous'}`
      sendBetNotification(`Challenge ${status}`, message, friendId)
    } catch (error) {
      console.log('error handleNotification =>', error)
    }
  }
  const updateSeen = async () => {
    await firestore().collection('Notifications').doc(id).update({
      seen: true,
    })
  }
  const getFriendInfo = async () => {
    const friendInfo = await firestore().collection('User').doc(friendId).get()
    setFriendInfo(friendInfo.data())
  }
  const handleAcceptChallenge = async () => {
    try {
      setChallengeAcceptLoading(true)
      const betDoc = await firestore().collection('Bettings').doc(bettingId).get()
      const betData = betDoc.data()
      if (betData.status === 'cancelled') {
        await firestore().collection('Notifications').doc(id).update({
          challengeStatus: 'cancelled',
        })
        setChallengedStatus('cancelled')
        setChallengeDenyLoading(false)
        return
      }
      const userInfo = await firestore().collection('User').doc(userId).get()
      const userRedCoins = userInfo.data().redCoins
      if (userRedCoins < parseInt(betAmount)) {
        Alert.alert('Alert', `You don't have enough red coins`, [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ])
        setChallengeAcceptLoading(false)
        return
      }
      await firestore().collection('Notifications').doc(id).update({
        challengeStatus: 'accepted',
      })
      await firestore().collection('Bettings').doc(bettingId).update({
        status: 'accepted',
        updatedAt: new Date().toISOString(),
        acceptedAt: new Date().toISOString(),
      })
      await firestore()
        .collection('User')
        .doc(userId)
        .update({
          redCoins: userRedCoins - parseInt(betAmount),
        })

      validationServer
      await axios.post(`${validationServer}/bet/betAccepted`, {
        bettingId,
      })
      setChallengedStatus('accepted')
      setChallengeAcceptLoading(false)
      handleNotification(
        betAmount,
        timeline,
        challengeType,
        friendId,
        bettingId,
        'accepted',
      )
    } catch (error) {
      console.log('error handleAcceptChallenge =>', error)
      setChallengeAcceptLoading(false)
    }
  }
  const handleDenyChallenge = async () => {
    try {
      setChallengeDenyLoading(true)
      const betDoc = await firestore().collection('Bettings').doc(bettingId).get()
      const betData = betDoc.data()
      if (betData.status === 'cancelled') {
        await firestore().collection('Notifications').doc(id).update({
          challengeStatus: 'cancelled',
        })
        setChallengedStatus('cancelled')
        setChallengeDenyLoading(false)
        return
      }

      await firestore().collection('Notifications').doc(id).update({
        challengeStatus: 'denied',
      })
      await firestore().collection('Bettings').doc(bettingId).update({
        status: 'denied',
        updatedAt: new Date().toISOString(),
      })
      const userDate = await firestore().collection('User').doc(friendId).get()
      const rtRedCoins = userDate.data().redCoins
      await firestore()
        .collection('User')
        .doc(friendId)
        .update({
          redCoins: rtRedCoins + parseInt(betAmount),
        })
      setChallengedStatus('denied')
      setChallengeDenyLoading(false)
      handleNotification(
        betAmount,
        timeline,
        challengeType,
        friendId,
        bettingId,
        'denied',
      )
    } catch (error) {
      console.log('error handleDenyChallenge =>', error)
      setChallengeDenyLoading(false)
    }
  }
  const handleGetBetInfo = async () => {
    try {
      const betDoc = await firestore().collection('Bettings').doc(bettingId).get()
      setBettingInfo(betDoc.data())
    } catch (error) {
      console.log('error handleGetBetInfo =>', error)
    }
  }
  useEffect(() => {
    if (!seen) {
      updateSeen()
    }
    getFriendInfo()
    if (bettingId) {
      handleGetBetInfo
    }
  }, [bettingId])
  return {
    challengeAcceptLoading,
    challengeDenyLoading,
    challengeStatus,
    friendInfo,
    bettigInfo,
    handleAcceptChallenge,
    handleDenyChallenge,
  }
}

export { useNotifBet }
