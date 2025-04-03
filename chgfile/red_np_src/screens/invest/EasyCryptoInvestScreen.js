import React, {  useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Platform,
  SafeAreaView,
  ActivityIndicator,
  Keyboard,
  Modal,
  ScrollView,
  Image,
} from 'react-native'
import { capitalize } from 'lodash'
import AnimatedLinearGradient from 'react-native-animated-linear-gradient'
import { NavigationService } from '@navigation'
import database from '@react-native-firebase/database'
import firestore from '@react-native-firebase/firestore'
import Tooltip from 'react-native-walkthrough-tooltip'
import RNPickerSelect from 'react-native-picker-select'
import {
  actuatedNormalize,
  colors,
  heightPercentageToDP,
  textStyles,
  widthPercentageToDP,
  getDecimal,
  localSaveItem,
  StorageKeys,
  pushOrderToFirestore
} from '@utils'
import {
  CustomButton,
  CustomInputLabel,
  HorizontalRule,
  Icon,
  InvestErrorModal,
  OrderConfirmModal,
  BackChevron,
  AccountBalanceBar 
} from '@components'
import { Controller, useForm } from 'react-hook-form'
import { DotIndicator } from 'react-native-indicators'
import {
  getAccountPositions,
  useAuthSelector,
  useReduxDispatch,
  useUserSelector,
  userActions,
} from '@store'
import { getLastQuoteCrypto, postOrder } from '@services'
import useIAPHook from './useIAPHook'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { cryptoTypeS,  orderClass } from '@constants/cryptoTypes'
const loadingIm = require('@assets/images/HomeScreen/loadi.gif')

const EasyCryptoInvestScreen = ({ route }) => {
  const {
    subscriptionLoading,
    products,
    handlePurchase,
    isSubscribed,
    isLoadingPay,
    isLoadingSub,
    subscriptionModal,
    setSubscriptionModal,
  } = useIAPHook()
  // const [isSubscribed, setIsSubscribed] = useState(true)

  const dispatch = useReduxDispatch()
  const { portfolio_value, toolTip6 } = useUserSelector(state => state)
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()
  const { isLoggedIn, userId, alpacaToken } = useAuthSelector(state => state)
  const { positions } = useUserSelector(state => state)
  const [refreshing, setRefreshing] = React.useState(false)
  const [selectedCryptoType, setSelectedCryptoType] = useState('')
  const [selectedCryptoTypeS, setSelectedCryptoTypeS] = useState('')
  const [orderQuantity, setOrderQuantity] = useState(0)
  const [stopLoss, setStopLoss] = useState('')
  const [limitPrice, setLimitPrice] = useState('')
  const [lastQuote, setLastQuote] = useState(0)
  const [showOrderconfirmationModal, setShowOrderconfirmationModal] = useState(false)
  const [showInvestconfirmation, setShowInvestconfirmation] = useState(false)
  const [selectedOrderType, setSelectedOrderType] = useState('market')
  const [selectedOrderClass, setSelectedOrderClass] = useState('/USD')
  const [errorMessage, setErrorMessage] = useState('')
  const [orderQty, setOrderQty] = useState(false)

  const [toolTipVisible1, setToolTipVisible1] = useState(true)

  const doBoth = async () => {
    setOrderQty(prev => !prev)
    setToolTipVisible1(false)
    dispatch(userActions.setToolTip6({ toolTip6: true }))
    await localSaveItem(StorageKeys.toolTipShown6, JSON.stringify(true))
  }

  const { buying_power, cash } = useUserSelector(state => state)
  const [orderSide, setOrderSide] = useState('buy')

  const handleInvest = async () => {
    if (orderQuantity <= 0 || isNaN(orderQuantity)) {
      setErrorMessage('Order amount must be greater than 0')
      return
    }
    if (selectedOrderClass === 'crypto') {
      if (!selectedCryptoType) {
        setErrorMessage('Please select crypto currency')
        return
      }
    }
    if (orderQuantity < 1) {
      setErrorMessage('All orders need to be higher than $1.')
      return
    }
    if (selectedOrderType === 'limit') {
      if (limitPrice <= 0 || isNaN(limitPrice)) {
        setErrorMessage('Limit price must be greater than 1')
        return
      }
    }
    if (selectedOrderType === 'trailing_stop' || isNaN(orderQuantity)) {
      if (stopLoss <= 0 || isNaN(stopLoss)) {
        setErrorMessage('stop loss quantity must be greater than 1')
        return
      }
    }
    setShowInvestconfirmation(prev => !prev)
  }
  const [positionBool, setPositionBool] = useState(false)
  const [currencyCombo, setCurrencyCombo] = useState('')
  const onOrderSubmit = async () => {
    let requestBody = {
      symbol: selectedCryptoTypeS?.toString() + selectedOrderClass?.toString(),
      notional: orderQuantity,
      side: orderSide,
      type: selectedOrderType,
      time_in_force: 'gtc',
    }

    let requestBodyQty = {
      symbol: selectedCryptoTypeS?.toString() + selectedOrderClass?.toString(),
      qty: orderQuantity,
      side: orderSide,
      type: selectedOrderType,
      time_in_force: getDecimal(orderQuantity) > 0 ? 'day' : 'gtc',
    }

    let requestBodyType = orderQty == false ? requestBody : requestBodyQty

    if (portfolio_value < lastQuote * orderQuantity) {
      setErrorMessage('Your account balance is not sufficient yet.')
      return
    }
    try {
      const postResponse = await postOrder(JSON.stringify(requestBodyType))
      if (postResponse.status === 200) {
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
        NavigationService.navigate('OrderConfirmation', {
          order: requestBodyType,
          lastQuote,
          orderCrypto: 'crypto',
          orderClass: 'crypto',
        })
      }
    } catch (error) {
      // setErrorMessage(response.data.message)
      console.log('error', error)
      setErrorMessage(error)
    }
  }
  const onError = err => {}
  const onRefresh = React.useCallback(() => {
    setRefreshing(true)
    dispatch(getAccountPositions())
    setTimeout(() => {
      setRefreshing(false)
    }, 500)
  }, [])
  useEffect(() => {
    if (isLoggedIn && alpacaToken) {
      onRefresh()
    }
  }, [isLoggedIn, alpacaToken])
  useEffect(() => {
    ;(async () => {
      if (selectedCryptoTypeS) {
        try {
          // console.log('helre')
          const response = await getLastQuoteCrypto(
            selectedCryptoTypeS?.toString() + selectedOrderClass?.toString(),
          )
          // console.log('heressqq')
          if (response) {
            setLastQuote(
              response?.quotes?.[
                (
                  selectedCryptoTypeS?.toString() + selectedOrderClass?.toString()
                ).toString()
              ].ap,
            )
            // console.log('hereqaaq')
          } else {
            setLastQuote(0)
            // console.log('hello')
          }
        } catch (error) {
          console.log('error =>', error)
          // console.log('helloshshshshn')
        }
      } else {
        setLastQuote(0)
      }
    })()
  }, [selectedCryptoTypeS])
  return (
    <>
 
      <Pressable
        style={styles.safeAreaContainer}
        onPress={Keyboard.dismiss}
        accessible={false}>
        <AnimatedLinearGradient customColors={styles.redvestColors} speed={1000}>
          <SafeAreaView style={styles.safeAreaContainer}>
          <BackChevron/>
          <AccountBalanceBar cash={cash} buying_power={buying_power} challenge={false}/>
            <View style={styles.tabsMainContainer}>
              <Pressable
                onPress={() => {
                  setOrderSide('buy')
                }}>
                <View
                  style={[
                    styles.tabContainer,
                    {
                      backgroundColor: orderSide == 'buy' ? colors.white : 'transparent',
                    },
                  ]}>
                  <Text
                    style={[
                      styles.tabText,
                      { color: orderSide == 'buy' ? colors.offBlack : colors.mediumGrey },
                    ]}>
                    BUY
                  </Text>
                </View>
              </Pressable>
              <Pressable
                onPress={() => {
                  setOrderSide('sell')
                }}>
                <View
                  style={[
                    styles.tabContainer,
                    {
                      backgroundColor: orderSide == 'sell' ? colors.white : 'transparent',
                    },
                  ]}>
                  <Text
                    style={[
                      styles.tabText,
                      {
                        color: orderSide == 'sell' ? colors.offBlack : colors.mediumGrey,
                      },
                    ]}>
                    SELL
                  </Text>
                </View>
              </Pressable>
            </View>

            {/* </Pressable> */}

            <View style={styles.safeAreaContainer}>
              {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}> */}
              <View style={[styles.mainContainer]}>
                <View
                  style={{
                    alignSelf: 'center',
                    alignContent: 'center',
                  }}>
                  <View style={[styles.cryptoContainer]}>
                    <Pressable
                      onPress={() =>
                        dispatch(userActions.setInformation({ infoId: 28 }))
                      }
                      style={{ flexDirection: 'row' }}>
                      <Text style={styles.bottomContainerPriceText}>
                        Crypto Currency{'  '}
                      </Text>
                      <Icon
                        type="MaterialIcons"
                        name="info"
                        onPress={() =>
                          dispatch(userActions.setInformation({ infoId: 28 }))
                        }
                        size={widthPercentageToDP(Platform.isPad === true ? 3 : 5.5)}
                        style={{ marginTop: heightPercentageToDP(0.2) }}
                        color={colors.offWhite}
                      />
                    </Pressable>
                    <RNPickerSelect
                      onValueChange={value => {
                        setSelectedCryptoTypeS(value)
                      }}
                      placeholder={{ label: 'select crypto' }}
                      useNativeAndroidPickerStyle={false}
                      value={selectedCryptoTypeS?.toUpperCase()}
                      textInputProps={{
                        style: {
                          color: '#BADF7F',
                          fontFamily: 'DMSans-Medium',
                          fontWeight: '800',
                          fontSize: actuatedNormalize(Platform.isPad === true ? 12 : 19),
                        },
                      }}
                      items={cryptoTypeS}
                    />
                  </View>
                  <View style={[styles.cryptoContainer]}>
                    <Pressable
                      onPress={() =>
                        dispatch(userActions.setInformation({ infoId: 29 }))
                      }
                      style={{ flexDirection: 'row' }}>
                      <Text style={styles.bottomContainerPriceText}>With{'  '}</Text>
                      <Icon
                        type="MaterialIcons"
                        name="info"
                        onPress={() =>
                          dispatch(userActions.setInformation({ infoId: 29 }))
                        }
                        size={widthPercentageToDP(Platform.isPad === true ? 3 : 5.3)}
                        color={colors.offWhite}
                      />
                    </Pressable>
                    <RNPickerSelect
                      onValueChange={value => {
                        setSelectedOrderClass(value)
                      }}
                      placeholder={{ label: 'select currency' }}
                      useNativeAndroidPickerStyle={false}
                      value={selectedOrderClass?.toUpperCase()}
                      textInputProps={{
                        style: {
                          color: '#BADF7F',
                          fontFamily: 'DMSans-Medium',
                          fontWeight: '800',
                          fontSize: actuatedNormalize(Platform.isPad === true ? 12 : 19),
                        },
                      }}
                      items={orderClass}
                    />
                  </View>
                </View>
                {orderQty === false ? (
                  <View style={[styles.quantityContainer]}>
                    <TouchableOpacity onPress={() => setOrderQty(prev => !prev)}>
                      <Tooltip
                        isVisible={toolTipVisible1 && isLoggedIn && !toolTip6}
                        content={
                          <View
                            style={{
                              width: widthPercentageToDP(47),
                              height: heightPercentageToDP(5),
                            }}>
                            <Text
                              style={[
                                textStyles.bigRegular,
                                {
                                  fontSize: actuatedNormalize(12),
                                  color: 'black',
                                },
                              ]}>
                              Tap to change to quantity
                            </Text>
                          </View>
                        }
                        placement="top"
                        onClose={doBoth}>
                        <Text
                          style={[
                            textStyles.bigBold,
                            {
                              fontSize: actuatedNormalize(
                                Platform.isPad === true ? 14:  19 ,
                              ),
                              color: colors.white,
                            },
                          ]}>
                          {selectedOrderClass?.toString() === '/USD' ? '$' : ''}
                          {selectedOrderClass?.toString() === '/BTC' ? (
                            <Icon
                              type="FontAwesome"
                              name="bitcoin"
                              size={widthPercentageToDP(Platform.isPad === true ? 4 : 6)}
                              style={{
                                marginTop: heightPercentageToDP(0.6),
                              }}
                              color={'white'}
                            />
                          ) : null}
                        </Text>
                      </Tooltip>
                    </TouchableOpacity>
                    <Controller
                      control={control}
                      errors={errors}
                      name="orderQuantity"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                          placeholder="enter any amount"
                          style={[styles.textinputSyles]}
                          value={orderQuantity}
                          onChangeText={newValue => {
                            onChange(newValue)
                            setOrderQuantity(newValue)
                          }}
                          keyboardType="numeric"
                        />
                      )}
                    />
                  </View>
                ) : (
                  <View style={[styles.quantityContainer]}>
                    <TouchableOpacity onPress={() => setOrderQty(prev => !prev)}>
                      <Text
                        style={[
                          textStyles.bigBold,
                          {
                            fontSize: actuatedNormalize(
                              Platform.isPad === true ? 14 : 19,
                            ),
                            color: colors.white,
                          },
                        ]}>
                        Quantity
                      </Text>
                    </TouchableOpacity>
                    <Controller
                      control={control}
                      errors={errors}
                      name="orderQuantity"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                          placeholder="enter any amount"
                          style={[styles.textinputSyles]}
                          value={orderQuantity}
                          onChangeText={newValue => {
                            onChange(newValue)
                            setOrderQuantity(newValue)
                          }}
                          keyboardType="numeric"
                        />
                      )}
                    />
                  </View>
                )}
              </View>
              {/* </TouchableWithoutFeedback> */}
            </View>
            <HorizontalRule style={{ marginVertical: 0, width: '100%' }} />
            <View style={[styles.bottomContainer]}>
              <View style={{ paddingVertical: heightPercentageToDP(2) }}>
                {(selectedOrderClass?.toString() === '/BTC' ||
                  selectedOrderClass?.toString() === '/USDT') && (
                  <View style={styles.bottomContainerRows}>
                    <CustomInputLabel text="Your Available Currency" big />
                    {selectedOrderClass?.toString() === '/BTC' ? (
                      <Text style={styles.bottomContainerPriceText}>
                        {positions &&
                          positions.map(
                            (position, index) =>
                              position.symbol?.toString() === 'BTCUSD' &&
                              parseFloat(position.qty)?.toFixed(3),
                          )}
                      </Text>
                    ) : (
                      <Text style={styles.bottomContainerPriceText}>
                        {positions &&
                          positions.map(
                            (position, index) =>
                              position.symbol?.toString() === 'USDTUSD' &&
                              parseFloat(position.qty)?.toFixed(3),
                            // position.symbol)?.toString() + ' ' + (position.qty)?.toString()
                          )}
                      </Text>
                    )}
                  </View>
                )}
                <View style={styles.bottomContainerRows}>
                  <Pressable
                    onPress={() =>
                      dispatch(userActions.setInformation({ infoId: 27 }))
                    }>
                    <CustomInputLabel text="Currency Price" big info />
                  </Pressable>
                  {lastQuote === 0 && selectedCryptoTypeS !== null ? (
                    <DotIndicator
                      color={colors.white}
                      size={5}
                      style={{ marginLeft: widthPercentageToDP(43) }}
                    />
                  ) : (
                    <Text style={styles.bottomContainerPriceText}>
                      $ {isNaN(lastQuote) ? '' : lastQuote?.toFixed(2)}
                    </Text>
                  )}
                </View>
                <View style={styles.bottomContainerRows}>
                  <CustomInputLabel text="Total" big />
                  {orderQty === false ? (
                    <Text style={styles.bottomContainerPriceText}>
                      {selectedOrderClass?.toString() === '/USD' && '$ '}
                      {isNaN(parseFloat(orderQuantity))
                        ? ' '
                        : parseFloat(orderQuantity)?.toFixed(2)}
                    </Text>
                  ) : (
                    <Text style={styles.bottomContainerPriceText}>
                      ${' '}
                      {isNaN(lastQuote * orderQuantity)
                        ? ' '
                        : (lastQuote * orderQuantity)
                            ?.toFixed(2)
                            ?.toString()
                            ?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    </Text>
                  )}
                </View>
                <CustomButton
                  primary
                  text="Invest"
                  style={{
                    width: widthPercentageToDP(90),
                    marginTop: heightPercentageToDP(2),
                  }}
                  disabled={subscriptionLoading}
                  // setCurrencyCombo(selectedCryptoTypeS?.toString() + selectedOrderClass?.toString()) &&
                  onPress={() => {
                    isLoggedIn
                      ? // !isSubscribed
                        //   ? setSubscriptionModal(true)
                        //   :
                        handleInvest()
                      : setShowOrderconfirmationModal(true)
                  }}
                  loading={subscriptionLoading}
                />
                {showInvestconfirmation && (
                  <View style={styles.investMainContainer}>
                    <Text style={styles.investInfoText}>
                      Ready to {orderSide} ${' '}
                      {orderQty === false
                        ? parseFloat(orderQuantity)
                            ?.toFixed(2)
                            ?.toString()
                            ?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                        : (lastQuote * orderQuantity)
                            ?.toFixed(2)
                            ?.toString()
                            ?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
                      {'of '}
                      {selectedCryptoTypeS} with {selectedOrderClass?.replace('/', '')}?
                    </Text>
                    <View style={styles.orderCardOptions}>
                      <Pressable
                        style={[styles.orderOption, { backgroundColor: 'white' }]}
                        onPress={handleSubmit(onOrderSubmit, onError)}>
                        <Text style={[textStyles.normalSemiBold, { color: 'black' }]}>
                          {orderSide ? capitalize(orderSide) : 'Invest'}
                        </Text>
                      </Pressable>
                      <Pressable
                        style={[
                          styles.orderOption,
                          {
                            backgroundColor: 'black',
                            borderColor: 'white',
                            borderWidth: heightPercentageToDP(0.2),
                          },
                        ]}
                        onPress={() => setShowInvestconfirmation(false)}>
                        <Text
                          style={[textStyles.normalSemiBold, { color: colors.offWhite }]}>
                          Cancel
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                )}
              </View>
            </View>

            {/* // MODALS  \\ */}
            {showOrderconfirmationModal && (
              <OrderConfirmModal
                visible={showOrderconfirmationModal}
                handleCloseModal={() => {
                  setShowOrderconfirmationModal(false)
                }}
              />
            )}
            {subscriptionModal && !isSubscribed && (
              <Modal
                animationType="slide" // fade, none, slide
                visible={subscriptionModal}
                transparent={true}
                onRequestClose={() => setSubscriptionModal(false)}>
                {isLoadingSub === true && (
                  <View
                    style={{
                      backgroundColor: 'rgba(0, 0, 0,0.8)',
                      // position: 'absolute',
                      height: heightPercentageToDP(100),
                      width: widthPercentageToDP(100),
                      alignSelf: 'center',
                      justifyContent: 'center',
                    }}>
                    <ActivityIndicator
                      style={{ marginTop: heightPercentageToDP(10) }}
                      size="small"
                      color={colors.primary2}
                    />
                  </View>
                )}

                {isLoadingPay && (
                  <View
                    style={{
                      backgroundColor: 'rgba(0, 0, 0,0.87)',
                      // position: 'absolute',
                      height: heightPercentageToDP(100),
                      width: widthPercentageToDP(100),
                      alignSelf: 'center',
                      justifyContent: 'center',
                    }}>
                    <View>
                      <View
                        style={{
                          height: '40%',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Image
                          source={loadingIm}
                          style={{
                            width: widthPercentageToDP(50),
                            resizeMode: 'contain',
                          }}
                        />
                      </View>
                      <View style={{ width: '100%', paddingHorizontal: '5%' }}>
                        <Text
                          style={[
                            textStyles.normalRegular,
                            {
                              color: 'white',
                              textAlign: 'center',
                            },
                          ]}>
                          🏆 Congratulations! We are unlocking your exclusive crypto
                          account 🔥
                        </Text>
                      </View>
                    </View>
                  </View>
                )}
                <View
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    height: heightPercentageToDP(100),
                    width: widthPercentageToDP(100),
                  }}>
                  <ScrollView
                    backgroundColor={colors.offWhite}
                    style={{
                      borderRadius: 30,
                      width: widthPercentageToDP(100),
                      height: heightPercentageToDP(65),
                      marginTop: heightPercentageToDP(35),
                      marginBottom: heightPercentageToDP(
                        Platform.isPad === true ? 20 : 0,
                      ),
                    }}>
                    <View
                      style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text
                        style={[
                          textStyles.bigRegular,
                          {
                            color: 'black',
                            fontSize: actuatedNormalize(18),
                            marginVertical: heightPercentageToDP(3),
                          },
                        ]}>
                        {'    '}
                        Crypto Access
                      </Text>
                      <Icon
                        type="MaterialIcons"
                        name="close"
                        size={widthPercentageToDP(Platform.isPad === true ? 4 : 6)}
                        style={{
                          marginRight: widthPercentageToDP(4),
                          marginTop: heightPercentageToDP(3),
                        }}
                        color={'black'}
                        onPress={() => setSubscriptionModal(false)}
                      />
                    </View>
                    {products &&
                      products.map((item, index) => (
                        <Pressable
                          // onPress={()=>
                          //    setSubscriptionSelection((item?.productId).toString()) &&
                          //    console.log(subscriptionSelection ,'hdhddjda', (item.productId))
                          //   }
                          onPress={() => handlePurchase(item)}
                          key={index}
                          backgroundColor="black"
                          style={{
                            paddingVertical: heightPercentageToDP(2),
                            paddingHorizontal: widthPercentageToDP(4),
                            marginBottom: heightPercentageToDP(3),
                            borderWidth: widthPercentageToDP(1),
                            borderColor:
                              // ((item?.productId).toString() == subscriptionSelection.toString()) ?
                              '#BADF7F',
                            // : 'white'
                            alignSelf: 'center',
                            borderRadius: 20,
                            width: widthPercentageToDP(93),
                            height: heightPercentageToDP(14),
                          }}>
                          <View style={{ flexDirection: 'row' }}>
                            <Text
                              style={[
                                textStyles.bigRegular,
                                { color: 'white', fontSize: actuatedNormalize(15) },
                              ]}>
                              {item?.productId}
                            </Text>
                            <Text
                              style={[
                                textStyles.bigRegular,
                                { color: '#BADF7F', fontSize: actuatedNormalize(12) },
                              ]}>
                              {'   '}%
                              {(
                                (((parseFloat(item?.price) * 1.5)?.toFixed(2) -
                                  parseFloat(item?.price)) /
                                  (parseFloat(item?.price) * 1.5)?.toFixed(2)) *
                                100
                              ).toFixed(0)}{' '}
                              Off{'             '}
                            </Text>
                            <Text
                              style={[
                                textStyles.bigRegular,
                                {
                                  color: 'gray',
                                  textDecorationLine: 'line-through',
                                  fontSize: actuatedNormalize(14),
                                },
                              ]}>
                              {'   '}${(parseFloat(item?.price) * 1.5)?.toFixed(2)}
                            </Text>
                            <Text
                              style={[
                                textStyles.bigRegular,
                                { color: 'gray', fontSize: actuatedNormalize(14) },
                              ]}>
                              {'   '}
                              {item?.currency}
                            </Text>
                          </View>
                          <Text
                            style={[
                              textStyles.bigRegular,
                              {
                                color: 'gray',
                                width: widthPercentageToDP(86),
                                fontSize: actuatedNormalize(11),
                                marginTop: heightPercentageToDP(1),
                              },
                            ]}>
                            {item?.productId} Subscription to free crypto trading game and
                            more...
                          </Text>
                        </Pressable>
                      ))}
                  </ScrollView>
                </View>
              </Modal>
            )}
            {errorMessage && (
              <InvestErrorModal
                errorMessage={errorMessage}
                visible={!!errorMessage}
                handleCloseModal={() => {
                  setErrorMessage('')
                }}
              />
            )}
          </SafeAreaView>
        </AnimatedLinearGradient>
      </Pressable>
    </>
  )
}
const styles = StyleSheet.create({
  safeAreaContainer: { flex: 1, height: '100%' },
  mainContainer: {
    backgroundColor: '#161616',
    paddingHorizontal: widthPercentageToDP(5),
    paddingTop: heightPercentageToDP(2),
    borderTopRightRadius: heightPercentageToDP(4),
    borderTopLeftRadius: heightPercentageToDP(4),
    minHeight: heightPercentageToDP(50),
  },
  textInputContainer: {
    width: '100%',
    height: heightPercentageToDP(6),
    backgroundColor: colors.darkGrey,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
  },
  textInput: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  textInputWrapper: {
    justifyContent: 'center',
    backgroundColor: '#474747',
    width: widthPercentageToDP(40),
    height: 50,
    borderRadius: heightPercentageToDP(1.5),
    marginTop: heightPercentageToDP(1),
  },
  textinputSyles: {
    color: 'white',
    fontSize: actuatedNormalize(Platform.isPad === true ? 14 : 19),
    fontFamily: 'DMSans-Medium',
    padding: 0,
  },
  bottomContainer: {
    backgroundColor: '#161616',
    paddingLeft: widthPercentageToDP(5),
    paddingRight: widthPercentageToDP(6),
  },
  bottomContainerRows: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bottomContainerPriceText: [
    textStyles.bigRegular,
    {
      color: colors.white,
      fontSize: actuatedNormalize(Platform.isPad === true ? 10 : 14),
    },
  ],
  orderCardOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',

    width: '90%',
    borderRadius: 30,
    marginBottom: 25,
  },
  orderOption: {
    borderRadius: 30,
    width: '47%',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  investMainContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: heightPercentageToDP(0.1),
  },
  cryptoContainer: {
    borderColor: 'white',
    width: widthPercentageToDP(90),
    height: heightPercentageToDP(Platform.isPad === true ? 7 : 10),
    borderWidth: 0.5,
    paddingVertical: heightPercentageToDP(1),
    paddingHorizontal: widthPercentageToDP(4),
    borderRadius: 10,
    marginTop: heightPercentageToDP(2),
  },
  quantityContainer: {
    borderColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: widthPercentageToDP(90),
    height: heightPercentageToDP(Platform.isPad === true ? 5 : 6),
    borderWidth: 0.5,
    paddingVertical: heightPercentageToDP(1),
    paddingHorizontal: widthPercentageToDP(4),
    borderRadius: 7,
    marginTop: heightPercentageToDP(2),
  },
  investInfoText: [
    textStyles.bigRegular,
    { color: 'white', marginBottom: heightPercentageToDP(1) },
  ],
  safeAreaContainer: {
    flex: 1,
    // position:'absolute',
    height: heightPercentageToDP(100),

    // backgroundColor: 'black'
  },
  topBarContainer: {
    marginTop: widthPercentageToDP(4),
    backgroundColor: '#212121',
    height: heightPercentageToDP(10),
    width: widthPercentageToDP(90),
    borderRadius: heightPercentageToDP(1),
    justifyContent: 'center',
    alignSelf: 'center',
  },
  topBarRow: {
    flexDirection: 'row',
    marginHorizontal: widthPercentageToDP(5),
    marginVertical: 5,
  },
  topBarRowText: [
    textStyles.bigRegular,
    {
      color: 'white',
    },
  ],
  tabsMainContainer: {
    marginHorizontal: heightPercentageToDP(1),
    marginVertical: heightPercentageToDP(3),
    flexDirection: 'row',
  },
  tabContainer: {
    paddingVertical: widthPercentageToDP(3),
    borderRadius: widthPercentageToDP(12),
    minWidth: widthPercentageToDP(24),
    alignItems: 'center',
    marginHorizontal: heightPercentageToDP(1),
  },
  redvestColors: ['#80A471', '#AFC07E', '#79A471', '#7198A4', '#2383C8', '#644B99'],
  tabText: [
    textStyles.smallBold,
    {
      color: 'black',
    },
  ],
})
export default EasyCryptoInvestScreen