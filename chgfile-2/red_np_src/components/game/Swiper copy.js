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
  pushOrderToFirestore
} from '@utils'
import { Controller, useForm } from 'react-hook-form'
import {
  GameMiniChart,
  Icon,
  NumberInput,
  BackChevron,
  InvestErrorModal,
  OrderConfirmModal,
} from '@components'
import { getLastQuote, postOrder, getLastQuoteCrypto } from '@services'
import firestore from '@react-native-firebase/firestore'
import {
  getAccountPositions,
  useReduxDispatch,
  useUserSelector,
  authActions,
  useAuthSelector,
} from '@store'
import { exploreLogos } from '@constants/exploreLogos'

const Swiper = ({ stocks }) => {
  const { userSwipe } = useAuthSelector(state => state)
  const [showOrderconfirmationModal, setShowOrderconfirmationModal] = useState(false)
  const screenHeight = Dimensions.get('window').height
  const [currentIndex, setCurrentIndex] = useState(userSwipe || 0)
  const goToPreviousStock = () => {
    setCurrentIndex(prevIndex => {
      if (prevIndex === 0) return stocks.length - 1
      return prevIndex - 1
    })
  }
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
        {
          isLoggedIn && updateUserWithSwipe(userId, currentIndex + 1)
          dispatch(authActions.setUserSwipe({ userSwipe: currentIndex + 1 }))
        }
        swipe('right')
        isLoggedIn
          ? handleSubmit(onOrderSubmit, onError)()
          : setShowOrderconfirmationModal(true)
      } else if (gestureState.dx < -screenWidth * 0.25) {
        {
          isLoggedIn && updateUserWithSwipe(userId, currentIndex + 1)
          dispatch(authActions.setUserSwipe({ userSwipe: currentIndex + 1 }))
        }
        swipe('left')
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
  // console.log(matchedLogo)

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
    // setCurrentIndex(positions.userSwipe || 0);
    setRefreshing(true)
    // ;(async () => {
    if (stock.symbol) {
      // console.log(stock.symbol)
      try {
        const response =
          // ((selectedFinalStock?.class === 'crypto' || cryptos.includes(stock.symbol) === true)
          //   ? await getLastQuoteCrypto(stock.symbol.toString())
          //   :
          await getLastQuote(stock.symbol)
        // );
        if (response) {
          // if (selectedFinalStock?.class === 'crypto' || cryptos.includes(stock.symbol) === true) {
          //   setLastQuote(
          //     response?.quotes?.[(stock.symbol?.toString()).toString()].ap
          //   );
          // } else {
          setLastQuote(response?.trade?.p)
          // }
        } else {
          setLastQuote(0)
        }
      } catch (error) {
        console.log('error =>', error)
      }
    } else {
      setLastQuote(0)
    }
    setRefreshing(false)
  }

  useEffect(() => {
    handleRefresh()
  }, [stock.symbol])

  //BUY
  const { portfolio_value } = useUserSelector(state => state)
  const { isLoggedIn, userId, alpacaToken } = useAuthSelector(state => state)
  const [errorMessage, setErrorMessage] = useState('')
  const [qty, setQty] = useState(1)
  const onOrderSubmit = async () => {
    let requestBody = {
      symbol: stock.symbol,
      qty: userHasStock == true ? positionInfo.qty : qty,
      side:
        userHasStock == true ? (positionInfo.side === 'long' ? 'sell' : 'buy') : 'buy',
      type: 'market',
      time_in_force:
        getDecimal(positionInfo?.qty) > 0 || getDecimal(qty) > 0 ? 'day' : 'gtc',
    }

    if (portfolio_value < lastQuote * qty) {
      setErrorMessage('Your account balance is not sufficient yet for this.')
      return
    }
    try {
      const postResponse = await postOrder(JSON.stringify(requestBody))
      if (postResponse?.status === 200) {
        // console.log(postResponse)
        if (postResponse.data.status === 'accepted' && alpacaToken) {
          const orderData = postResponse.data
          // Push game data to Firestore
          pushOrderToFirestore(userId, orderData).catch(error => {
            console.error('Failed to push game data:', error.message)
          })
          await firestore().collection('PendingOrders').doc(postResponse.data.id).set({
            uid: userId,
            token: alpacaToken,
            orderId: postResponse.data.id,
            status: postResponse.data.status,
          })
        }
        // console.log('requestBodyType', requestBody)
        // NavigationService.navigate('OrderConfirmation', {
        //   order: requestBodyType,

        // })
        swipe('right')
      }
    } catch (error) {
      console.log('error', error)
      setErrorMessage(JSON.stringify(error))
    }
  }

  const onError = err => {}

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  // console.log(positions)

  return (
    <View>
      {/* Placeholder Card */}
      <View style={styles.topBar}>
        <BackChevron onPress={() => NavigationService.navigate('Game')} />
        <Icon
          type="FontAwesome"
          name={'undo'}
          size={actuatedNormalize(23)}
          color="white"
          style={{}}
          onPress={goToPreviousStock}
          // props={{ disabled: isLoading }}
        />
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
        <Animated.View {...panResponder.panHandlers} style={[styles.card, animatedStyle]}>
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

          <View style={{ paddingHorizontal: heightPercentageToDP(2) }}>
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
              />
            </TouchableOpacity>
          </View>
          <View>
            {userHasStock == true &&
              !isNaN(positionInfo?.unrealized_plpc) &&
              positionInfo?.unrealized_plpc !== undefined && (
                <>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
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
                        name={positionInfo?.unrealized_pl < 0 ? 'downcircle' : 'upcircle'}
                        size={actuatedNormalize(14)}
                        color={
                          positionInfo?.unrealized_pl < 0 ? colors.red : colors.primary4
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
                  {/* <View style={{flexDirection:"row", justifyContent:'space-between'}}>
              
              <Text style={[
            textStyles.smallRegular,
            {
              fontSize: actuatedNormalize(15),
              color: 'black',
            },
          ]}>QTY: {parseFloat(positionInfo?.qty)?.toFixed(2)}</Text>
           <Text style={[
            textStyles.smallRegular,
            {
              fontSize: actuatedNormalize(15), 
              color: 'black',
            },
          ]}>{(positionInfo?.side)}</Text>
          </View> */}
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

      <View style={styles.buttonsContainer}>
        <View>
          <TouchableOpacity
            onPress={() => swipe('left')}
            style={[
              styles.button,
              { marginHorizontal: heightPercentageToDP(userHasStock == true ? 5 : 3) },
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
              {userHasStock == true ? '✋' : '👎'}
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
            {userHasStock == true ? 'Hold' : 'Pass'}
          </Text>
        </View>
        {userHasStock == false && <NumberInput value={qty} onChange={setQty} />}
        <View>
          {/* onPress={handleSubmit(onOrderSubmit, onError)}> */}
          <TouchableOpacity
            onPress={() =>
              isLoggedIn
                ? handleSubmit(onOrderSubmit, onError)()
                : setShowOrderconfirmationModal(true)
            }
            style={[
              styles.button,
              { marginHorizontal: heightPercentageToDP(userHasStock == true ? 4 : 3) },
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
              👍
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
            {userHasStock == true ? 'Sell Position' : 'Buy'}
          </Text>
        </View>
      </View>
      {showOrderconfirmationModal && (
        <OrderConfirmModal
          visible={showOrderconfirmationModal}
          handleCloseModal={() => {
            setShowOrderconfirmationModal(false)
          }}
        />
      )}
      {errorMessage && (
        <InvestErrorModal
          errorMessage={
            errorMessage == 'endpoint not found'
              ? 'Please use the crypto screen for crypto trades 😊 🚀'
              : errorMessage.includes('no trade found for') == true
              ? `${stockTicker} is not tradable on the simulator. Please try a different stock.`
              : errorMessage
          }
          visible={!!errorMessage}
          handleCloseModal={() => {
            setErrorMessage('')
            {
              errorMessage == 'endpoint not found' &&
                NavigationService.navigate('Invest', { screen: 'EasyCryptoInvestScreen' })
            }
          }}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    width: widthPercentageToDP(70),
    height: heightPercentageToDP(40),
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    padding: heightPercentageToDP(2),
    marginTop: heightPercentageToDP(8),
    borderRadius: heightPercentageToDP(1),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    position: 'absolute',
    alignSelf: 'center',
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
    marginTop: heightPercentageToDP(50),
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
    marginRight: widthPercentageToDP(5),
    justifyContent: 'space-between',
  },
})

export { Swiper }
