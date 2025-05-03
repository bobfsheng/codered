import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  TouchableOpacity,
  Platform,
} from 'react-native'
import {
  initConnection,
  endConnection,
  flushFailedPurchasesCachedAsPendingAndroid,
  requestPurchase,
  finishTransaction,
  getProducts,
} from 'react-native-iap'
import { getAccountPortfolio, useReduxDispatch, useUserSelector } from '@store'
import {
  BackChevron,
  Icon,
  GiftModal,
  MoneyLoadedModal,
  LoadingModal,
  LoadingPurchaseModal,
  MoneyLoadingErrorModal,
} from '@components'
import {
  actuatedNormalize,
  colors,
  heightPercentageToDP,
  textStyles,
  widthPercentageToDP,
} from '@utils'
import {
  RewardedAd,
  TestIds,
  useRewardedInterstitialAd,
} from 'react-native-google-mobile-ads'
import { addMoney, useAuthSelector } from '@store'
import ContentLoader from 'react-native-easy-content-loader'
import { InAppPurchaseHook } from '@hooks'
import { moneyArray, productSkus, plans, imagesArray } from '@constants/purchasesArrays'

const k20 = require('@assets/images/Purchases/1.png')
const k30 = require('@assets/images/Purchases/2.png')
const k50 = require('@assets/images/Purchases/3.png')
const k100 = require('@assets/images/Purchases/4.png')
const k250 = require('@assets/images/Purchases/5.png')
const k500 = require('@assets/images/Purchases/6.png')
const m1 = require('@assets/images/Purchases/7.png')

const loadingIm = require('@assets/images/HomeScreen/loadi.gif')
const loadingSuccess = require('@assets/images/HomeScreen/loadi.gif')

const Purchases = () => {
  const { isLoadingSub, subscriptionList, isLoadingPay, buySubscriptionHandle } =
    InAppPurchaseHook()
  const dispatch = useReduxDispatch()
  const { userId } = useAuthSelector(state => state)
  const adUnitID = Platform.select({
    ios: 'ca-app-pub-6423039727754608/8184166954',
    android: 'ca-app-pub-6423039727754608/3988880426',
  })

  const adUnitId = __DEV__ ? TestIds.REWARDED_INTERSTITIAL : adUnitID
  const rewarded = RewardedAd.createForAdRequest(adUnitId, {
    requestNonPersonalizedAdsOnly: true,
    keywords: ['stock market', 'finance', 'stocks', 'money'],
  })
  const { isLoaded, isClosed, load, show, isEarnedReward } = useRewardedInterstitialAd(
    adUnitId,
    {
      requestNonPersonalizedAdsOnly: true,
      keywords: ['stock market', 'finance', 'stocks', 'money'],
    },
  )

  const { portfolio_value } = useUserSelector(state => state)
  const [valueToAdd, setValueToAdd] = useState(false)
  const [errorModal, setErrorModal] = useState(false)
  const [moneyLoading, setMoneyLoading] = useState(false)
  const [purchaseLoading, setPurchaseLoading] = useState(false)
  const [moneyLoaded, setMoneyLoaded] = useState(false)
  const [moneyLoadingError, setMoneyLoadingError] = useState(false)
  const [freeMoney, setFreeMoney] = useState(false)
  // const [freeMoney, setFreeMoney] = useState(true)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)

  const handlePurchase = async moneyAmount => {
    try {
      // console.log('helllo')
      setValueToAdd(moneyAmount)
      // console.log('helllo1')
      setMoneyLoading(true)
      // console.log('helllo2')
      const addMoneyResp = await addMoney(
        userId,
        (
          parseFloat(portfolio_value?.split(',')?.join('')) +
          parseFloat(moneyAmount?.split(',')?.join(''))
        )?.toString(),
      )
      if (addMoneyResp === true) {
        setMoneyLoading(false)
        setMoneyLoaded(true)
        dispatch(getAccountPortfolio())
      }
    } catch (error) {
      setMoneyLoadingError(true)
    }
  }
  ///////////////////////////////////////////////////////////////////////
  useEffect(() => {
    initilizeIAPConnection()
    return () => {
      endConnection()
    }
  }, [])

  const initilizeIAPConnection = async () => {
    await initConnection()
      .then(async connection => {
        getItems()
      })
      .catch(err => {
        console.log(`IAP ERROR ${err.code}`, err.message)
      })
    if (Platform.OS === 'android') {
      await flushFailedPurchasesCachedAsPendingAndroid()
        .then(async consumed => {
          console.log('consumed all items?', consumed)
        })
        .catch(err => {
          console.log(
            `flushFailedPurchasesCachedAsPendingAndroid ERROR ${err.code}`,
            err.message,
          )
        })
    }
  }
  // productId, money, price, image
  const getItems = async () => {
    try {
      const availablePurchases = await getProducts(productSkus)
      if (availablePurchases?.length > 0) {
        if (Platform.OS === 'android') {
          const newProducts = availablePurchases?.map((item, index) => {
            return {
              productId: item?.productId,
              image: imagesArray[index],
              money: moneyArray[index],
              price: item?.oneTimePurchaseOfferDetails.formattedPrice,
              currency: item?.oneTimePurchaseOfferDetails.formattedPrice,
            }
          })
          setProducts(newProducts)
        } else if (Platform.OS === 'ios') {
          // console.log('heeeree,z')
          const newProducts = []
          availablePurchases?.forEach((item, index) => {
            plans?.forEach(plan => {
              if (plan.level === item?.productId) {
                const temp = {
                  productId: item?.productId,
                  image: plan?.image,
                  money: plan?.money,
                  price: item?.price,
                  currency: item?.localizedPrice,
                }
                newProducts?.push(temp)
                // console.log('zzz', plans, 'dd',newProducts)
              }
            })
          })
          setProducts(newProducts)
        }
      }
    } catch (err) {
      console.warn('IAP error', err)

      // setError(err.message)
    }
  }
  const buyMoney = async item => {
    try {
      // console.log('hello 0')
      setLoading(true)
      const purchase = await requestPurchase({
        sku: item?.productId,
        andDangerouslyFinishTransactionAutomaticallyIOS: false,
      })
      setLoading(false)
      // console.log('hello 1')
      await finishTransaction({ purchase, isConsumable: true })
      // console.log('hello 2')
      setPurchaseLoading(true)
      handlePurchase(item?.money)
      setPurchaseLoading(false)
    } catch (error) {
      // console.log('hello error')
      setLoading(false)
      console.log(error?.message)
      setMoneyLoadingError(true)
    }
  }
  // useEffect(() => {
  //   if (isClosed === true && isLoaded === false && isEarnedReward === true) {
  //     handleFreeMoneyReward('1000')
  //   }
  // }, [isLoaded, isClosed, isEarnedReward])
  useEffect(() => {
    // getSubscriptionsHandle()
  }, [])
  return (
    <SafeAreaView style={styles.safeAreaView}>
      {/* <View style={styles.topBar}>
        <View style={styles.topBarBackChevron}>
          <BackChevron onPress={() => NavigationService.navigate('Profile')} />
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginVertical: 5,
            marginRight: widthPercentageToDP(4),
          }}> */}
      {/* <TouchableOpacity
            onPress={() => {
              handleFreeMoney()
            }}>
            {portfolio_value === null ? null : (
              <Text style={styles.titleText}>Free Money </Text>
            )}
          </TouchableOpacity> */}
      {/* </View>
      </View> */}
      {!!errorModal && (
        <GiftModal
          visible={!!errorModal}
          handleCloseModal={() => {
            setErrorModal(false)
          }}
        />
      )}
      <View style={{ flex: 1, marginTop: heightPercentageToDP(4) }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
          contentContainerStyle={{
            alignItems: 'center',
          }}>
          {subscriptionList?.length < 3 &&
            moneyArray?.map((item, index) => (
              <View
                key={index}
                style={{
                  width: widthPercentageToDP(90),
                  height: heightPercentageToDP(12),
                  backgroundColor: '#1F1C1B',
                  alignItems: 'center',
                  alignSelf: 'center',
                  alignContent: 'center',
                  paddingTop: heightPercentageToDP(0.5),
                  borderRadius: 10,
                  marginBottom: heightPercentageToDP(2),
                }}>
                <ContentLoader
                  pRows={0}
                  secondaryColor={'rgba(238, 238, 238, 0)'}
                  primaryColor={'rgba(238, 238, 238, 0)'}
                />
                <ContentLoader
                  pRows={1}
                  animationDuration={500}
                  pWidth={[widthPercentageToDP(80), 0, 0]}
                  pHeight={[
                    heightPercentageToDP(2),
                    heightPercentageToDP(1),
                    heightPercentageToDP(0),
                  ]}
                  active
                  primaryColor={'rgba(238, 238, 238, 0.1)'}
                  secondaryColor={'rgba(200, 200, 200, 0.2)'}
                />
              </View>
            ))}

          {subscriptionList &&
            subscriptionList
              ?.sort((a, b) => a?.price - b?.price)
              ?.map((item, index) => (
                <Pressable
                  onPress={() => {
                    buySubscriptionHandle(item?.productId, item?.offerToken)
                  }}
                  key={index}>
                  <View
                    style={{
                      width: widthPercentageToDP(90),
                      height: heightPercentageToDP(15),
                      backgroundColor: '#1F1C1B',
                      alignItems: 'center',
                      borderRadius: 10,
                      flexDirection: 'row',
                      marginBottom: heightPercentageToDP(2),
                    }}>
                    <Image
                      source={item?.image}
                      style={{
                        marginHorizontal: widthPercentageToDP(5),
                        width: widthPercentageToDP(17),
                        resizeMode: 'contain',
                      }}
                    />
                    <View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          width: widthPercentageToDP(60),
                        }}>
                        {/* <Text style={styles.titleText}>$ {item?.money}</Text>
                        <Text style={styles.priceText}>{`${item?.currency}`}</Text> */}
                        <Text style={styles.titleText}>{item?.productId}</Text>
                        <Text style={styles.priceText}>{`${item?.currency}  `}</Text>
                      </View>
                      <Text style={styles.explanationText}>
                        {item?.productId} subscription to unlimited ad free investing and
                        more...
                      </Text>
                    </View>
                  </View>
                </Pressable>
              ))}
        </ScrollView>
      </View>

      {isLoadingPay && (
        <View style={styles.loadingContainer}>
          <Image source={loadingIm} style={styles.loadingImage} />
          <Text style={styles.loadingText}>
            🏆 Congratulations! We are unlocking your exclusive crypto and ad free account
            🔥
          </Text>
        </View>
      )}
      {moneyLoaded && <MoneyLoadedModal valueToAdd={valueToAdd} />}
      {freeMoney && (
        <View
          style={[styles.loadingContainer, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
          <View style={styles.moneyContainer}>
            <Text style={styles.successText}>
              {' '}
              Please keep in mind, When you add money to your accounts, your orders,
              positions and history will be reset.
            </Text>
            <TouchableOpacity
              style={[styles.containerSuccess, { width: widthPercentageToDP(30) }]}
              onPress={() => setFreeMoney(false)}>
              <Text
                style={[
                  textStyles.bigBold,
                  { color: 'white', fontSize: actuatedNormalize(13) },
                ]}>
                Continue
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {/* {isLoadingSub && <LoadingSubModal />} */}
      {isLoadingSub && <LoadingModal />}
      {purchaseLoading && <LoadingPurchaseModal />}
      {moneyLoadingError && <MoneyLoadingErrorModal />}
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  safeAreaView: {
    paddingTop: 25,
    backgroundColor: colors.darkBackground,
    paddingBottom: heightPercentageToDP(3),
    flex: 1,
  },
  topBar: { flexDirection: 'row', paddingBottom: heightPercentageToDP(2) },
  topBarBackChevron: {
    flex: 1,
  },
  topBarTitle: { flex: 4, justifyContent: 'center', alignItems: 'center' },
  headingImage: {
    resizeMode: 'contain',
    width: widthPercentageToDP(90),
    height: heightPercentageToDP(7),
  },
  pressable: {
    flexDirection: 'row',
    marginVertical: heightPercentageToDP(1),
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
  },
  titleText: [
    textStyles.bigBold,
    {
      color: 'white',
      marginBottom: heightPercentageToDP(1),
    },
  ],
  priceText: [
    textStyles.bigRegular,
    {
      color: 'grey',
      marginBottom: heightPercentageToDP(1),
      fontSize: actuatedNormalize(14),
    },
  ],
  explanationText: [
    textStyles.normalRegular,
    {
      color: colors.offWhite,
      width: widthPercentageToDP(56),
      fontSize: actuatedNormalize(11.5),
    },
  ],
  successText: [
    textStyles.normalRegular,
    {
      color: 'black',
      marginHorizontal: widthPercentageToDP(3),
      fontSize: actuatedNormalize(11.5),
      alignSelf: 'center',
      textAlign: 'center',
    },
  ],
  explanationTextBold: [
    textStyles.normalMedium,
    {
      color: 'white',
      width: widthPercentageToDP(65),
    },
  ],
  loadingContainer: {
    height: heightPercentageToDP(100),
    width: '100%',
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.82)',
  },
  loadingImage: {
    width: widthPercentageToDP(50),
    marginLeft: widthPercentageToDP(5),
    marginTop: heightPercentageToDP(10),
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    resizeMode: 'contain',
  },
  loadingSuccessImage: {
    width: widthPercentageToDP(50),
    height: heightPercentageToDP(23),
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  containerSuccess: {
    backgroundColor: 'black',
    width: widthPercentageToDP(60),
    height: heightPercentageToDP(5),
    marginTop: heightPercentageToDP(2),
    alignSelf: 'center',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  loadingText: [
    textStyles.normalRegular,
    {
      color: 'white',
      alignContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      justifyContent: 'center',
    },
  ],
  errorText: [
    textStyles.bigRegular,
    {
      color: 'white',
      // marginTop: heightPercentageToDP(10),
      // position: 'absolute',
      alignContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      marginHorizontal: widthPercentageToDP(5),
    },
  ],
  moneyContainer: {
    width: widthPercentageToDP(60),
    height: heightPercentageToDP(23),
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    position: 'absolute',
    marginTop: heightPercentageToDP(20),
    borderRadius: 5,
  },
})
export { Purchases }

// {products &&
//   products
//     ?.sort((a, b) => a?.money - b?.money)
//     ?.map((item, index) => (
//       <TouchableOpacity onPress={() => buyMoney(item)} key={index}>
//         <View
//           style={{
//             width: widthPercentageToDP(90),
//             height: heightPercentageToDP(13),
//             backgroundColor: '#1F1C1B',
//             alignItems: 'center',
//             borderRadius: 10,
//             flexDirection: 'row',
//             marginBottom: heightPercentageToDP(2),
//           }}>
//           <Image
//             source={item?.image}
//             style={{
//               marginHorizontal: widthPercentageToDP(5),
//               width: widthPercentageToDP(17),
//               resizeMode: 'contain',
//             }}
//           />
//           <View>
//             <View
//               style={{
//                 flexDirection: 'row',
//                 justifyContent: 'space-between',
//                 width: widthPercentageToDP(60),
//               }}>
//               <Text style={styles.titleText}>$ {item?.money}</Text>
//               <Text style={styles.priceText}>{`${item?.currency}`}</Text>
//             </View>
//             <Text style={styles.explanationText}>
//               {'Your account balance \nwill be around'}
//               {portfolio_value === null ? (
//                 ' $0'
//               ) : (
//                 <Text style={styles.explanationTextBold}>
//                   {' $ '}
//                   {(
//                     parseFloat(portfolio_value?.split(',')?.join('')) +
//                     parseFloat(item?.money?.split(',')?.join(''))
//                   )
//                     ?.toFixed(0)
//                     ?.toString()
//                     ?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
//                      {/* <Text style={styles.explanationText}>{' Redvest game currency'}</Text> */}
//                 </Text>
//               )}
//             </Text>
//           </View>
//         </View>
//       </TouchableOpacity>
//     ))}
