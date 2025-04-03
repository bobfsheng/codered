import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native'
import axios from 'axios'
import {
  actuatedNormalize,
  heightPercentageToDP,
  widthPercentageToDP,
  textStyles,
  colors,
} from '@utils'
import {
  CustomButton,
  CustomInputLabel,
  HorizontalRule,
  CustomSuggestions,
  // CustomAdsModal,
  ConfettiModal,
} from '@components'
import { NavigationService } from '@navigation'
import { InterstitialAd, TestIds, AdEventType } from 'react-native-google-mobile-ads'
import { useUserSelector } from '@store'
import { InAppPurchaseHook } from '@hooks'

const OrderConfirmation = ({ route }) => {
  const { isLoadingPay } = InAppPurchaseHook()
  const { marketStatus, subscriptionName, isSubscriptionLoaded } = useUserSelector(
    state => state,
  )
  const [showSubscriptionModalAds, setShowSubscriptionModalAds] = useState(false)
  const [positionsExploreRow, setPositionsExploreRow] = useState(null)
  const [modalOpen, setModalOpen] = useState(true)
  const { order } = route?.params
  const { orderClass } = route?.params
  const { orderCrypto } = route?.params

  const [modalVisible, setModalVisible] = useState(true)
  const [loaded, setLoaded] = useState(false)
  const adUnitID = Platform.select({
    // ios: 'ca-app-pub-6423039727754608/9436702124',
    // ios: 'ca-app-pub-6423039727754608/8376987428',
    ios: 'ca-app-pub-6423039727754608/4073197094',
    // android: 'ca-app-pub-6423039727754608/5584995132',
    // android: 'ca-app-pub-6423039727754608/2005104475',
    android: 'ca-app-pub-6423039727754608/6232456575',
  })
  const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : adUnitID
  const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
    requestNonPersonalizedAdsOnly: true,
    keywords: ['stock market', 'finance', 'stocks', 'money'],
  })

  const handleRefresh = async () => {
    const alpacaMarketApiRow = axios.create({
      baseURL: 'https://paper-api.alpaca.markets/',
      headers: {
        // Authorization: `Bearer d674ec3c-077b-41c3-b712-3b17d997079d`,
        // config.headers = {
        'APCA-API-KEY-ID': 'PKI4FE040C9SF0UEI6QS',
        'APCA-API-SECRET-KEY': '5aEKhKeebyYk3hV0R14B0xZiBHAanDRAZg27m2QT',
      },
    })
    try {
      const response = await alpacaMarketApiRow.get('v2/positions')
      if (response.status === 200) {
        setPositionsExploreRow(response.data)
      }
    } catch (error) {
      // console.log('getPositions explore =>', error.response)
      null
    }
  }

  useEffect(() => {
    handleRefresh()
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setModalVisible(false)
    }, 4000)

    return () => clearTimeout(timer)
  }, [])

  // useEffect(() => {
  //   if (isSubscriptionLoaded === false) return
  //   if (subscriptionName !== '') return
  //   ;(async () => {
  //     try {
  //       const unsubscribe = interstitial.addAdEventsListener(({ type, payload }) => {
  //         if (type === AdEventType.LOADED) {
  //           interstitial.show({ immersiveModeEnabled: true })
  //           setLoaded(true)
  //         }
  //         if (type === AdEventType.ERROR) {
  //         }
  //         if (type === AdEventType.CLOSED) {
  //           // console.log('add close event')
  //           setLoaded(false)
  //           setShowSubscriptionModalAds(true)
  //         }
  //       })

  //       interstitial.load()
  //       // setTimeout(() => setShowSubscriptionModalAds(true), setModalVisible(false), 4000)

  //       return unsubscribe
  //     } catch (error) {
  //       console.log('error ad=>', error)
  //     }
  //   })()
  // }, [subscriptionName, isSubscriptionLoaded])

  return (
    <View style={{ flex: 1, backgroundColor: '#121212' }}>
      {/* {isSubscriptionLoaded === true && subscriptionName === '' && (
        <CustomAdsModal
          showSubscriptionModalAds={showSubscriptionModalAds}
          setShowSubscriptionModalAds={setShowSubscriptionModalAds}
        />
      )} */}
      <View
        style={{
          width: '100%',
          alignItems: 'center',
        }}>
        <Text style={styles.orderTitle}>Order Confirmation </Text>
      </View>
      <View style={{ flex: 1 }}>
        <ScrollView>
          <View
            style={{
              width: '100%',
              justifyContent: 'center',
            }}>
            <View style={styles.labelAndTextContainer}>
              {/* ---label---- */}
              <CustomInputLabel text="Side" hugeFont big />
              <Text style={styles.orderText}>{order?.side?.toUpperCase()}</Text>
            </View>
            <HorizontalRule />
            <View style={styles.labelAndTextContainer}>
              {/* ---label---- */}
              <CustomInputLabel text="Stock ticker" hugeFont big />
              <Text style={styles.orderText}>{order?.symbol?.toUpperCase()}</Text>
            </View>
            <HorizontalRule />
            <View style={styles.labelAndTextContainer}>
              {/* ---label---- */}
              <CustomInputLabel
                text={isNaN(order?.qty) || order?.qty == null ? 'Amount' : 'Quantity'}
                hugeFont
                big
              />
              <Text style={styles.orderText}>
                {isNaN(order?.qty) || order?.qty == null
                  ? '$ ' + order?.notional
                  : order?.qty}
              </Text>
            </View>
            <HorizontalRule />

            <View style={styles.labelAndTextContainer}>
              {/* ---label---- */}
              <CustomInputLabel text="Order Type" hugeFont big />
              <Text
                style={[
                  styles.orderText,
                  { alignSelf: 'center', alignItems: 'center', justifyContent: 'center' },
                ]}>
                {order?.type?.toUpperCase()}
              </Text>
            </View>
            {/* <Text style={[styles.orderTitle,{ marginTop:heightPercentageToDP(2), fontSize:actuatedNormalize(15), marginLeft:heightPercentageToDP(13)}]}>Suggested Stocks</Text>  */}
            <ScrollView
              showsHorizontalScrollIndicator={false}
              horizontal={true}
              style={{ flexDirection: 'row', marginTop: heightPercentageToDP(4) }}>
              {/* <Text style={styles.orderText}>Suggested Stocks</Text> */}

              {positionsExploreRow &&
                positionsExploreRow.map((item, index) => (
                  <CustomSuggestions key={index} position={item} explore={true} />
                ))}
            </ScrollView>
            <View
              style={{
                marginTop: heightPercentageToDP(3),
                alignItems: 'center',
              }}>
              <CustomButton
                primary
                text="Done"
                onPress={() => {
                  orderCrypto === 'crypto'
                    ? // NavigationService.navigate('Invest',  {
                      //   screen:  'EasyCryptoInvestScreen',
                      //   // params: { screen: marketStatus === true || orderClass === 'crypto'  ? 'PositionScreen': 'OrderScreen' },
                      // })
                      NavigationService.reset([
                        { name: 'BottomTabNavigator', params: { screen: 'Crypto' } },
                      ])
                    : NavigationService.reset([
                        { name: 'BottomTabNavigator', params: { screen: 'Invest' } },
                      ])
                }}
              />

              <CustomButton
                text={
                  marketStatus === true || orderClass === 'crypto'
                    ? 'View Position'
                    : 'View Orders or Cancel'
                }
                primary
                onPress={() =>
                  NavigationService.navigate('Account', {
                    screen: 'OrderAndPositionTopTab',
                    params: {
                      screen:
                        marketStatus === true || orderClass === 'crypto'
                          ? 'PositionScreen'
                          : 'OrderScreen',
                    },
                  })
                }
              />
            </View>
          </View>
        </ScrollView>
      </View>
      {/* {isLoadingPay && modalOpen && (
        <CustomAdsSubscriptionModal setModalOpen={setModalOpen} />
      )} */}
      {modalVisible && (
        <ConfettiModal modalVisible={modalVisible} setModalVisible={setModalVisible} />
      )}
    </View>
  )
}
const styles = StyleSheet.create({
  labelAndTextContainer: {
    flexDirection: 'row',
    marginTop: 15,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  loadingImage: {
    width: widthPercentageToDP(40),
    marginLeft: widthPercentageToDP(5),
    marginBottom: heightPercentageToDP(25),
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    resizeMode: 'contain',
  },
  orderText: [
    textStyles.bigRegular,
    {
      alignSelf: 'center',
      fontSize: actuatedNormalize(16),
      color: 'white',
    },
  ],

  orderTitle: [
    textStyles.bigRegular,
    {
      marginTop: heightPercentageToDP(3),
      color: 'white',
      fontSize: actuatedNormalize(21),
    },
  ],
  loadingText: [
    textStyles.normalRegular,
    {
      color: 'black',
      // top: heightPercentageToDP(70),
      textAlign: 'center',
      paddingHorizontal: widthPercentageToDP(10),
      paddingTop: widthPercentageToDP(3),
      paddingBottom: widthPercentageToDP(7),
      alignContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      justifyContent: 'center',
    },
  ],
  positionCard: {
    flexDirection: 'column',
    alignItems: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    height: heightPercentageToDP(18),
    width: widthPercentageToDP(35),
    borderRadius: heightPercentageToDP(1),
    borderWidth: widthPercentageToDP(0.7),
    borderColor: colors.primary,
    marginTop: heightPercentageToDP(1),
    marginHorizontal: widthPercentageToDP(1),
  },
  symbol: [
    textStyles.normalSemiBold,
    {
      color: 'white',
      fontSize: actuatedNormalize(17),
      paddingHorizontal: widthPercentageToDP(3),
      alignContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      justifyContent: 'center',
    },
  ],
})
export { OrderConfirmation }
