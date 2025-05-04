import React, { useState, useEffect, useRef } from 'react'
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Animated,
  Platform,
  FlatList,
  SafeAreaView,
  Modal,
  Easing,
} from 'react-native'
import { LineChart } from 'react-native-chart-kit'
import { NavigationService } from '@navigation'
import moment from 'moment'
import {
  colors,
  heightPercentageToDP,
  widthPercentageToDP,
  textStyles,
  actuatedNormalize,
  rfc3339,
  StorageKeys,
  localSaveItem,
  updateUserWithCoins,
  updateUserWithLevel,
  pushGameLeaderboardScore,
  pushGameToFirestore,
} from '@utils'
import { authActions, useReduxDispatch, useAuthSelector, useUserSelector } from '@store'
import { alpacaMarketApi } from '@services'
import { stockTickers, tutorialData } from '@constants'
import { CustomButton, HorizontalRule, CustomTutorial } from '@components'
import CoinIcon from '@assets/icons/CoinIcon'
import { TouchableOpacity } from 'react-native-gesture-handler'

const BuyorSell = ({ route }) => {
  const { secretCode } = route.params ?? {}

  const dispatch = useReduxDispatch()

  const { userId, redCoins, userLevel, isLoggedIn, userName } = useAuthSelector(
    state => state,
  )

  const [data, setData] = useState([])
  const [gameStarted, setGameStarted] = useState(false)
  const screenWidth = Dimensions.get('window').width
  const [transactions, setTransactions] = useState([])
  const [totalPosition, setTotalPosition] = useState(0)
  const [quantity, setQuantity] = useState(0)
  const orderSize = 1000 // $1000 worth of stock
  const [gameEnded, setGameEnded] = useState(false)
  const [chartHeight, setChartHeight] = useState(heightPercentageToDP(30)) // Add this to maintain chart height in state
  const [countdown, setCountdown] = useState(3)

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(
        () => {
          setCountdown(prev => prev - 1)
        },
        countdown === 3 ? 1500 : 1000,
      ) // First tick has a slight delay

      return () => clearTimeout(timer)
    } else if (countdown === 0 && !gameStarted) {
      startGame()
    }
  }, [countdown, gameStarted])

  const getRandomDateRange = () => {
    const twentyMinutesInMilliseconds = 20 * 60 * 1000
    const startLimit = new Date(new Date().setFullYear(new Date().getFullYear() - 5))
    const endLimit = new Date(Date.now() - twentyMinutesInMilliseconds)

    const startDate = new Date(
      startLimit.getTime() +
        Math.random() *
          (endLimit.getTime() - startLimit.getTime() - 60 * 24 * 60 * 60 * 1000),
    )
    const endDate = new Date(
      startDate.getTime() +
        60 * 24 * 60 * 60 * 1000 +
        Math.random() * ((240 - 60) * 24 * 60 * 60 * 1000),
    )
    return {
      start: startDate,
      end: endDate,
    }
  }

  const [stockTicker, setStockTicker] = useState(null)

  const getBarGame = async (stockTicker, start, end) => {
    const timeframe = '1Day'
    const limit = 120
    try {
      const response = await alpacaMarketApi.get(
        `v2/stocks/${stockTicker}/bars?start=${start}&end=${end}&timeframe=${timeframe}&limit=${limit}`,
      )

      if (response?.data) {
        return response?.data
      } else {
        // Handle case where response data might be missing but there's no error thrown
        throw new Error('Response data is missing.')
      }
    } catch (error) {
      // Handle the error. For example, you can log it or throw it to be handled by the calling function
      console.error('Error fetching bar game data:', error)
      throw error // if you want to propagate the error to the caller, otherwise remove this line
    }
  }
  const getRandomTicker = () => {
    const randomIndex = Math.floor(Math.random() * stockTickers.length)
    return stockTickers[randomIndex]
  }

  const startGame = async () => {
    let currentStockTicker = stockTicker

    if (!currentStockTicker) {
      currentStockTicker = getRandomTicker()
      setStockTicker(currentStockTicker) // Set the ticker only if it hasn't been set yet
    }

    const { start, end } = getRandomDateRange()

    const formattedStart = rfc3339(start)
    const formattedEnd = rfc3339(end)

    const response = await getBarGame(currentStockTicker, formattedStart, formattedEnd)
    if (response.bars) {
      const isValidData = !response.bars.some(bar => isNaN(bar.c))

      if (!isValidData) {
        return
      }
      const chartData = data.slice(0, currentPriceIndex).map(d => parseFloat(d))
      const isValidChartData = !chartData.some(d => isNaN(d) || !isFinite(d))
      if (!isValidChartData) {
        return null // or some placeholder/error component
      }

      const arr = response?.bars?.map(bar => `${bar?.c}`)
      const labelArr = response?.bars?.map(bar => moment(bar.t).format('DD MMM HH'))

      setData(arr)
      setbarDataLabels(labelArr)
      setGameStarted(true)
    } else {
      setbarDataSet([0, 0, 0, 0, 0])
      setbarDataLabels(['', '', '', '', ''])
    }
  }

  const [seconds, setSeconds] = useState(34) // 30 seconds, in milliseconds
  const [currentPriceIndex, setCurrentPriceIndex] = useState(0)
  const [PnL, setPnL] = useState(0)
  const [entryPrice, setEntryPrice] = useState(null)
  const [position, setPosition] = useState(null)

  useEffect(() => {
    let timer
    if (gameStarted) {
      // console.log('hello1')
      // animateRipple() // Start the ripple effect
      timer = setInterval(() => {
        if (seconds > 0) {
          setSeconds(prev => prev - 1)
          setCurrentPriceIndex(prev => prev + 1)
        } else {
          setGameEnded(true)
          clearInterval(timer)
        }
      }, 1000)
    } else {
    }

    return () => clearInterval(timer)
  }, [gameStarted, seconds])

  const handleTrade = type => {
    const currentPrice = parseFloat(data[currentPriceIndex])

    if (type === 'buy') {
      const boughtQuantity = orderSize / currentPrice
      setTransactions(prev => [
        ...prev,
        { type: 'buy', price: currentPrice, quantity: boughtQuantity, total: orderSize },
      ])
      setTotalPosition(prev => prev + orderSize)
      setQuantity(prev => prev + boughtQuantity)
    } else if (type === 'sell') {
      const soldValue = quantity * currentPrice
      const pnl = soldValue - totalPosition

      setTransactions(prev => [
        ...prev,
        { type: 'sell', price: currentPrice, quantity: quantity, total: soldValue },
      ])
      setTotalPosition(0)
      setPnL(prev => prev + pnl)
      setQuantity(0)
    }
  }

  const [barDataSet, setbarDataSet] = useState([])
  const [barDataLabels, setbarDataLabels] = useState([])
  const [closePrice, setClosePrice] = useState(null)
  const [closePriceYesterday, setClosePriceYesterday] = useState(null)

  const chartConfig = {
    touchSensitivity: 40,
    backgroundColor: colors.darkBackground,
    backgroundGradientFrom: colors.darkBackground,
    backgroundGradientTo: colors.darkBackground,
    fontSize: actuatedNormalize(12),
    decimalPlaces: 0,
    fillShadowGradientOpacity: 0.5,
    fillShadowGradientFromOffset: 1,
    color: (opacity = 1) =>
      PnL + calculateUnrealizedPnL() < 0
        ? colors.redError
        : PnL + calculateUnrealizedPnL() === 0
        ? 'white'
        : colors.primary2,
    fillShadowGradient: colors.darkBackground,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: 6,
      strokeWidth: 3,
      stroke: 'white',
      fill: colors.darkBackground,
      // opacity: dotOpacity,
    },
  }
  const chartWidthAnimation = useRef(new Animated.Value(screenWidth * 0.16)).current
  // const chartWidthAnimation = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(chartWidthAnimation, {
      toValue: widthPercentageToDP(Platform.isPad !== true ? 100 : 39),
      duration: 1700,
      useNativeDriver: false,
    }).start()
  }, [data])

  const calculateUnrealizedPnL = () => {
    if (!data[currentPriceIndex] || !data.length) return 0 // Ensure there's data
    const currentPrice = parseFloat(data[currentPriceIndex])
    const unrealizedValue = quantity * currentPrice
    return unrealizedValue - totalPosition
  }

  const resetGame = () => {
    setData([])
    setGameStarted(false)
    setGameEnded(false)
    setTransactions([])
    setTotalPosition(0)
    setQuantity(0)
    setSeconds(34)
    setCurrentPriceIndex(0)
    setPnL(0)
    setEntryPrice(null)
    setPosition(null)
    setbarDataSet([])
    setbarDataLabels([])
    setStockTicker(null)
    setCountdown(3)
    gameEndedProcessed.current = false
  }

  const processedData = data.slice(0, currentPriceIndex).map(d => {
    const value = parseFloat(d)
    return isFinite(value) ? value : 0 // Replace non-finite values with 0
  })

  const gameEndedProcessed = useRef(false) // Outside of the useEffect

  useEffect(() => {
    if (gameEnded && !gameEndedProcessed.current) {
      gameEndedProcessed.current = true

      const totalPnL = PnL + calculateUnrealizedPnL()
      const updatedRedCoins = redCoins + totalPnL

      if (isLoggedIn === true) {
        updateUserWithCoins(userId, updatedRedCoins)
        dispatch(authActions.setRedCoins({ redCoins: updatedRedCoins }))

        let updatedBuyOrSell
        if (!userLevel || userLevel['BuyorSell'] === undefined) {
          updatedBuyOrSell = totalPnL.toFixed(2)
        } else if (totalPnL > userLevel['BuyorSell']) {
          updatedBuyOrSell = totalPnL.toFixed(2)
        } else {
          updatedBuyOrSell = userLevel['BuyorSell']
        }

        // Push game data to Firestore if there's no secret code
        if (!secretCode) {
          const formattedStart = rfc3339(getRandomDateRange().start)
          const formattedEnd = rfc3339(getRandomDateRange().end)

          const gameData = {
            userName,
            score: totalPnL,
            gameType: 'BuyorSell',
            buys: transactions.filter(t => t.type === 'buy').length,
            sells: transactions.filter(t => t.type === 'sell').length,
            ticker: stockTicker,
            start: formattedStart,
            end: formattedEnd,
          }

          // Push game data to Firestore
          pushGameToFirestore(userId, gameData).catch(error => {
            console.error('Failed to push game data:', error.message)
          })
        }
        
        if (secretCode) {
          console.log('Pushing to leaderboard:', { userId, totalPnL, secretCode, userName })
          pushGameLeaderboardScore(userId, totalPnL, secretCode, userName)
        }


        updateUserWithLevel(userId, 'BuyorSell', updatedBuyOrSell)

        dispatch(
          authActions.setUserLevel({
            userLevel: {
              ...userLevel,
              ['BuyorSell']: updatedBuyOrSell,
            },
          }),
        )
      }
    }
  }, [
    countdown,
    gameStarted,
    gameEnded,
    PnL,
    redCoins,
    userId,
    dispatch,
    userLevel,
    isLoggedIn,
  ])

  const [highlightAnimation] = useState(new Animated.Value(0))
  const [hasPressedBuy, setHasPressedBuy] = useState(false)
  const [isAnimating, setIsAnimating] = useState(true)

  const animateHighlight = () => {
    if (!hasPressedBuy) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(highlightAnimation, {
            toValue: 1,
            duration: 500, // Adjust the duration as needed
            easing: Easing.linear,
            useNativeDriver: false,
          }),
          Animated.timing(highlightAnimation, {
            toValue: 0,
            duration: 500, // Adjust the duration as needed
            easing: Easing.linear,
            useNativeDriver: false,
          }),
        ]),
      ).start()
    }
  }

  useEffect(() => {
    animateHighlight() // Start animation when component mounts
  }, [])

  return (
    <SafeAreaView style={styles.mainView}>
      {(gameStarted || gameEnded) && seconds < 31 && (
        <>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: heightPercentageToDP(2),
              paddingHorizontal: widthPercentageToDP(3),
            }}>
            <View
              style={{
                backgroundColor: 'white',
                paddingHorizontal: widthPercentageToDP(4),
                borderRadius: actuatedNormalize(20),
                alignSelf: 'center',
                justifyContent: 'center',
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
                00:{seconds < 10 ? `0${seconds}` : seconds}
              </Text>
            </View>

            <View style={{ flexDirection: 'row' }}>
              <CoinIcon size={widthPercentageToDP(10)} />
              <Text
                style={[
                  textStyles.normalBold,
                  {
                    color: 'white',
                    marginTop: heightPercentageToDP(0.6),
                    fontSize: actuatedNormalize(17),
                  },
                ]}>
                {PnL > 0
                  ? `$${(PnL + calculateUnrealizedPnL()).toFixed(2)} +`
                  : `$${(PnL + calculateUnrealizedPnL()).toFixed(2)}`}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => {
              if (seconds > 0) {
                return
              }
              NavigationService.navigate('ExploreScreen', {
                stockTicker: stockTicker,
              })
            }}>
            <Animated.View style={{ width: chartWidthAnimation, overflow: 'hidden' }}>
              {processedData?.length > 1 && (
                <LineChart
                  bezier
                  withHorizontalLabels={false}
                  data={{
                    datasets: [
                      {
                        data: data
                          ?.slice(0, currentPriceIndex + 1)
                          ?.map(d => parseFloat(d))
                          .filter(val => Number.isFinite(val) && !Number.isNaN(val)),
                      },
                    ],
                  }}
                  hidePointsAtIndex={data
                    .map((item, idx) => idx)
                    .filter(idx => idx !== currentPriceIndex)}
                  withInnerLines={false}
                  withOuterLines={false}
                  width={screenWidth}
                  height={heightPercentageToDP(30)}
                  segments={2}
                  yAxisLabel=""
                  yAxisInterval={2}
                  chartConfig={chartConfig}
                  touchEnabled
                  onDataPointClick={({ value, x, y, index }) => {
                    setChartClick(value)
                    setChartClickTime(barDataLabels[index])
                    setChartClickCoords({ x, y })
                  }}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  style={{
                    marginTop: heightPercentageToDP(3),
                    marginLeft: heightPercentageToDP(-6),
                    width: widthPercentageToDP(103),
                    borderRadius: 20,
                    alignItems: 'flex-start',
                  }}
                />
              )}
            </Animated.View>
          </TouchableOpacity>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              marginHorizontal: widthPercentageToDP(7),
            }}>
            <TouchableOpacity
              onPress={() => {
                if (seconds > 0) {
                  return
                }
                NavigationService.navigate('ExploreScreen', {
                  stockTicker: stockTicker,
                })
              }}>
              <View
                style={{
                  backgroundColor: `rgba(255, 255, 255, 0.3)`,
                  marginTop: heightPercentageToDP(3),
                  width: widthPercentageToDP(20),
                  paddingVertical: heightPercentageToDP(1),
                  alignSelf: 'center',
                  alignItems: 'center',
                  borderRadius: actuatedNormalize(40),
                }}>
                <Text
                  style={[
                    textStyles.hugeHeavyBold,
                    {
                      fontSize: actuatedNormalize(12),
                      color: 'white',
                    },
                  ]}>
                  {stockTicker}
                </Text>
              </View>
            </TouchableOpacity>
            {processedData?.length > 1 && (
              <View
                style={{
                  backgroundColor: 'white',
                  padding: widthPercentageToDP(2),
                  marginTop: heightPercentageToDP(3),
                  paddingHorizontal: widthPercentageToDP(6),
                  borderRadius: widthPercentageToDP(1),
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: actuatedNormalize(40),
                  alignSelf: 'center',
                }}>
                <Text
                  style={[
                    textStyles.normalSemiBold,
                    {
                      color: 'black',
                      // marginBottom: heightPercentageToDP(1),
                    },
                  ]}>
                  ${parseFloat(data[currentPriceIndex]).toFixed(2)}
                </Text>
              </View>
            )}
          </View>
          <View>
            <FlatList
              data={transactions}
              style={{
                // backgroundColor: colors.darkBackground,
                marginVertical: heightPercentageToDP(2),
                height: heightPercentageToDP(17),
                alignSelf: 'center',
              }}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => {
                if (item.quantity > 0) {
                  return (
                    <Text
                      style={[
                        textStyles.bigRegular,
                        { fontSize: actuatedNormalize(14), color: 'white' },
                      ]}>
                      {item.type === 'buy' ? 'Bought' : 'Sold'} {item.quantity.toFixed(2)}{' '}
                      at ${item.price.toFixed(2)} Total ${item.total.toFixed(0)}
                    </Text>
                  )
                } else {
                  return null // Don't render anything for items with quantity <= 0
                }
              }}
            />
          </View>
          <View
            style={{
              position: 'absolute',
              width: '100%',
              marginTop: heightPercentageToDP(65),
            }}>
            <HorizontalRule style={{ width: '100%' }} />

            {seconds <= 0 ? (
              <CustomButton
                style={{ alignSelf: 'center' }}
                text={secretCode ? 'See Leaderboard' : 'Play Again'}
                onPress={
                  isLoggedIn
                    ? secretCode
                      ? NavigationService.navigate('GameLeaderboard', {
                          secretCode: secretCode.toUpperCase(),
                        })
                      : resetGame
                    : () => NavigationService.navigate('SignInScreen')
                }
              />
            ) : (
              <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                {/* <CustomButton
                  text="Buy"
                  // {position ? 'Close' : 'Buy'}
                  onPress={gameStarted === true ? () => handleTrade('buy') : null}
                  small
                /> */}
                {isAnimating && (
                  <Animated.View
                    style={{
                      shadowOpacity: highlightAnimation.interpolate({
                        inputRange: !hasPressedBuy ? [0, 0.6] : [0, 0], // Corrected inputRange
                        outputRange: !hasPressedBuy ? [0, 0.5] : [0, 0], // Corrected outputRange
                      }),
                      borderColor: 'white',
                      shadowColor: 'white',
                      shadowRadius: heightPercentageToDP(2),
                      borderRadius: heightPercentageToDP(30),
                    }}>
                    <CustomButton
                      text="Buy"
                      onPress={() => {
                        if (!hasPressedBuy) {
                          setHasPressedBuy(true)
                          animateHighlight()
                          // Your existing logic for handling the Buy button press
                        }
                        handleTrade('buy')
                      }}
                      small
                    />
                  </Animated.View>
                )}
                <CustomButton
                  text="Close"
                  onPress={
                    gameStarted === true && (quantity > 0 || totalPosition > 0)
                      ? () => handleTrade('sell')
                      : null
                  }
                  small
                  // Apply conditional styles here
                  style={{
                    backgroundColor:
                      gameStarted === true && (quantity > 0 || totalPosition > 0)
                        ? 'blue'
                        : 'gray',
                  }}
                  // Disable the button if conditions are not met
                  disabled={
                    !(gameStarted === true && (quantity > 0 || totalPosition > 0))
                  }
                />
              </View>
            )}
          </View>
        </>
      )}
      {seconds >= 31 && seconds <= 34 && gameStarted && (
        <View
          style={{
            alignContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            marginTop: heightPercentageToDP(30),
          }}>
          <Text
            style={[
              textStyles.hugeHeavyBold,
              {
                fontSize: actuatedNormalize(40),
                fontWeight: 'bold',
                color: 'white',
              },
            ]}>
            {countdown === 0 ? 'Go!' : countdown}
          </Text>
        </View>
      )}
      {!gameStarted && seconds === 34 && (
        <CustomTutorial data={tutorialData} onPress={startGame} />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  positionCard: {
    flexDirection: 'column',
    alignItems: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    paddingVertical: heightPercentageToDP(1),
    width: widthPercentageToDP(35),
    borderRadius: heightPercentageToDP(1),
    borderWidth: widthPercentageToDP(0.7),
    borderColor: colors.primary,
    marginHorizontal: widthPercentageToDP(1.5),
  },
  symbol: {
    color: 'white',
    fontSize: actuatedNormalize(16),
    paddingHorizontal: widthPercentageToDP(3),
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  mainView: { flex: 1, backgroundColor: colors.darkBackground },
  bottomContainer: {
    backgroundColor: '#161616',
    // marginBottom: heightPercentageToDP(10),
  },
  bottomContainerRows: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})

export { BuyorSell }
