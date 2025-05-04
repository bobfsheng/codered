import { useEffect, useState } from 'react'
import firestore from '@react-native-firebase/firestore'
import { useAuthSelector, useUserSelector } from '@store'
import axios from 'axios'
const apiURL = 'https://paper-api.alpaca.markets/v2/account'

const useGetBettings = ({ friend }) => {
  const { userId } = useAuthSelector(state => state)
  const { portfolio_equity } = useUserSelector(state => state)
  const [pastBets, setPastBets] = useState([])
  const [loadingPastBets, setLoadingPastBets] = useState(false)
  const [currentBet, setCurrentBet] = useState([])
  const [loadingCurrentBets, setLoadingCurrentBets] = useState(false)
  const [allPendingBets, setAllPendingBets] = useState([])
  const [loadingPendingBets, setLoadingPendingBets] = useState(false)

  const getPastUserBets = async () => {
    try {
      setLoadingPastBets(true)
      const pastBetDocsByMe = await firestore()
        .collection('Bettings')
        .where('uid', '==', userId)
        .where('friendId', '==', friend.uid)
        .where('status', '==', 'completed')
        .get()
      const pastBetDocsByFriend = await firestore()
        .collection('Bettings')
        .where('uid', '==', friend.uid)
        .where('friendId', '==', userId)
        .where('status', '==', 'completed')
        .get()
      const [result1, result2] = await Promise.all([pastBetDocsByMe, pastBetDocsByFriend])
      const pastBetDocs = [...result1.docs, ...result2.docs]
      const arrPastBets = []
      pastBetDocs.forEach(doc =>
        arrPastBets.push({
          ...doc.data(),
          friendName: friend.userName ?? 'Anonymous',
          friendEmoji: friend.userEmoji ?? '😊',
        }),
      )
      // console.log({ arrPastBets })
      setPastBets(arrPastBets)
      setLoadingPastBets(false)
      // console.log({ arrPastBets })
    } catch (error) {
      console.log('error getPastUserBets=>', error)
      setLoadingPastBets(false)
    }
  }
  const getCurrentUserBets = async () => {
    try {
      setLoadingCurrentBets(true)
      const currentBetDocsByMe = await firestore()
        .collection('Bettings')
        .where('uid', '==', userId)
        .where('friendId', '==', friend.uid)
        .where('status', '==', 'accepted')
        .get()
      const currentBetDocsByFriend = await firestore()
        .collection('Bettings')
        .where('uid', '==', friend.uid)
        .where('friendId', '==', userId)
        .where('status', '==', 'accepted')
        .get()
      const [result1, result2] = await Promise.all([
        currentBetDocsByMe,
        currentBetDocsByFriend,
      ])
      const arrCurrentBets = []
      const currentBetDocs = [...result1.docs, ...result2.docs]
      await Promise.all(
        currentBetDocs.map(async doc => {
          const friendPortfolioApi = await axios.get(`${apiURL}`, {
            headers: { Authorization: `Bearer ${friend.token}` },
            timeout: 25000,
          })
          const [friendPortfolio] = await Promise.all([friendPortfolioApi])
          const friendEquity = friendPortfolio.data.equity
          arrCurrentBets.push({
            ...doc.data(),
            friendName: friend.userName ?? 'Anonymous',
            friendEmoji: friend.userEmoji ?? '😊',
            userCurrentEquity: portfolio_equity,
            friendCurrentEquity: friendPortfolio?.data?.equity,
          })
        }),
      )
      setCurrentBet(arrCurrentBets)
      setLoadingCurrentBets(false)
    } catch (error) {
      console.log('error getCurrentUserBets=>', error)

      setLoadingCurrentBets(false)
    }
  }
  const getPendingUserBets = async () => {
    try {
      setLoadingPendingBets(true)
      const currentBetDocsByMe = await firestore()
        .collection('Bettings')
        .where('uid', '==', userId)
        .where('friendId', '==', friend.uid)
        .where('status', '==', 'pending')
        .get()
      const currentBetDocsByFriend = await firestore()
        .collection('Bettings')
        .where('uid', '==', friend.uid)
        .where('friendId', '==', userId)
        .where('status', '==', 'pending')
        .get()
      const [result1, result2] = await Promise.all([
        currentBetDocsByMe,
        currentBetDocsByFriend,
      ])
      const arrPendingBets = []
      const currentBetDocs = [...result1.docs, ...result2.docs]
      await Promise.all(
        currentBetDocs.map(async doc => {
          const friendPortfolio = await axios.get(`${apiURL}`, {
            headers: { Authorization: `Bearer ${friend.token}` },
            timeout: 25000,
          })
          arrPendingBets.push({
            ...doc.data(),
            betId: doc.id,
            friendName: friend.userName ?? 'Anonymous',
            friendEmoji: friend.userEmoji ?? '😊',
            userCurrentEquity: portfolio_equity,
            friendCurrentEquity: friendPortfolio?.data?.equity,
          })
        }),
      )
      setAllPendingBets(arrPendingBets)
      setLoadingPendingBets(false)
    } catch (error) {
      console.log('error getCurrentUserBets=>', error)

      setLoadingPendingBets(false)
    }
  }
  useEffect(() => {
    getPastUserBets()
    getCurrentUserBets()
    getPendingUserBets()
  }, [])
  return {
    loadingPastBets,
    loadingCurrentBets,
    loadingPendingBets,
    pastBets,
    currentBet,
    allPendingBets,
  }
}

export { useGetBettings }
