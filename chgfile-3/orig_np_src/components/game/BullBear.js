import React, { useState, useRef, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Animated,
  RefreshControl,
  PanResponder,
  Dimensions,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  Modal,
} from 'react-native'
import { NavigationService } from '@navigation'
import {
  actuatedNormalize,
  colors,
  heightPercentageToDP,
  textStyles,
  widthPercentageToDP,
  capitalize,
  getDecimal,
  updateUserWithSwipe,
  updateUserWithCoins,
  pushGameLeaderboardScore
} from '@utils'
import { Controller, useForm } from 'react-hook-form'
import {
  GameMiniChart,
  Icon,
  NumberInput,
  BackChevron,
  InvestErrorModal,
  OrderConfirmModal,
  CustomNewsHeadline,
  CustomTutorial,
  CustomButton,
} from '@components'
import { getLastQuote, postOrder, getLastQuoteCrypto, getBarsMini } from '@services'
import firestore from '@react-native-firebase/firestore'
import {
  getAccountPositions,
  useReduxDispatch,
  useUserSelector,
  authActions,
  useAuthSelector,
} from '@store'
import { exploreLogos } from '@constants/exploreLogos'
import CoinIcon from '@assets/icons/CoinIcon'
import { bullorBearTutorialData } from '@constants/tutorialData'
// import LottieView from 'lottie-react-native'
// import LottieView from 'lottie-ios'
// import checkmark from '@constants'

const BullBear = ({ stocks, secretCode }) => {

  const [seconds, setSeconds] = useState(35)
  const [gameEnded, setGameEnded] = useState(false)
  const [countdown, setCountdown] = useState(4)
  const [isGameOver, setIsGameOver] = useState(false)
  const newsBullBear = true
  const [cardBackgroundColor, setCardBackgroundColor] = useState('white')
  const [score, setScore] = useState(0)
  const [closePrice, setClosePrice] = useState(0)
  const { userSwipe, redCoins, userLevel, userName } = useAuthSelector(state => state)
  const [showOrderconfirmationModal, setShowOrderconfirmationModal] = useState(false)
  const screenHeight = Dimensions.get('window').height
  const [currentIndex, setCurrentIndex] = useState(userSwipe || 0)
  const goToPreviousStock = () => {
    setCurrentIndex(prevIndex => {
      if (prevIndex === 0) return stocks.length - 1
      return prevIndex - 1
    })
  }
  const [gameStarted, setGameStarted] = useState(false)

  const [barDataSet, setbarDataSet] = useState([0, 0, 0])
  const getBarsMHandle = React.useCallback(async () => {
    const response = await getBarsMini(stock.symbol)
    if (response?.bars) {
      const res = response?.bars[response?.bars?.length - 1]
      // handleDataAndLabel(response?.bars, '1M')
      // console.log(res, rezzz)
      setClosePrice(res.c)
    } else {
      // setbarDataSet([0, 0, 0, 0, 0])
      // setbarDataLabels(['', '', '', '', ''])
      // null
      console.log('err')
    }
  }, [])

  // const lastValue = parseFloat(barDataSet[barDataSet?.length - 1])
  // const firstValue = parseFloat(barDataSet[0])

  const [userAnswer, setUserAnswer] = useState('')
  // const bullBearAnswer = firstValue < lastValue ? 'bull' : 'bear'

  const position = useRef(new Animated.ValueXY()).current
  const dispatch = useReduxDispatch()
  const { positions } = useUserSelector(state => state)
  const [refreshing, setRefreshing] = useState(false)

  const swipe = direction => {
    const screenWidth = Dimensions.get('window').width
    Animated.timing(position, {
      toValue: {
        x: direction === 'right' ? screenWidth * 1.5 : -screenWidth * 1.5,
        y: 0,
      },
      duration: 400,
      useNativeDriver: false,
    }).start(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % stocks.length)
      position.setValue({ x: 0, y: 0 })
      {
        isLoggedIn && updateUserWithSwipe(userId, currentIndex)
        dispatch(authActions.setUserSwipe({ userSwipe: currentIndex + 1 }))
      }
    })
  }

  const swipeUp = () => {
    const screenHeight = Dimensions.get('window').height
    Animated.timing(position, {
      toValue: { x: 0, y: -screenHeight },
      duration: 400,
      useNativeDriver: false,
    }).start(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % stocks.length)
      position.setValue({ x: 0, y: 0 })
      {
        isLoggedIn && updateUserWithSwipe(userId, currentIndex)
        dispatch(authActions.setUserSwipe({ userSwipe: currentIndex + 1 }))
      }
      NavigationService.navigate('Invest', {
        screen: 'InvestTab',
        params: {
          stockTicker: stocks[currentIndex].symbol,
        },
      })
    })
  }

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gestureState) => {
      position.setValue({ x: gestureState.dx, y: gestureState.dy })
    },
    onPanResponderRelease: (evt, gestureState) => {
      const screenWidth = Dimensions.get('window').width
      const screenHeight = Dimensions.get('window').height

      if (gestureState.dy < -screenHeight * 0.25) {
        // Detects upward swipe
        swipeUp()
      } else if (gestureState.dx > screenWidth * 0.25) {
        if (isLoggedIn) {
          updateUserWithSwipe(userId, currentIndex + 1)
          dispatch(authActions.setUserSwipe({ userSwipe: currentIndex + 1 }))
        }
        swipe('right')
        if (isLoggedIn) {
          setUserAnswer('bull')
          if (answerResult === true) {
            setScore(prevScore => prevScore + 10)
            const updatedRedCoins = redCoins + 10
            updateUserWithCoins(userId, updatedRedCoins)
            dispatch(authActions.setRedCoins({ redCoins: updatedRedCoins }))
          }
        } else {
          setShowOrderconfirmationModal(true)
        }
      } else if (gestureState.dx < -screenWidth * 0.25) {
        if (isLoggedIn) {
          updateUserWithSwipe(userId, currentIndex + 1)
          dispatch(authActions.setUserSwipe({ userSwipe: currentIndex + 1 }))
        }
        swipe('left')
        if (isLoggedIn) {
          setUserAnswer('bear')
          if (answerResult === true) {
            setScore(prevScore => prevScore + 10)
            const updatedRedCoins = redCoins + 10
            updateUserWithCoins(userId, updatedRedCoins)
            dispatch(authActions.setRedCoins({ redCoins: updatedRedCoins }))
          }
        } else {
          setShowOrderconfirmationModal(true)
        }
      } else {
        Animated.spring(position, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start()
      }
    },
  })

  const stock = stocks[currentIndex]
  const [userHasStock, setUserHasStock] = useState(false)
  const [positionInfo, setPositionInfo] = useState('')

  const matchedLogo = exploreLogos.find(logo => logo.ticker === stock?.symbol)

  useEffect(() => {
    setUserHasStock(positions.some(position => position.symbol === stock.symbol))

    if (userHasStock) {
      setPositionInfo(positions.find(position => position?.symbol === stock?.symbol)) // Replace "AAPL" with the desired stock symbol
    } else {
      // console.log('User does not have stock.');
      null
    }
  }, [positions, stock.symbol])

  const rotate = position.x.interpolate({
    inputRange: [-Dimensions.get('window').width, 0, Dimensions.get('window').width],
    outputRange: ['-30deg', '0deg', '30deg'],
  })

  const animatedStyle = {
    transform: [...position.getTranslateTransform(), { rotate }],
  }

  const [lastQuote, setLastQuote] = useState(0)

  const handleRefresh = async () => {
    dispatch(getAccountPositions())
    getBarsMHandle()
    setRefreshing(true)

    if (stock.symbol) {
      try {
        const barsResponse = await getBarsMini(stock.symbol)
        if (barsResponse?.bars) {
          const latestBar = barsResponse.bars[barsResponse.bars.length - 1]
          // handleDataAndLabel(barsResponse.bars, '1M')
          setClosePrice(latestBar.c)
        } else {
          // setbarDataSet([0, 0, 0, 0, 0])
          // setbarDataLabels(['', '', '', '', ''])
          setClosePrice(0) // Set closePrice to 0 in case there's no data
        }

        const lastQuoteResponse = await getLastQuote(stock.symbol)
        if (lastQuoteResponse) {
          setLastQuote(lastQuoteResponse.trade.p)
        } else {
          setLastQuote(0)
        }
      } catch (error) {
        console.error('Error:', error)
        setLastQuote(0)
        setClosePrice(0)
      }
    } else {
      setLastQuote(0)
      setClosePrice(0)
    }

    setRefreshing(false)
  }

  useEffect(() => {
    handleRefresh()
  }, [stock.symbol])

  const bullBearAnswer = lastQuote >= closePrice ? 'bull' : 'bear'
  const answerResult = bullBearAnswer === userAnswer || lastQuote === 0 ? true : false

  //BUY

  const { isLoggedIn, userId, alpacaToken } = useAuthSelector(state => state)

  const startGame = () => {
    setGameStarted(true)
  }

  useEffect(() => {
    let timer
    if (gameStarted) {
      // console.log('hello1')
      // animateRipple() // Start the ripple effect
      timer = setInterval(() => {
        if (seconds > 0) {
          setSeconds(prev => prev - 1)
        } else {
          setGameEnded(true)
          pushGameLeaderboardScore(userId, score, secretCode, userName)
          clearInterval(timer)
        }
      }, 1000)
    } else {
      // console.log('hello')
      // Reset animation values
      // Animated.timing(dotRadius, { toValue: 6, duration: 0 }).start()
      // Animated.timing(dotOpacity, { toValue: 1, duration: 0 }).start()
    }

    return () => clearInterval(timer)
  }, [gameStarted, seconds])

  const resetGame = () => {
    setGameStarted(false)
    setGameEnded(false)
    setSeconds(35)
    setCountdown(4)
  }

  const gameEndedProcessed = useRef(false) // Outside of the useEffect

  useEffect(() => {
    if (seconds >= 31 && seconds <= 35 && gameStarted) {
      // Start the countdown when the condition is met.
      const interval = setInterval(() => {
        if (countdown === 0) {
          clearInterval(interval)
        } else {
          setCountdown(countdown - 1)
        }
      }, 1000)

      return () => clearInterval(interval)
    }

    if (gameEnded && !gameEndedProcessed.current) {
      gameEndedProcessed.current = true // Mark as processed
    }
  }, [countdown, gameStarted, gameEnded, redCoins, userId, dispatch, userLevel])

  const formatTime = seconds => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes < 10 ? '0' : ''}${minutes}:${
      remainingSeconds < 10 ? '0' : ''
    }${remainingSeconds}`
  }

  // console.log(closePrice, lastQuote,lastQuote >= closePrice )

  useEffect(() => {
    if (userAnswer !== '') {
      // Change the card color based on the answer result for 2 seconds
      const newColor = answerResult === true ? colors.primary2 : colors.redError
      setCardBackgroundColor(newColor)

      // Set a timeout to revert the card color back to white after 2 seconds
      const timer = setTimeout(() => {
        setCardBackgroundColor('white')
      }, 700)

      // Cleanup the timer when the component unmounts or before executing the useEffect again
      return () => clearTimeout(timer)
    }
  }, [userAnswer]) 
  // const scaleAnim = useRef(new Animated.Value(1)).current // Initial scale is 1

  // // Animation function to scale the icon up and down
  // const animateCoinIcon = () => {
  //   // Reset to default before starting animation to ensure it runs even if the state hasn't changed
  //   scaleAnim.setValue(1)

  //   // Sequence to grow and then shrink the icon
  //   Animated.sequence([
  //     // Scale up
  //     Animated.timing(scaleAnim, {
  //       toValue: 1.5, // Adjust the target value to control how much the icon grows
  //       duration: 500, // Half of the total duration for growing
  //       useNativeDriver: true, // Use native driver for better performance
  //     }),
  //     // Scale down
  //     Animated.timing(scaleAnim, {
  //       toValue: 1, // Return to original size
  //       duration: 500, // Half of the total duration for shrinking
  //       useNativeDriver: true,
  //     }),
  //   ]).start()
  // }

  // // Trigger the animation when the answer is correct
  // useEffect(() => {
  //   if (userAnswer !== '' && answerResult === true) {
  //     animateCoinIcon()
  //   }
  // }, [userAnswer, answerResult])
  // console.log(answerResult)

  return (
    <SafeAreaView style={styles.mainView}>
      {(gameStarted || gameEnded) && seconds < 35 && (
        <View>
          {/* Placeholder Card */}
          <View style={[styles.topBar, {}]}>
            <View
              style={{
                backgroundColor: 'white',
                alignContent: 'center',
                alignSelf: 'center',
                alignItems: 'center',
                paddingHorizontal: widthPercentageToDP(4),
                borderRadius: actuatedNormalize(20),
                paddingVertical: widthPercentageToDP(1),
              }}>
              <Text
                style={[
                  textStyles.normalBold,
                  {
                    color: 'black',
                    marginTop: heightPercentageToDP(0.6),
                    fontSize: actuatedNormalize(17),
                  },
                ]}>
                {formatTime(seconds)}
              </Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <CoinIcon size={widthPercentageToDP(10)} />
              {/* <Animated.View
                style={{
                  transform: [{ scale: scaleAnim }], // Apply the animated scale
                }}>
                <CoinIcon size={widthPercentageToDP(10)} />
              </Animated.View> */}
              <Text
                style={[
                  textStyles.normalBold,
                  {
                    color: 'white',
                    marginTop: heightPercentageToDP(0.6),
                    fontSize: actuatedNormalize(17),
                  },
                ]}>
                ${score}
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.card,
              styles.placeholderCard,
              {
                width: widthPercentageToDP(60),
              },
            ]}
          />
          {/* Placeholder Card */}
          <View
            style={[
              styles.card,
              styles.placeholderCardTwo,
              {
                width: widthPercentageToDP(65),
              },
            ]}
          />

          {/* Card Behind the Current */}
          {stocks[(currentIndex + 1) % stocks.length] && (
            <Animated.View style={[styles.card, styles.behindCard]} />
          )}

          {/* Current Card */}
          {stock && (
            <Animated.View
              {...panResponder.panHandlers}
              style={[
                styles.card,
                animatedStyle,
                { backgroundColor: cardBackgroundColor },
              ]}>
              <View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text
                    style={[
                      textStyles.smallBold,
                      {
                        fontSize: actuatedNormalize(20),
                        color: 'black',
                      },
                    ]}>
                    {stock.symbol}{' '}
                    {exploreLogos.find(logo => logo.ticker === stock.symbol) !==
                      undefined && (
                      <Icon
                        type={matchedLogo.type}
                        name={matchedLogo.logo}
                        size={widthPercentageToDP(Platform.isPad !== true ? 5.5 : 4.5)}
                        style={{ marginBottom: heightPercentageToDP(0.5) }}
                        color="black"
                        onPress={() =>
                          NavigationService.navigate('Invest', {
                            screen: 'InvestTab',
                            params: {
                              stockTicker: stock.symbol,
                            },
                          })
                        }
                      />
                    )}{' '}
                  </Text>
                  <Text
                    style={[
                      textStyles.smallRegular,
                      {
                        fontSize: actuatedNormalize(17),
                        color: 'black',
                        marginBottom: heightPercentageToDP(1.5),
                      },
                    ]}>
                    ${lastQuote.toFixed(2)}
                  </Text>
                </View>
                <Text
                  style={[
                    textStyles.smallRegular,
                    {
                      fontSize: actuatedNormalize(15),
                      color: 'black',
                    },
                  ]}>
                  {stock.info.longName}
                </Text>
              </View>

              <View style={{ paddingHorizontal: heightPercentageToDP(0) }}>
                {newsBullBear === true ? (
                  <CustomNewsHeadline stockTicker={stock.symbol} />
                ) : (
                  <TouchableOpacity
                    onPress={() =>
                      NavigationService.navigate('ExploreScreen', {
                        stockTicker: stock.symbol,
                      })
                    }>
                    <GameMiniChart
                      key={stock.symbol}
                      stockTicker={stock.symbol}
                      selectedFinalStock={stock.symbol}
                      bullbear={true}
                      onBullBearChange={handleBullBearChange}
                    />
                  </TouchableOpacity>
                )}
              </View>
              <View>
                {userHasStock == true &&
                  !isNaN(positionInfo?.unrealized_plpc) &&
                  positionInfo?.unrealized_plpc !== undefined && (
                    <>
                      <View
                        style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text
                          style={[
                            textStyles.smallBold,
                            {
                              fontSize: actuatedNormalize(15),
                              color:
                                parseFloat(positionInfo?.unrealized_pl) < 0
                                  ? colors.redError
                                  : colors.primary2,
                            },
                          ]}>
                          <Icon
                            type="AntDesign"
                            name={
                              positionInfo?.unrealized_pl < 0 ? 'downcircle' : 'upcircle'
                            }
                            size={actuatedNormalize(14)}
                            color={
                              positionInfo?.unrealized_pl < 0
                                ? colors.red
                                : colors.primary4
                            }
                          />{' '}
                          ${parseFloat(positionInfo?.unrealized_pl)?.toFixed(2)}{' '}
                        </Text>
                        <Text
                          style={[
                            textStyles.smallBold,
                            {
                              fontSize: actuatedNormalize(15),
                              color:
                                parseFloat(positionInfo?.unrealized_plpc) < 0
                                  ? colors.redError
                                  : colors.primary2,
                            },
                          ]}>
                          {parseFloat(positionInfo?.unrealized_plpc)?.toFixed(2)}%
                        </Text>
                      </View>
                    </>
                  )}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text
                    style={[
                      textStyles.smallRegular,
                      {
                        fontSize: actuatedNormalize(13),
                        color: 'black',
                      },
                    ]}>
                    Analysts Say{' '}
                    {stock.info.recommendationKey == 'sell'
                      ? '👎'
                      : stock.info.recommendationKey == 'hold'
                      ? '✋'
                      : '👍'}
                  </Text>
                  {userHasStock == true && (
                    <Text
                      style={[
                        textStyles.smallRegular,
                        {
                          fontSize: actuatedNormalize(13),
                          color: 'black',
                        },
                      ]}>
                      <Icon
                        type="AntDesign"
                        name={'checkcircle'}
                        size={actuatedNormalize(13)}
                        color="black"
                        style={{}}
                        onPress={goToPreviousStock}
                      />{' '}
                      You Own
                    </Text>
                  )}
                </View>
              </View>
            </Animated.View>
          )}

          {seconds <= 0 ? (
            <Modal
              animationType="fade" // You can adjust the animation as needed
              transparent={true}
              visible={seconds <= 0}
              onRequestClose={() => {}}>
              <View
                style={{
                  flex: 1,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  // justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    marginTop: heightPercentageToDP(60),
                  }}>
                  <CustomButton
                    style={{ alignSelf: 'center' }}
                    text= { secretCode ? "View Leaderboard" : "Play Again" }
                    onPress={resetGame}
                  />
                </View>
              </View>
            </Modal>
          ) : (
            <View style={styles.buttonsContainer}>
              <View style={{ marginHorizontal: widthPercentageToDP(5) }}>
                <TouchableOpacity
                  // onPress={() => swipe('left')}
                  onPress={() => {
                    if (isLoggedIn) {
                      swipe('left')
                      setUserAnswer('bear')
                      if (answerResult === true) {
                        setScore(prevScore => prevScore + 10)
                        const updatedRedCoins = redCoins + 10
                        updateUserWithCoins(userId, updatedRedCoins)
                        dispatch(authActions.setRedCoins({ redCoins: updatedRedCoins }))
                      }
                    } else {
                      setShowOrderconfirmationModal(true)
                    }
                  }}
                  style={[
                    styles.button,
                    {
                      marginHorizontal: heightPercentageToDP(
                        userHasStock == true ? 5 : 3,
                      ),
                    },
                  ]}>
                  <Text
                    style={[
                      textStyles.smallBold,
                      {
                        fontSize: actuatedNormalize(20),
                        textAlign: 'center',
                        color: 'white',
                      },
                    ]}>
                    🐻
                  </Text>
                </TouchableOpacity>

                <Text
                  style={[
                    textStyles.smallRegular,
                    {
                      fontSize: actuatedNormalize(15),
                      textAlign: 'center',
                      color: 'white',
                    },
                  ]}>
                  Bear
                </Text>
              </View>
              {/* {userHasStock == false && <NumberInput value={qty} onChange={setQty} />} */}
              <View style={{ marginHorizontal: widthPercentageToDP(5) }}>
                {/* onPress={handleSubmit(onOrderSubmit, onError)}> */}
                <TouchableOpacity
                  onPress={() => {
                    if (isLoggedIn) {
                      swipe('right')
                      setUserAnswer('bull')

                      if (answerResult === true) {
                        setScore(prevScore => prevScore + 10)
                        const updatedRedCoins = redCoins + 10
                        updateUserWithCoins(userId, updatedRedCoins)
                        dispatch(authActions.setRedCoins({ redCoins: updatedRedCoins }))
                      }
                    } else {
                      setShowOrderconfirmationModal(true)
                    }
                  }}
                  style={[
                    styles.button,
                    {
                      marginHorizontal: heightPercentageToDP(
                        userHasStock == true ? 4 : 3,
                      ),
                    },
                  ]}>
                  <Text
                    style={[
                      textStyles.smallBold,
                      {
                        fontSize: actuatedNormalize(20),
                        textAlign: 'center',
                        color: 'white',
                      },
                    ]}>
                    🐂
                  </Text>
                </TouchableOpacity>
                <Text
                  style={[
                    textStyles.smallRegular,
                    {
                      fontSize: actuatedNormalize(15),
                      textAlign: 'center',
                      color: 'white',
                    },
                  ]}>
                  Bull
                </Text>
              </View>
            </View>
          )}
        </View>
      )}
      {/* {showOrderconfirmationModal && (
        <OrderConfirmModal
          visible={showOrderconfirmationModal}
          handleCloseModal={() => {
            setShowOrderconfirmationModal(false)
          }}
        />
      )} */}
      {seconds >= 31 && seconds < 35 && gameStarted && (
        <View
          style={{
            alignContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            // justifyContent:'center',
            width: widthPercentageToDP(100),
            height: heightPercentageToDP(100),
            position: 'absolute',
          }}>
          <Text
            style={[
              textStyles.hugeHeavyBold,
              {
                marginTop: heightPercentageToDP(30),
                fontSize: actuatedNormalize(40),
                fontWeight: 'bold',
                color: 'white',
              },
            ]}>
            {countdown === 0 ? 'Go!' : countdown}
          </Text>
        </View>
      )}
      {!isGameOver && seconds === 35 && (
        <View style={{ marginTop: heightPercentageToDP(0) }}>
          <CustomTutorial data={bullorBearTutorialData} onPress={startGame} />
        </View>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  card: {
    width: widthPercentageToDP(70),
    height: heightPercentageToDP(40),

    justifyContent: 'space-between',
    padding: heightPercentageToDP(2),
    marginTop: heightPercentageToDP(13),
    borderRadius: heightPercentageToDP(1),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 10,
  },
  placeholderCardTwo: {
    backgroundColor: '#f0f0f0', // Lighter color
    top: 15, // Adjust this value to change the vertical offset
  },
  placeholderCard: {
    backgroundColor: '#494949', // Lighter color
    top: 30, // Adjust this value to change the vertical offset
  },
  behindCard: {
    backgroundColor: '#e0e0e0', // Color for the card behind the current one
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: heightPercentageToDP(55),
  },
  button: {
    height: heightPercentageToDP(9),
    width: heightPercentageToDP(9),
    marginTop: heightPercentageToDP(4),
    marginBottom: heightPercentageToDP(2),
    alignItems: 'center',
    backgroundColor: 'white',
    alignContent: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: heightPercentageToDP(10),
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: heightPercentageToDP(2),
    width: widthPercentageToDP(90),
    marginHorizontal:widthPercentageToDP(5),
    position: 'absolute',
  },
  mainView: { flex: 1, backgroundColor: colors.darkBackground },
})

export { BullBear }
