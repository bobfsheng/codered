import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  FlatList,
  RefreshControl,
  Platform,
} from 'react-native'
import { capitalize } from 'lodash'
import { NavigationService } from '@navigation'
import firestore from '@react-native-firebase/firestore'
import RNPickerSelect from 'react-native-picker-select'
import {
  actuatedNormalize,
  colors,
  heightPercentageToDP,
  textStyles,
  widthPercentageToDP,
  localSaveItem,
  StorageKeys,
  pushOrderToFirestore,
} from '@utils'
import {
  CustomButton,
  CustomInputLabel,
  CustomPositionAssetsFour,
  HorizontalRule,
  Icon,
  InvestErrorModal,
  OrderConfirmModal,
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
import { getLastQuote, postOrder } from '@services'
import Tooltip from 'react-native-walkthrough-tooltip'
import {
  cryptoType,
  orderSide,
  orderType,
} from '@constants/cryptoTypes'

const EasyInvestScreen = ({ stockTickeri, toolTip4 }) => {
  const dispatch = useReduxDispatch()
  const { portfolio_value } = useUserSelector(state => state)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()
  const { isLoggedIn, userId, alpacaToken } = useAuthSelector(state => state)
  const { positions } = useUserSelector(state => state)
  const [refreshing, setRefreshing] = React.useState(false)
  const [selectedOrderSide, setSelectedOrderSide] = useState('buy')
  const [selectedCryptoType, setSelectedCryptoType] = useState('')
  const [orderQuantity, setOrderQuantity] = useState(0)
  const [stopLoss, setStopLoss] = useState('')
  const [limitPrice, setLimitPrice] = useState('')
  const [lastQuote, setLastQuote] = useState(0)
  const [stockTicker, setStockTicker] = useState(
    stockTickeri === undefined ? '' : stockTickeri,
  )
  useEffect(() => {
    if (stockTickeri !== undefined) {
      setStockTicker(stockTickeri)
    }
  }, [stockTickeri])


  const [showOrderconfirmationModal, setShowOrderconfirmationModal] = useState(false)
  const [showInvestconfirmation, setShowInvestconfirmation] = useState(false)
  const [selectedOrderType, setSelectedOrderType] = useState('market')
  const [selectedOrderClass, setSelectedOrderClass] = useState('stocks')
  const [errorMessage, setErrorMessage] = useState('')
  const [toolTipVisible1, setToolTipVisible1] = useState(true)

  const doBoth = async () => {
    // setToolTipVisible2(true);
    setToolTipVisible1(false)
    dispatch(userActions.setToolTip4({ toolTip4: true }))
    await localSaveItem(StorageKeys.toolTipShown4, JSON.stringify(true))
    // setShowMarketModal(true)
  }

  // console.log(toolTip4)

  const handleInvest = async () => {
    if (orderQuantity <= 0 || isNaN(orderQuantity)) {
      setErrorMessage('Order amount must be greater than 0')
      return
    }
    if (selectedOrderClass === 'stocks') {
      if (stockTicker?.length < 1) {
        setErrorMessage('Please provide stock')
        setLastQuote(0)
        return
      } else {
        try {
          const response = await getLastQuote(stockTicker)
          if (response?.trade) {
            setLastQuote(response?.trade?.p)
          } else {
            setLastQuote(0)
          }
        } catch (error) {
          // console.log('error =>', error)
          setErrorMessage(error)
          setLastQuote(0)
          return
        }
      }
    }
    if (selectedOrderClass === 'crypto') {
      if (!selectedCryptoType) {
        setErrorMessage('Please select crypto')
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
  const onOrderSubmit = async () => {
    let requestBody = {
      symbol: selectedOrderClass == 'crypto' ? selectedCryptoType : stockTicker,
      notional: orderQuantity,
      side: selectedOrderSide,
      type: selectedOrderType,
      time_in_force: selectedOrderClass == 'crypto' ? 'gtc' : 'day',
    }

    let requestBodyType = { ...requestBody }
    if (requestBody.type === 'limit') {
      requestBodyType = { ...requestBody, limit_price: limitPrice }
    } else if (requestBody.type === 'trailing_stop') {
      requestBodyType = { ...requestBody, trail_percent: stopLoss }
    } else if (requestBody.type === 'stop_limit') {
      requestBodyType = {
        ...requestBody,
        limit_price: limitPrice,
        stop_loss: stopLoss,
      }
    }

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
          orderClass: selectedOrderClass,
        })
      }
    } catch (error) {
      // setErrorMessage(response.data.message)
      // console.log('error', error)
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
      if (stockTicker) {
        try {
          const response = await getLastQuote(stockTicker)
          if (response?.trade) {
            setLastQuote(response?.trade?.p)
          } else {
            setLastQuote(0)
          }
        } catch (error) {
          // console.log('error =>', error)
        }
      } else {
        setLastQuote(0)
      }
    })()
  }, [stockTicker])
  return (
    <>
      <View style={styles.safeAreaContainer}>
        {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}> */}
        <View style={styles.mainContainer}>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <RNPickerSelect
              onValueChange={newValue => {
                setSelectedOrderSide(newValue)
              }}
              value={selectedOrderSide}
              placeholder={{}}
              useNativeAndroidPickerStyle={false}
              textInputProps={{
                style: {
                  color: selectedOrderSide == 'buy' ? '#BADF7F' : '#EB5757',
                  fontFamily: 'DMSans-Medium',
                  fontWeight: '800',
                  fontSize: actuatedNormalize(19),
                },
              }}
              items={orderSide}
            />
            <View
              style={{
                justifyContent: 'center',
              }}>
              <Text
                style={[
                  textStyles.bigBold,
                  { fontSize: actuatedNormalize(19), color: colors.white },
                ]}>
                {'  '}$
              </Text>
            </View>
            <View
              style={{
                justifyContent: 'center',
                width: Platform.OS === 'android' ? widthPercentageToDP(40) : undefined,
                marginHorizontal: widthPercentageToDP(2),
              }}>
              <Controller
                control={control}
                errors={errors}
                name="orderQuantity"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="enter any amount"
                    placeholderTextColor="#555558"
                    style={[styles.textinputSyles, { width: widthPercentageToDP(100) }]}
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
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text
              style={[
                textStyles.bigBold,
                { fontSize: actuatedNormalize(19), color: colors.white },
              ]}>
              {'dollars of '}
            </Text>
            <View style={{ justifyContent: 'center' }}>
              {selectedOrderClass == 'crypto' ? (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <RNPickerSelect
                    onValueChange={value => {
                      setSelectedCryptoType(value)
                    }}
                    placeholderTextColor="#555558"
                    placeholder={{ label: 'select crypto' }}
                    useNativeAndroidPickerStyle={false}
                    value={selectedCryptoType?.toUpperCase()}
                    textInputProps={{
                      style: {
                        color: '#BADF7F',
                        fontFamily: 'DMSans-Medium',
                        fontWeight: '800',
                        fontSize: actuatedNormalize(19),
                      },
                    }}
                    items={cryptoType}
                  />
                  <Text
                    style={[
                      textStyles.bigBold,
                      { fontSize: actuatedNormalize(19), color: colors.white },
                    ]}>
                    {' at'}
                  </Text>
                </View>
              ) : (
                <Tooltip
                  isVisible={toolTipVisible1 && isLoggedIn && !toolTip4}
                  content={
                    <View
                      style={{
                        width: widthPercentageToDP(55),
                        height: heightPercentageToDP(8),
                        paddingHorizontal: heightPercentageToDP(0.3),
                      }}>
                      <Text
                        style={[
                          textStyles.bigRegular,
                          {
                            fontSize: actuatedNormalize(12),
                            // width:widthPercentageToDP(40),
                            paddingHorizontal: heightPercentageToDP(0.3),
                            color: 'black',
                            textAlign: 'center',
                          },
                        ]}>
                        If you don't know the ticker, you can search by tapping on the
                        magnifying glass 🔍{' '}
                      </Text>
                    </View>
                  }
                  placement="bottom"
                  onClose={doBoth}>
                  <Controller
                    control={control}
                    errors={errors}
                    name="stockTicker"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <TextInput
                          placeholderTextColor="#555558"
                          placeholder={'ticker'}
                          textAlign="center"
                          style={[
                            styles.textinputSyles,
                            {
                              width:
                                Platform.OS === 'android'
                                  ? widthPercentageToDP(15)
                                  : undefined,
                            },
                          ]}
                          value={stockTicker}
                          onChangeText={newValue => {
                            onChange(newValue.toUpperCase())
                            setStockTicker(newValue.toUpperCase())
                          }}
                        />
                        <Icon
                          type="Ionicons"
                          name="md-search-circle"
                          color={'gray'}
                          size={widthPercentageToDP(8)}
                          style={{ marginHorizontal: widthPercentageToDP(1) }}
                          onPress={() =>
                            NavigationService.navigate('SelectTicker', { tab: 'easy' })
                          }
                        />
                        <Text
                          style={[
                            textStyles.bigBold,
                            { fontSize: actuatedNormalize(19), color: colors.white },
                          ]}>
                          {'at'}
                        </Text>
                      </View>
                    )}
                  />
                </Tooltip>
              )}
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
            }}>
            <RNPickerSelect
              onValueChange={newValue => {
                setSelectedOrderType(newValue)
              }}
              placeholder={{}}
              useNativeAndroidPickerStyle={false}
              value={selectedOrderType}
              textInputProps={{
                style: {
                  color: '#BADF7F',
                  fontFamily: 'DMSans-Medium',
                  fontWeight: '800',
                  fontSize: actuatedNormalize(19),
                },
              }}
              items={orderType}
            />
            {selectedOrderType === 'limit' && (
              <View
                style={{
                  justifyContent: 'center',
                  minWidth: 100,
                  marginLeft: widthPercentageToDP(3),
                }}>
                <Controller
                  control={control}
                  errors={errors}
                  name="limit"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      showSoftInputOnFocus={false}
                      placeholder="enter price"
                      placeholderTextColor="#555558"
                      style={[styles.textinputSyles, { width: widthPercentageToDP(100) }]}
                      textAlign="left"
                      value={limitPrice}
                      keyboardType="numeric"
                      onChangeText={newValue => {
                        onChange(newValue)
                        setLimitPrice(newValue)
                      }}
                    />
                  )}
                />
              </View>
            )}
          </View>
          <HorizontalRule
            style={{
              marginVertical: heightPercentageToDP(2),
              width: '100%',
            }}
          />

          {isLoggedIn && positionBool && (
            <View
              style={{
                flexDirection: 'row',
                marginVertical: heightPercentageToDP(1),
                position: 'absolute',
                top: 115,
              }}>
              <Text
                style={[
                  textStyles.normalSemiBold,
                  {
                    color: '#fff',
                    marginTop: heightPercentageToDP(0.5),
                    fontSize: actuatedNormalize(14),
                    marginLeft: widthPercentageToDP(4),
                  },
                ]}>
                Your Positions
              </Text>
              <Icon
                type="AntDesign"
                name={positionBool ? 'up' : 'down'}
                size={widthPercentageToDP(4)}
                style={{
                  marginTop: heightPercentageToDP(1.0),
                  marginLeft: widthPercentageToDP(3),
                }}
                color="white"
                onPress={() => {
                  setPositionBool(prev => !prev)
                }}
              />
            </View>
          )}
          {positionBool && (
            <View
              style={{
                position: 'absolute',
                top: 160,
                alignSelf: 'center',
                height: heightPercentageToDP(30),
              }}>
              <FlatList
                showsVerticalScrollIndicator={false}
                data={positions}
                renderItem={({ item }) => <CustomPositionAssetsFour position={item} />}
                initialNumToRender={10}
                contentContainerStyle={{
                  alignItems: 'center',
                  paddingBottom: heightPercentageToDP(15),
                }}
                refreshControl={
                  <RefreshControl
                    colors={[colors.offWhite]}
                    tintColor={colors.offWhite}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
              />
            </View>
          )}
        </View>
        {/* </TouchableWithoutFeedback> */}
      </View>
      <HorizontalRule style={{ marginVertical: 0, width: '100%' }} />
      <View style={styles.bottomContainer}>
        <View style={{ paddingVertical: heightPercentageToDP(2) }}>
          <View style={styles.bottomContainerRows}>
            <Pressable
              onPress={() =>
                dispatch(userActions.setInformation({ infoId: 26 }))
              }>
              <CustomInputLabel text="Price per share" big info />
            </Pressable>
            {lastQuote === 0 && stockTicker !== null ? (
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
            <Text style={styles.bottomContainerPriceText}>
              ${' '}
              {isNaN(parseFloat(orderQuantity))
                ? ' '
                : parseFloat(orderQuantity)
                    ?.toFixed(2)
                    ?.toString()
                    ?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            </Text>
          </View>

          <CustomButton
            primary
            text={showInvestconfirmation === false ? 'Invest' : 'Close'}
            style={{
              width: widthPercentageToDP(90),
              marginTop: heightPercentageToDP(2),
            }}
            onPress={() => {
              isLoggedIn ? handleInvest() : setShowOrderconfirmationModal(true)
            }}
          />
          {showInvestconfirmation && (
            <View style={styles.investMainContainer}>
              <Text style={styles.investInfoText}>
                Ready to {selectedOrderSide} ${' '}
                {parseFloat(orderQuantity)
                  ?.toFixed(2)
                  ?.toString()
                  ?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
                {'of '}
                {selectedOrderClass === 'stocks' ? stockTicker : selectedCryptoType} ?
              </Text>
              <View style={styles.orderCardOptions}>
                <Pressable
                  style={[styles.orderOption, { backgroundColor: 'white' }]}
                  onPress={handleSubmit(onOrderSubmit, onError)}>
                  <Text style={[textStyles.normalSemiBold, { color: 'black' }]}>
                    {selectedOrderSide ? capitalize(selectedOrderSide) : 'Invest'}
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
                  <Text style={[textStyles.normalSemiBold, { color: colors.offWhite }]}>
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
                NavigationService.navigate('Invest',  { screen: 'EasyCryptoInvestScreen' })
            }
          }}
        />
      )}
    </>
  )
}
const styles = StyleSheet.create({
  safeAreaContainer: { flex: 1, backgroundColor: colors.lightBrown, height: '100%' },
  mainContainer: {
    backgroundColor: '#161616',
    paddingHorizontal: widthPercentageToDP(5),
    paddingTop: heightPercentageToDP(2),
    borderTopRightRadius: heightPercentageToDP(3),
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
    color: '#BADF7F',
    fontSize: actuatedNormalize(19),
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
  bottomContainerPriceText: [textStyles.bigRegular, { color: colors.white }],
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
  investInfoText: [
    textStyles.bigRegular,
    { color: 'white', marginBottom: heightPercentageToDP(1) },
  ],
})
export { EasyInvestScreen }
