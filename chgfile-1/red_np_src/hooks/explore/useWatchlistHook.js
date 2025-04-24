import React, { useState, useEffect } from 'react'
import { useAuthSelector } from '@store'
import firestore from '@react-native-firebase/firestore'
import database from '@react-native-firebase/database'

function useWatchlistHook(stockTicker) {
  const { userId, isLoggedIn } = useAuthSelector(state => state)
  const [addWatchlistBool, setAddWatchlistBool] = useState(false)
  const [watchlistArrayFromFB, setWatchlistArrayFromFB] = useState([])

  useEffect(() => {
     if (userId) {
       const watchlistRef = database().ref(`/User/${userId}/Watchlist`)
       const onValueChange = watchlistRef.on('value', snapshot => {
         const watchlist = snapshot.val()
         const watchlistArray = watchlist ? Object.values(watchlist) : []
         setWatchlistArrayFromFB(watchlistArray)
       })

       // Return a clean-up function
       return () => watchlistRef.off('value', onValueChange)
     }
  }, [userId, stockTicker])

  const updateWatchlist = React.useCallback(
    async watchlistArray => {
      await firestore().collection('User').doc(userId).update({
        Watchlist: watchlistArray,
      })
    },
    [userId],
  )

  const handleAddToWatchList = React.useCallback(async () => {
    if (!isLoggedIn) {
      NavigationService.navigate('Account', { screen: 'SignInScreen' })
      return
    }

    const newWatchlistArray = [...watchlistArrayFromFB, stockTicker]
    setWatchlistArrayFromFB(newWatchlistArray)
    setAddWatchlistBool(true)

    await updateWatchlist(newWatchlistArray)
  }, [isLoggedIn, stockTicker, watchlistArrayFromFB, updateWatchlist])

  const handleRemoveFromWatchList = React.useCallback(async () => {
    if (!isLoggedIn) {
      NavigationService.navigate('Account', { screen: 'SignInScreen' })
      return
    }

    const newWatchlistArray = watchlistArrayFromFB.filter(stock => stock !== stockTicker)
    setWatchlistArrayFromFB(newWatchlistArray)
    setAddWatchlistBool(false)

    await updateWatchlist(newWatchlistArray)
  }, [isLoggedIn, stockTicker, watchlistArrayFromFB, updateWatchlist])

  return { handleAddToWatchList, handleRemoveFromWatchList, addWatchlistBool }
}

export { useWatchlistHook }
