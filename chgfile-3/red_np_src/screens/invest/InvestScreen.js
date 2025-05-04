import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TextInput, Pressable, Platform } from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker'
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button'
import {
  actuatedNormalize,
  colors,
  getDecimal,
  heightPercentageToDP,
  textStyles,
  widthPercentageToDP,
  pushOrderToFirestore,
} from '@utils'
import {
  CustomButton,
  CustomInputLabel,
  HorizontalRule,
  Icon,
  InvestErrorModal,
  OrderConfirmModal,
  VirtualizedView,
} from '@components'
import firestore from '@react-native-firebase/firestore'
import { Controller, useForm } from 'react-hook-form'
import { DotIndicator } from 'react-native-indicators'
import { useAuthSelector, useReduxDispatch, useUserSelector, userActions } from '@store'
import { NavigationService } from '@navigation'
import { getLastQuote, postOrder } from '@services'
import { capitalize } from 'lodash'

const radioButtonProps = [
  { label: 'Buy', value: 'buy' },
  { label: 'Sell', value: 'sell' },
  ,
]

const InvestScreen = ({ stockTicker }) => {
  const dispatch = useReduxDispatch()
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()
  const { isLoggedIn, userId, alpacaToken } = useAuthSelector(state => state)
  const { portfolio_value } = useUserSelector(state => state)

  const [radioButtonIndex, setRadioButtonIndex] = useState(0)
  const [selectedOrderSide, setSelectedOrderSide] = useState('buy')
  const [orderQuantity, setOrderQuantity] = useState('')
  const [stopLoss, setStopLoss] = useState('')
  const [limitPrice, setLimitPrice] = useState('')
  const [lastQuote, setLastQuote] = useState(0)
  const [showOrderconfirmationModal, setShowOrderconfirmationModal] = useState(false)
  const [showInvestconfirmation, setShowInvestconfirmation] = useState(false)
  const [open, setOpen] = useState(false)
  const [selectedOrderType, setSelectedOrderType] = useState('market')
  const [errorMessage, setErrorMessage] = useState('')
  const [orderType, setOrderType] = useState([
    { label: 'Market', value: 'market' },
    { label: 'Limit', value: 'limit' },
    { label: 'Stop', value: 'trailing_stop' },
  ])

  const handlerRadioButton = (obj, index) => {
    setRadioButtonIndex(index)
    setSelectedOrderSide(obj.value)
  }

  const handleInvest = () => {
    if (!stockTicker) {
      setErrorMessage('Please select stock')
      return
    }
    if (orderQuantity <= 0 || isNaN(orderQuantity)) {
      setErrorMessage('Order quantity must be greater than 0')
      return
    }
    if (selectedOrderType === 'limit') {
      if (limitPrice <= 0 || isNaN(limitPrice)) {
        setErrorMessage('Limit price must be greater than 1')
        return
      }
    }
    if (lastQuote * orderQuantity < 1) {
      setErrorMessage('All orders need to be higher than $1.')
      return
    }
    if (selectedOrderType === 'trailing_stop' || isNaN(orderQuantity)) {
      if (stopLoss <= 0 || isNaN(stopLoss)) {
        setErrorMessage('stop loss quantity must be greater than 1')
        return
      }
    }
    setShowInvestconfirmation(prev => !prev)
  }
  const onOrderSubmit = async () => {
    let requestBody = {
      symbol: stockTicker,
      qty: orderQuantity,
      side: selectedOrderSide,
      type: selectedOrderType,
      time_in_force: getDecimal(orderQuantity) > 0 ? 'day' : 'gtc',
    }
    // const db = firebase.database().ref("User")
    // const user = firebase.auth().currentUser;

    // function invest() {
    //   db.child(`/${user?.uid}/Selections`).push(route.params);
    //   navigation.navigate("stepFiveA", route.params);
    // }

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
      setErrorMessage('Your account balance is not sufficient yet for this.')
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
        })
      }
    } catch (error) {
      // console.log('error', error)
      setErrorMessage(JSON.stringify(error))
    }
  }
  const onError = err => {}
  useEffect(() => {
    ;(async () => {
      if (stockTicker) {
        try {
          const response = await getLastQuote(stockTicker)
          if (response?.trade) {
            setLastQuote(response?.trade?.p)
          }
        } catch (error) {
          // console.log('error =>', error)
          setErrorMessage(error)
        }
      }
    })()
  }, [stockTicker])

  return (
    <>
      <View style={styles.safeAreaContainer}>
        <VirtualizedView
          showsVerticalScrollIndicator={false}
          style={styles.mainContainer}>
          <View style={{ paddingBottom: heightPercentageToDP(10) }}>
            <RadioForm
              style={{ height: heightPercentageToDP(8) }}
              formHorizontal={true}
              animation={true}>
              {radioButtonProps.map((obj, i) => (
                <RadioButton labelHorizontal={true} key={i}>
                  <RadioButtonInput
                    obj={obj}
                    index={i}
                    isSelected={radioButtonIndex === i}
                    onPress={() => handlerRadioButton(obj, i)}
                    borderWidth={heightPercentageToDP(0.2)}
                    buttonInnerColor={'white'}
                    buttonOuterColor={radioButtonIndex === i ? 'colors.primary' : 'white'}
                    buttonSize={heightPercentageToDP(1.5)}
                    buttonStyle={{ marginTop: heightPercentageToDP(1) }}
                  />
                  <RadioButtonLabel
                    obj={obj}
                    index={i}
                    labelHorizontal={true}
                    onPress={() => handlerRadioButton(obj, i)}
                    labelStyle={{
                      fontFamily: 'DMSans-Medium',
                      fontSize: widthPercentageToDP(5),
                      color: 'white',
                      paddingTop: heightPercentageToDP(1.5),

                      marginLeft: widthPercentageToDP(3),
                      marginRight: widthPercentageToDP(8),
                      paddingBottom: heightPercentageToDP(0),
                      fontSize: actuatedNormalize(15),
                    }}
                    labelWrapStyle={{ marginTop: heightPercentageToDP(0), left: 0 }}
                  />
                </RadioButton>
              ))}
            </RadioForm>
            <Pressable
              onPress={() =>
                // how to use the info bottom sheet
                // 1. check the id from infoText.js by searching title
                // 2. just give the id and rest is handled automatically
                // NavigationService.navigate('InfoScreen', {
                //   screenS: 'Stock Ticker',
                // })
                dispatch(userActions.setInformation({ infoId: 20 }))
              }>
              <CustomInputLabel text="Search stocks" big info />
            </Pressable>
            <Pressable
              style={styles.textInputContainer}
              onPress={() =>
                NavigationService.navigate('SelectTicker', { tab: 'invest' })
              }>
              <Icon
                type="FontAwesome"
                name="search"
                color={colors.offWhite}
                size={widthPercentageToDP(5)}
                style={{ marginHorizontal: widthPercentageToDP(3) }}
              />
              <View style={styles.textInput}>
                <Text
                  style={[
                    textStyles.normalRegular,
                    {
                      color: colors.white,
                      fontSize: actuatedNormalize(11),
                    },
                  ]}>
                  {stockTicker || 'Search company or symbol'}
                  {/*  {stockTicker || 'Search stocks'} */}
                </Text>
              </View>
            </Pressable>
            <View
              style={{
                flexDirection: 'row',
                marginTop: heightPercentageToDP(3),
                justifyContent: 'space-between',
              }}>
              <View>
                <Pressable
                  onPress={() =>
                    dispatch(userActions.setInformation({ infoId: 19 }))
                  }>
                  <CustomInputLabel text="Quantity" big info />
                </Pressable>
                <Controller
                  control={control}
                  errors={errors}
                  rules
                  name="orderQuantity"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View style={styles.textInputWrapper}>
                      <TextInput
                        textAlign="center"
                        style={styles.textinputSyles}
                        value={orderQuantity}
                        keyboardType="number-pad"
                        onChangeText={newValue => {
                          onChange(newValue)
                          setOrderQuantity(parseFloat(newValue))
                        }}
                      />
                    </View>
                  )}
                />
              </View>
              <View>
                <Pressable
                  onPress={() =>
                    dispatch(userActions.setInformation({ infoId: 12 }))
                  }>
                  <CustomInputLabel text="Order type" big info />
                </Pressable>
                <View
                  style={{
                    width: widthPercentageToDP(40),
                    marginTop: heightPercentageToDP(1),
                    zIndex: 99,
                  }}>
                  <DropDownPicker
                    dropDownContainerStyle={{
                      backgroundColor: colors.lightBrown,
                      color: colors.white,
                    }}
                    style={{
                      backgroundColor: '#474747',
                      borderRadius: heightPercentageToDP(
                        Platform.isPad === true ? 0.5 : 1.5,
                      ),
                      borderWidth: 0,
                    }}
                    dropDownDirection="TOP"
                    labelStyle={{
                      color: '#9ECB8E',
                      fontSize: actuatedNormalize(11),
                      textAlign: 'center',
                      fontFamily: 'DMSans-Medium',
                    }}
                    listItemLabelStyle={{ color: 'white' }}
                    open={open}
                    value={selectedOrderType}
                    items={orderType}
                    setOpen={setOpen}
                    setValue={setSelectedOrderType}
                    setItems={setOrderType}
                  />
                </View>
              </View>
            </View>
            {selectedOrderType === 'trailing_stop' && (
              <View
                style={{
                  justifyContent: 'flex-start',
                  marginTop: heightPercentageToDP(2),
                }}>
                <Pressable
                  onPress={() =>
                    dispatch(userActions.setInformation({ infoId: 12 }))
                  }>
                  <CustomInputLabel text="Stop Loss" big info />
                </Pressable>
                <Controller
                  control={control}
                  errors={errors}
                  name="stoploss"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View style={styles.textInputWrapper}>
                      <TextInput
                        textAlign="center"
                        style={styles.textinputSyles}
                        value={stopLoss}
                        onChangeText={value => {
                          onChange(value)
                          setStopLoss(parseFloat(value))
                        }}
                        keyboardType="decimal-pad"
                      />
                    </View>
                  )}
                />
              </View>
            )}
            {selectedOrderType === 'limit' && (
              <View
                style={{
                  justifyContent: 'flex-start',
                  marginTop: heightPercentageToDP(2),
                }}>
                <Pressable
                  onPress={() =>
                    dispatch(userActions.setInformation({ infoId: 12 }))
                  }>
                  <CustomInputLabel text="Limit Price" big info />
                </Pressable>
                <Controller
                  control={control}
                  errors={errors}
                  name="limit"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View style={styles.textInputWrapper}>
                      <TextInput
                        textAlign="center"
                        style={styles.textinputSyles}
                        value={limitPrice}
                        onChangeText={value => {
                          onChange(value)
                          setLimitPrice(parseFloat(value))
                        }}
                        keyboardType="decimal-pad"
                      />
                    </View>
                  )}
                />
              </View>
            )}
          </View>
        </VirtualizedView>
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
                style={{ marginLeft: widthPercentageToDP(Platform.isPad == true ?  52: 43) }}
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
              {isNaN(lastQuote * orderQuantity)
                ? ' '
                : (lastQuote * orderQuantity)
                    ?.toFixed(2)
                    ?.toString()
                    ?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            </Text>
          </View>

          <CustomButton
            primary
            text={showInvestconfirmation === false ? 'Invest' : 'Close'}
            style={{ width: widthPercentageToDP(90), marginTop: heightPercentageToDP(2) }}
            onPress={() => {
              isLoggedIn ? handleInvest() : setShowOrderconfirmationModal(true)
            }}
          />
          {showInvestconfirmation && (
            <View style={styles.investMainContainer}>
              <Text style={styles.investInfoText}>
                Ready to {selectedOrderSide} {orderQuantity} shares of {stockTicker} ?
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
                NavigationService.navigate('Invest', { screen: 'EasyCryptoInvestScreen' })
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
    paddingBottom: heightPercentageToDP(10),
    paddingTop: heightPercentageToDP(2),
    marginTop: heightPercentageToDP(Platform.OS == 'android' ? 5 : 0),
    borderTopRightRadius: heightPercentageToDP(3),
    borderTopLeftRadius: heightPercentageToDP(4),
  },
  textInputContainer: {
    width: '100%',
    height: heightPercentageToDP(6),
    marginTop: heightPercentageToDP(0.5),
    backgroundColor: '#474747',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
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
    borderRadius: heightPercentageToDP(Platform.isPad === true ? 0.5 : 1.5),
    marginTop: heightPercentageToDP(1),
  },
  textinputSyles: {
    color: '#8E8E8F',
    fontSize: actuatedNormalize(15),
    fontFamily: 'DMSans-Medium',
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
export { InvestScreen }
