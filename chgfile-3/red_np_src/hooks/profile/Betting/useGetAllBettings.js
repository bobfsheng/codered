import { useEffect, useState } from 'react'
import firestore from '@react-native-firebase/firestore'
import { useAuthSelector, useUserSelector } from '@store'
import axios from 'axios'
const apiURL = 'https://paper-api.alpaca.markets/v2/account'

const useGetAllBettings = () => {
  const { userId } = useAuthSelector(state => state)
  // const { accountHistory } = useUserSelector(state => state)
  const [allPastBets, setAllPastBets] = useState([])
  const [loadingPastBets, setLoadingPastBets] = useState(false)
  const [allCurrentBet, setAllCurrentBet] = useState([])
  const [loadingCurrentBets, setLoadingCurrentBets] = useState(false)
  const [allPendingBets, setAllPendingBets] = useState([])
  const [loadingPendingBets, setLoadingPendingBets] = useState(false)

  const getAllPastUserBets = async () => {
    try {
      setLoadingPastBets(true)
      const pastBetDocsByMe = firestore()
        .collection('Bettings')
        .where('uid', '==', userId)
        .where('status', '==', 'completed')
        .get()
      const pastBetDocsByFriends = firestore()
        .collection('Bettings')
        .where('friendId', '==', userId)
        .where('status', '==', 'completed')
        .get()
      const [result1, result2] = await Promise.all([
        pastBetDocsByMe,
        pastBetDocsByFriends,
      ])
      const pastBetDocs = [...result1.docs, ...result2.docs]
      const arrPastBets = []
      await Promise.all(
        pastBetDocs.map(async doc => {
          const userDoc = firestore().collection('User').doc(doc?.data()?.uid).get()
          const friendDoc = firestore()
            .collection('User')
            .doc(doc?.data()?.friendId)
            .get()
          const [userResult, friendResult] = await Promise.all([userDoc, friendDoc])
          const userData = userResult.data()
          const friendData = friendResult.data()
          arrPastBets.push({
            ...doc.data(),
            uName: userData.userName ?? 'Anonymous',
            uEmoji: userData.userEmoji ?? '😊',
            friendName: friendData.userName ?? 'Anonymous',
            friendEmoji: friendData.userEmoji ?? '😊',
            bettingId: doc.id,
          })
        }),
      )
      setAllPastBets(arrPastBets)
      setLoadingPastBets(false)
    } catch (error) {
      console.log('error getAllPastUserBets=>', error)
      setLoadingPastBets(false)
    }
  }
  const getAllCurrentUserBets = async () => {
    try {
      setLoadingCurrentBets(true)
      const currentBetDocsByMe = firestore()
        .collection('Bettings')
        .where('uid', '==', userId)
        .where('status', '==', 'accepted')
        .get()
      const currentBetDocsByFriends = firestore()
        .collection('Bettings')
        .where('friendId', '==', userId)
        .where('status', '==', 'accepted')
        .get()
      const [result1, result2] = await Promise.all([
        currentBetDocsByMe,
        currentBetDocsByFriends,
      ])
      const arrCurrentBets = []
      const currentBetDocs = [...result1.docs, ...result2.docs]
      await Promise.all(
        currentBetDocs.map(async doc => {
          const userDoc = firestore().collection('User').doc(doc?.data()?.uid).get()
          const friendDoc = firestore()
            .collection('User')
            .doc(doc?.data()?.friendId)
            .get()
          const [userResult, friendResult] = await Promise.all([userDoc, friendDoc])
          const userData = userResult.data()
          const friendData = friendResult.data()
          const userPortfolioApi = axios.get(`${apiURL}`, {
            headers: { Authorization: `Bearer ${userData.token}` },
            timeout: 25000,
          })
          const friendPortfolioApi = axios.get(`${apiURL}`, {
            headers: { Authorization: `Bearer ${friendData.token}` },
            timeout: 25000,
          })
          const [userPortfolio, friendPortfolio] = await Promise.all([
            userPortfolioApi,
            friendPortfolioApi,
          ])
          // const userEquity = userPortfolio?.data?.equity
          // const friendEquity = friendPortfolio?.data?.equity
          arrCurrentBets.push({
            ...doc.data(),
            uName: userData.userName ?? 'Anonymous',
            uEmoji: userData.userEmoji ?? '😊',
            friendName: friendData.userName ?? 'Anonymous',
            friendEmoji: friendData.userEmoji ?? '😊',
            userCurrentEquity:userPortfolio?.data?.equity,
            friendCurrentEquity: friendPortfolio?.data?.equity,
          })
        }),
      )
      setAllCurrentBet(arrCurrentBets)
      setLoadingCurrentBets(false)
    } catch (error) {
      console.log('error getAllCurrentUserBets=>', error)

      setLoadingCurrentBets(false)
    }
  }
  const getAllPendingUserBets = async () => {
    try {
      setLoadingPendingBets(true)
      const currentBetDocsByMe = firestore()
        .collection('Bettings')
        .where('uid', '==', userId)
        .where('status', '==', 'pending')
        .get()
      const currentBetDocsByFriends = firestore()
        .collection('Bettings')
        .where('friendId', '==', userId)
        .where('status', '==', 'pending')
        .get()
      const [result1, result2] = await Promise.all([
        currentBetDocsByMe,
        currentBetDocsByFriends,
      ])
      const arrPendingBets = []
      const pendingBetDocs = [...result1.docs, ...result2.docs]
      await Promise.all(
        pendingBetDocs.map(async doc => {
          const userDoc = firestore().collection('User').doc(doc?.data()?.uid).get()
          const friendDoc = firestore()
            .collection('User')
            .doc(doc?.data()?.friendId)
            .get()
          const [userResult, friendResult] = await Promise.all([userDoc, friendDoc])
          const userData = userResult.data()
          const friendData = friendResult.data()
          const userPortfolioApi = axios.get(`${apiURL}`, {
            headers: { Authorization: `Bearer ${userData.token}` },
            timeout: 25000,
          })
          const friendPortfolioApi = axios.get(`${apiURL}`, {
            headers: { Authorization: `Bearer ${friendData.token}` },
            timeout: 25000,
          })
          const [userPortfolio, friendPortfolio] = await Promise.all([
            userPortfolioApi,
            friendPortfolioApi,
          ])
          // const friendEquity = friendPortfolio.data.equity
          arrPendingBets.push({
            ...doc.data(),
            betId: doc.id,
            uName: userData.userName ?? 'Anonymous',
            uEmoji: userData.userEmoji ?? '😊',
            friendName: friendData.userName ?? 'Anonymous',
            friendEmoji: friendData.userEmoji ?? '😊',
            userCurrentEquity: userPortfolio?.data?.equity,
            friendCurrentEquity: friendPortfolio?.data?.equity,
          })
        }),
      )
      setAllPendingBets(arrPendingBets)
      setLoadingPendingBets(false)
    } catch (error) {
      console.log('error getAllPendingUserBets=>', error)

      setLoadingPendingBets(false)
    }
  }
  const getAllBets = () => {
    getAllPastUserBets()
    getAllCurrentUserBets()
    getAllPendingUserBets()
  }
  useEffect(() => {
    getAllBets()
  }, [])

  return {
    loadingPastBets,
    loadingCurrentBets,
    loadingPendingBets,
    allPastBets,
    allCurrentBet,
    allPendingBets,
    getAllPendingUserBets,
    getAllBets,
  }
}

export { useGetAllBettings }
