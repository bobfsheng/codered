import React, { useCallback, useEffect, useState } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import messaging from '@react-native-firebase/messaging'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import dynamicLinks from '@react-native-firebase/dynamic-links'
import FirebaseChat from '@redkoteam/firebase-chat'
import SplashScreen from 'react-native-splash-screen'
import { AuthStackNavigator } from './stacks'
import { BottomTabNavigator } from './tab/BottomTabNavigator'
import {
  authActions,
  getCurrentSubscription,
  useAuthSelector,
  userActions,
  useReduxDispatch,
  useUserSelector,
} from '@store'
import NavigationService from './NavigationService'
import { AlpacaAutoRegister } from '@screens'
import { localGetItem, localSaveItem, PushNotificationHandler, StorageKeys } from '@utils'
import {
  CustomLoader,
  DailyProfileModal,
  InfoBottomSheet,
  OrderFilledModal,
} from '@components'
import { fcmTokenToDB, fcmTokenToRedux } from './hooks'
import { useNotification } from '../hooks/homescreen/useNotification'

const Stack = createStackNavigator()
const Root = () => {
  const dispatch = useReduxDispatch()
  const { loading: authLoading, alpacaToken, userId } = useAuthSelector(state => state)
  const {
    loading: userLoading,
    dailyProfile,
    orderFilled,
    information,
  } = useUserSelector(state => state)
  fcmTokenToRedux() // to save fcm token into redux
  fcmTokenToDB() // to save fcm token into database
  const { getInitNotifications } = useNotification()
  const [tokenLoading, setTokenLoading] = useState(false)
  const onAuthStateChanged = useCallback(async user => {
    if (user !== null) {
      const { creationTime } = user?.metadata
      if (
        Math.abs((new Date(creationTime).valueOf() - new Date().valueOf()) / 1000) < 10
      ) {
        const localToken = await localGetItem(StorageKeys.alpacaToken)
        const userDoc = await firestore().collection('User').doc(user?.uid).get()
        const userData = userDoc.data()
        if (!localToken) {
          setTokenLoading(true)
          if (userData?.token) {
            await localSaveItem(StorageKeys.alpacaToken, userData?.token)
            dispatch(authActions.setAlpaceToken({ alpacaToken: userData?.token }))
          }
        } else {
          dispatch(authActions.setAlpaceToken({ alpacaToken: localToken }))
        }
        dispatch(
          authActions.setAuth({
            userId: user.uid,
            email: user.email,
            userName: userData.userName,
            userEmoji: userData.userEmoji,
            weeklyRank: userData.weeklyRank,
            userBio: userData.userBio,
            redCoins: userData.redCoins,
            userLevel: userData?.userLevel,
            userSwipe: userData?.userSwipe,
            isLoggedIn: true,
          }),
        ),
          setTokenLoading(false)

        if (FirebaseChat.isInitialized) {
          FirebaseChat.setUser(user.uid)
        }
        NavigationService.reset([
          {
            name: 'BottomTabNavigator',
            params: {
              screen: 'Account',
            },
          },
        ])
        return
      }

      const localToken = await localGetItem(StorageKeys.alpacaToken)
      const userDoc = await firestore().collection('User').doc(user?.uid).get()
      const userData = userDoc.data()
      if (!localToken) {
        setTokenLoading(true)
        if (userData?.token) {
          await localSaveItem(StorageKeys.alpacaToken, userData?.token)
          dispatch(authActions.setAlpaceToken({ alpacaToken: userData?.token }))
        }
      } else {
        dispatch(authActions.setAlpaceToken({ alpacaToken: localToken }))
      }

      if (FirebaseChat.isInitialized) {
        FirebaseChat.setUser(user.uid)
      }
      dispatch(
        authActions.setAuth({
          userId: user.uid,
          email: user.email,
          userName: userData.userName,
          userEmoji: userData.userEmoji,
          weeklyRank: userData?.weeklyRank,
          userBio: userData.userBio,
          userLevel: userData?.userLevel,
          userSwipe: userData?.userSwipe,
          redCoins: userData.redCoins,
          isLoggedIn: true,
        }),
      ),
        setTokenLoading(false)
      return
    } else {
      dispatch(
        authActions.setAuth({
          userId: '',
          email: '',
          userName: '',
          userEmoji: '',
          isLoggedIn: false,
          weeklyRank: '',
          userBio: '',
        }),
      )
    }
  }, [])
  const handleDynamicLink = async link => {
    // console.log('Received Link:', link?.url)

    // If there's no link or no URL, exit
    if (!link?.url) {
      // console.log('No link detected.')
      return
    }

    // Check for stockticker
    if (link.url.includes('https://www.redvest.app?stockticker')) {
      // console.log('Stockticker detected.')
      const re = new RegExp('.*[?&]stockticker=([^&]+)(&|$)')
      const match = link.url.match(re)
      const stockTicker = match[1]
      if (stockTicker === 'null') {
        if (link.url.includes('leaderboard')) {
          // console.log('Navigating to leaderboard.')
          NavigationService.navigate('Home', {
            screen: 'Leaderboard',
            params: {},
          })
        } else {
          // console.log('Navigating to ExploreSelectTicker.')
          NavigationService.navigate('Explore', {
            screen: 'ExploreSelectTicker',
            params: {},
          })
        }
      } else {
        // console.log('Navigating to ExploreScreen with stockTicker:', stockTicker)
        NavigationService.navigate('Explore', {
          screen: 'ExploreScreen',
          params: {
            stockTicker,
          },
        })
      }
    }
    // Check for userId and navigate to Account screen
    else if (link.url.includes('userId')) {
      // console.log('UserId detected.')
      const re = new RegExp('.*[?&]userId=([^&]+)(&|$)')
      const match = link.url.match(re)
      const userId = match[1]
      const userDoc = await firestore().collection('User').doc(userId).get()
      // console.log('Navigating to ProfileUser with user info:', userDoc.data())
      NavigationService.navigate('Account', {
        screen: 'ProfileUser',
        params: { userInfo: userDoc.data() },
      })
    }
    // Check for gamingTab
    else if (link.url.includes('gamingTab')) {
      // console.log('GamingTab detected. Navigating to Compete.')
      NavigationService.navigate('Games', {
        screen: 'Compete',
      })
    }
    // Check for referrerId and navigate to SignUp screen
    else if (link.url.includes('referrerId')) {
      // console.log('ReferrerId detected.')
      const re = new RegExp('.*[?&]referrerId=([^&]+)(&|$)')
      const match = link.url.match(re)
      const referrerId = match[1]

      // Ensure referrerId is not empty
      if (referrerId) {
        // console.log('Navigating to SignUpScreen with referrerId:', referrerId)
        NavigationService.navigate('Account', {
          screen: 'SignUpScreen',
          params: { referrerId: referrerId },
        })
      } else {
        // console.log('ReferrerId is empty. Not navigating.')
        return
      }
    }
  }
  useEffect(() => {
    if (userId) {
      dispatch(getCurrentSubscription(userId))
      getInitNotifications()
    }
  }, [userId])
  useEffect(() => {
    if (!FirebaseChat.isInitialized) {
      FirebaseChat.initialize()
    }
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged)
    return subscriber // unsubscribe on unmount
  }, [alpacaToken])
  useEffect(() => {
    ;(async () => {
      const storageDataOnboardingGame = await localGetItem(
        StorageKeys.onboardingGameShown,
      )
      const storageDataTooltip1 = await localGetItem(StorageKeys.toolTipShown1)
      const storageDataTooltip2 = await localGetItem(StorageKeys.toolTipShown2)
      const storageDataTooltip3 = await localGetItem(StorageKeys.toolTipShown3)
      const storageDataTooltip4 = await localGetItem(StorageKeys.toolTipShown4)
      const storageDataTooltip5 = await localGetItem(StorageKeys.toolTipShown5)
      const storageDataTooltip6 = await localGetItem(StorageKeys.toolTipShown6)
      const storageDataTooltip7 = await localGetItem(StorageKeys.toolTipShown7)
      const storageDataTooltip8 = await localGetItem(StorageKeys.toolTipShown8)
      if (storageDataOnboardingGame == 'true') {
        dispatch(userActions.setOnboardingGame({ onboardingGame: true }))
      }
      if (storageDataTooltip1 == 'true') {
        dispatch(userActions.setToolTip1({ toolTip1: true }))
      }
      if (storageDataTooltip2 == 'true') {
        dispatch(userActions.setToolTip2({ toolTip2: true }))
      }
      if (storageDataTooltip3 == 'true') {
        dispatch(userActions.setToolTip3({ toolTip3: true }))
      }
      if (storageDataTooltip4 == 'true') {
        dispatch(userActions.setToolTip4({ toolTip4: true }))
      }
      if (storageDataTooltip5 == 'true') {
        dispatch(userActions.setToolTip5({ toolTip5: true }))
      }
      if (storageDataTooltip6 == 'true') {
        dispatch(userActions.setToolTip6({ toolTip6: true }))
      }
      if (storageDataTooltip7 == 'true') {
        dispatch(userActions.setToolTip7({ toolTip7: true }))
      }
      if (storageDataTooltip8 == 'true') {
        dispatch(userActions.setToolTip8({ toolTip8: true }))
      }
      // if (quizLevel) {
      //   dispatch(userActions.setQuizLevel({ quizLevel }))
      // }
      setTimeout(() => {
        SplashScreen.hide()
      }, 2000)
    })()
  }, [])
  useEffect(() => {
    //for background
    dynamicLinks()
      .getInitialLink()
      .then(link => {
        handleDynamicLink(link)
      })
    //for foreground
    const unsubscribe = dynamicLinks().onLink(handleDynamicLink)
    return () => unsubscribe()
  }, [])
  useEffect(() => {
    if (!userId) {
      return
    }
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      if (remoteMessage.notification.title === 'New Message') {
        dispatch(
          userActions.setHaveNewMessage({
            check: true,
          }),
        )
      } else {
        dispatch(
          userActions.setHaveNewNotification({
            check: true,
          }),
        )
      }
    })
    messaging().onNotificationOpenedApp(remoteMessage => {
      // getInitNotifications()
      if (remoteMessage.notification.title === 'New Message') {
        NavigationService.navigate('Home', { screen: 'Messages' })
      } else {
        NavigationService.navigate('Home', { screen: 'Notifications' })
      }
    })
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          const state = 'quit'
          PushNotificationHandler(remoteMessage, state, dispatch)
        }
      })
    return unsubscribe
  }, [userId])

  return (
    <>
      <Stack.Navigator
        initialRouteName="BottomTabNavigator"
        screenOptions={{ headerShown: false }}>
        <Stack.Screen name="BottomTabNavigator" component={BottomTabNavigator} />
        <Stack.Screen name="AuthStackNavigator" component={AuthStackNavigator} />
        <Stack.Screen name="AlpacaAutoRegister" component={AlpacaAutoRegister} />
      </Stack.Navigator>
      {(authLoading || userLoading || tokenLoading) && <CustomLoader loading={true} />}
      {dailyProfile && (
        <DailyProfileModal
          visible={!!dailyProfile}
          handleCloseModal={() => {
            dispatch(userActions.setDailyProfile({ amount: '' }))
          }}
        />
      )}
      {orderFilled?.uid && (
        <OrderFilledModal
          visible={!!orderFilled?.uid}
          handleCloseModal={() => {
            dispatch(
              userActions.setOrderFilled({
                status: '',
                side: '',
                qty: '',
                symbol: '',
                updated_at: '',
                uid: '',
              }),
            )
          }}
        />
      )}
      {information.info && <InfoBottomSheet />}
    </>
  )
}
export default Root
