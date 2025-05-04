const { userId, isLoggedIn } = useAuthSelector(state => state)

const handleAddToWatchList = async () => {
  if (isLoggedIn) {
    setAddWatchlistBool(true)
    const ref = database().ref('User')
    const watchlistArray = watchlistArrayFromFB

    watchlistArray.push(stockTicker)

    setWatchlistArrayFromFB(watchlistArray)
    ref.child(`/${userId}/Watchlist`).set(watchlistArray)
    await firestore().collection('User').doc(userId).update({
      Watchlist: watchlistArray,
    })
  } else {
    NavigationService.navigate('Account', { screen: 'SignInScreen' })
  }
}

const handleRemoveFromWatchList = async () => {
  if (isLoggedIn) {
    setAddWatchlistBool(true)
    const ref = database().ref('User')
    const watchlistArray = watchlistArrayFromFB.filter(stock => stock != stockTicker)
    setWatchlistArrayFromFB(watchlistArray)
    ref.child(`/${userId}/Watchlist`).set(watchlistArray)
    setAddWatchlistBool(false)
    await firestore().collection('User').doc(userId).update({
      Watchlist: watchlistArray,
    })
  } else {
    NavigationService.navigate('Account', { screen: 'SignInScreen' })
  }
}
