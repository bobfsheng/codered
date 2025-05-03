import { useEffect, useCallback, useState } from 'react'
import { Linking, Platform } from 'react-native'
import {
  initConnection,
  endConnection,
  flushFailedPurchasesCachedAsPendingAndroid,
  purchaseErrorListener,
  getSubscriptions,
  requestSubscription,
  getAvailablePurchases,
  validateReceiptIos,
  clearProductsIOS,
  clearTransactionIOS,
} from 'react-native-iap'
import auth from '@react-native-firebase/auth'
import database from '@react-native-firebase/database'

const k20 = require('@assets/images/Purchases/1.png')
const k30 = require('@assets/images/Purchases/2.png')
const k50 = require('@assets/images/Purchases/3.png')
// const k100 = require('@assets/images/Purchases/4.png')
const k250 = require('@assets/images/Purchases/5.png')
// const k500 = require('@assets/images/Purchases/6.png')
const m1 = require('@assets/images/Purchases/7.png')

export const adFreeList = ['NoAds', 'NoAdsYearly']

const itunesConnectSharedSecret = '7fa979130c03453285f5cd43e595b97f'
import { userActions, useReduxDispatch } from '@store'
const plans = [
  { price: '1.99', level: 'Weekly', image: k250 },
  { price: '3.99', level: 'Monthly', image: k30 },
  { price: '9.99', level: 'Yearly', image: m1 },
  { price: '3.99', level: 'NoAds', image: k50 },
  { price: '12.99', level: 'NoAdsYearly', image: k20 },
]
const useIAPHook = () => {
  const dispatch = useReduxDispatch()

  const imagesArray = [k30, k250, m1, k50, k20]
  const [products, setProducts] = useState([])
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [subscriptionLoading, setsubscriptionLoading] = useState(false)
  const [subscriptionModal, setSubscriptionModal] = useState(false)
  const [subscriptionModalAds, setSubscriptionModalAds] = useState(false)
  const [subscriptionLoaded, setSubscriptionLoaded] = useState(false)
  const [isLoadingPay, setIsLoadingPay] = useState(false)
  const [isLoadingSub, setIsLoadingSub] = useState(false)

  const productSkus = Platform.select({
    ios: { skus: ['Weekly', 'Monthly', 'Yearly'] },
    android: {
      skus: ['week', 'month', 'year'],
    },
  })
  const getSubscriptionFromDb = async () => {
    try {
      const userId = await auth()?._user?.uid
      const currentSub = {}
      const getCurrentSubSnap = await database()
        .ref(`Subscriptions`)
        .orderByChild('userId')
        .equalTo(userId)
        .once('value')

      const subs = await getCurrentSubSnap.val()

      if (subs === null) {
        return {}
      }
      for (const [key, value] of Object.entries(subs)) {
        currentSub.key = key
        currentSub.originalTransactionIdentifierIOS =
          value.originalTransactionIdentifierIOS
        currentSub.transactionId = value.transactionId
        currentSub.productId = value.productId
        currentSub.userId = value.userId
        currentSub.transactionReceipt = value.transactionReceipt
      }
      if (
        currentSub?.transactionReceipt === null ||
        currentSub?.transactionReceipt === undefined
      ) {
        return {}
      }
      return currentSub
    } catch (error) {
      return {}
    }
  }
  const getSubscriptionsCallBack = useCallback(async () => {
    try {
      const availableSubscriptions = await getSubscriptions(productSkus)
      // console.log(Platform.OS, { availableSubscriptions })
      if (availableSubscriptions.length > 0) {
        if (Platform.OS === 'android') {
          const newProducts = availableSubscriptions.map((item, index) => {
            return {
              productId: item.productId,
              image: imagesArray[index],
              price:
                item.subscriptionOfferDetails[0].pricingPhases.pricingPhaseList[0]
                  .formattedPrice,
              currency:
                item.subscriptionOfferDetails[0].pricingPhases.pricingPhaseList[0]
                  .priceCurrencyCode,
              offerToken: item.subscriptionOfferDetails[0].offerToken,
            }
          })
          setProducts(newProducts)
        } else if (Platform.OS === 'ios') {
          const newProducts = []
          availableSubscriptions.forEach((item, index) => {
            plans.forEach(plan => {
              if (plan.level === item.productId) {
                const temp = {
                  productId: item.productId,
                  price: item.price,
                  image: imagesArray[index],
                  currency: item.localizedPrice,
                }
                newProducts.push(temp)
              }
            })
          })
          setProducts(newProducts)
        }
      }
    } catch (error) {
      console.log('error getSubscriptionsCallBack =>', error)
    }
  }, [])
  const handleSaveToDB = async subscription => {
    const currentSub = await getSubscriptionFromDb()
    const userId = await auth()?._user?.uid
    if (currentSub && currentSub.key) {
      await database().ref(`Subscriptions/${currentSub.key}`).set({
        originalTransactionIdentifierIOS: subscription?.originalTransactionIdentifierIOS,
        transactionId: subscription?.transactionId,
        productId: subscription?.productId,
        transactionReceipt: subscription?.transactionReceipt,
        userId,
      })
    } else {
      await database().ref(`Subscriptions/`).push({
        originalTransactionIdentifierIOS: subscription?.originalTransactionIdentifierIOS,
        transactionId: subscription?.transactionId,
        productId: subscription?.productId,
        transactionReceipt: subscription?.transactionReceipt,
        userId,
      })
    }
    const purchasedSub = await getActiveSubscriptionId()
    if (purchasedSub !== '') {
      dispatch(userActions.setSubscription({ subscription: purchasedSub }))
      setIsSubscribed(true)
    }
    dispatch(
      userActions.setSubscription({
        isSubscriptionLoaded: true,
        subFetchLoading: false,
      }),
    )
  }
  const handleCancelSubscription = () => {
    // anya cancel subscription
    if (Platform.OS === 'ios') {
      Linking.openURL('https://apps.apple.com/account/subscriptions')
    } else if (Platform.OS === 'android') {
      // change YOUR_PACKAGE_NAME and YOUR_PRODUCT_ID in the link below
      // Linking.openURL(
      //   'https://play.google.com/store/account/subscriptions?package=YOUR_PACKAGE_NAME&sku=YOUR_PRODUCT_ID',
      // );
    }
  }
  const getActiveSubscriptionId = async () => {
    const currentSub = await getSubscriptionFromDb()
    if (Platform.OS === 'ios') {
      const latestAvailableReceipt = currentSub?.transactionReceipt
      const isTestEnvironment = __DEV__
      const decodedReceipt = await validateReceiptIos({
        receiptBody: {
          'receipt-data': latestAvailableReceipt,
          password: itunesConnectSharedSecret,
        },
        isTest: isTestEnvironment,
      })
      if (decodedReceipt) {
        const { latest_receipt_info: latestReceipts } = decodedReceipt
        const latestReceiptInfo = latestReceipts && latestReceipts[0]
        const expirationInMilliseconds = Number(latestReceiptInfo?.expires_date_ms)
        const nowInMilliseconds = Date.now()
        if (expirationInMilliseconds > nowInMilliseconds) {
          return latestReceiptInfo.product_id
        }
      }
      return ''
    }
    if (Platform.OS === 'android') {
      const availablePurchases = await getAvailablePurchases()
      for (let i = 0; i < availablePurchases.length; i++) {
        if (subSkus.includes(availablePurchases[i].productId)) {
          return availablePurchases[i].productId
        }
      }
      return ''
    }
  }
  const handlePurchase = async sku => {
    const { productId, offerToken } = sku

    try {
      let subscriptionData = {}
      if (Platform.OS === 'android') {
        subscriptionData = {
          sku: productId,
          ...(offerToken && {
            subscriptionOffers: [{ sku: productId, offerToken }],
          }),
        }
      } else if (Platform.OS === 'ios') {
        subscriptionData = {
          sku: sku.productId,
          andDangerouslyFinishTransactionAutomatically: true,
        }
      }
      // console.log({ subscriptionData })
      setIsLoadingSub(true)
      const purchaseResp = await requestSubscription(subscriptionData)
      // console.log({ purchaseResp })
      const receipt = purchaseResp.transactionReceipt
      if (receipt) {
        setSubscriptionModalAds(false)
        await handleSaveToDB(purchaseResp)
      }
      setIsLoadingSub(false)
      setSubscriptionModal(false)
      setIsLoadingPay(false)
    } catch (error) {
      console.log('error handlePurchase =>', error)
      setIsLoadingPay(false)
      setIsLoadingSub(false)
    }
  }
  const initialLoad = async () => {
    dispatch(
      userActions.setSubscription({
        subscription: '',
        isSubscriptionLoaded: false,
        subFetchLoading: true,
      }),
    )
    try {
      if (Platform.OS === 'ios') {
        await clearProductsIOS()
        await clearTransactionIOS()
      }
      if (Platform.OS === 'android') {
        try {
          await flushFailedPurchasesCachedAsPendingAndroid()
        } catch (err) {
          console.log('flushFailedPurchasesCachedAsPendingAndroid', err)
        }
      }
      const purchasedSub = await getActiveSubscriptionId()
      if (purchasedSub !== '') {
        dispatch(userActions.setSubscription({ subscription: purchasedSub }))
        setIsSubscribed(true)
      }
      dispatch(
        userActions.setSubscription({
          isSubscriptionLoaded: true,
          subFetchLoading: false,
        }),
      )

      //
    } catch (error) {
      console.log('error IAP=>', error)
      dispatch(
        userActions.setSubscription({
          subscription: '',
          isSubscriptionLoaded: true,
          subFetchLoading: false,
        }),
      )
    }
  }
  useEffect(() => {
    ;(async () => {
      await initConnection()
    })()
    let purchaseUpdateSubscription = null
    let purchaseErrorSubscription = null
    purchaseErrorSubscription = purchaseErrorListener(error => {
      console.warn('purchaseErrorListener', error)
      setIsLoadingPay(false)
      setIsLoadingSub(false)
    })
    getSubscriptionsCallBack()
    return () => {
      if (purchaseUpdateSubscription) {
        purchaseUpdateSubscription.remove()
      }
      if (purchaseErrorSubscription) {
        purchaseErrorSubscription.remove()
      }
      endConnection()
    }
  }, [])
  return {
    subscriptionLoading,
    isSubscribed,
    products,
    isLoadingPay,
    subscriptionModal,
    isLoadingSub,
    subscriptionModalAds,
    subscriptionLoaded,
    handlePurchase,
    setSubscriptionModal,
    setSubscriptionModalAds,
    initialLoad,
    handleCancelSubscription,
  }
}
export default useIAPHook
