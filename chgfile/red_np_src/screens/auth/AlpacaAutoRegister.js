import React, { useEffect, useState } from 'react'
import { View, Image, Text, ActivityIndicator } from 'react-native'
import { heightPercentageToDP, textStyles, widthPercentageToDP, colors } from '@utils'
import { InterstitialAd, TestIds, AdEventType } from 'react-native-google-mobile-ads'
import { NavigationService } from '@navigation'
import { CustomButton } from '@components'
import store, { alpacaAutoRegister } from '@store'
const hundredGif = require('@assets/images/onboarding/hundred.gif')

const AlpacaAutoRegister = ({ route }) => {
  const { username } = route?.params
  const [loaded, setLoaded] = useState(false)
  const adUnitID = Platform.select({
    ios: 'ca-app-pub-6423039727754608/8376987428',
    android: 'ca-app-pub-6423039727754608/2005104475',
  })
  const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : adUnitID
  const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
    requestNonPersonalizedAdsOnly: true,
    keywords: ['stock market', 'finance', 'stocks', 'money'],
  })

  // useEffect(() => {
  //   ;(async () => {
  //     try {
  //       const unsubscribe = interstitial.addAdEventsListener(({ type, payload }) => {
  //         if (type === AdEventType.LOADED) {
  //           interstitial.show({ immersiveModeEnabled: true })
  //           setLoaded(true)
  //         }
  //         if (type === AdEventType.ERROR) {
  //           console.log({ payload })
  //         }
  //         if (type === AdEventType.CLOSED) {
  //           setLoaded(false)
  //         }
  //       })
  //       interstitial.load()
  //       return unsubscribe
  //     } catch (error) {
  //       console.log('error ad=>', error)
  //       // setErrorMessage(error)
  //     }
  //     // }
  //   })()
  // }, [])

  const [successRegister, setSuccessRegister] = useState(false)
  const [errorButton, setErrorButton] = useState(false)
  const handleAuth = async () => {
    try {
      setErrorButton(false)
      setSuccessRegister(false)
      const autoAuth = await alpacaAutoRegister(store, username)
      if (autoAuth === true) {
        // profile()
        setSuccessRegister(true)
      }
    } catch (error) {
      setErrorButton(true)
    }
  }
  useEffect(() => {
    handleAuth()
  }, [])

  const profile = () => {
    NavigationService.navigate('BottomTabNavigator', {
      screen: 'Account',
      params: { screen: 'Profile' },
    })
  }

  return (
    <View
      backgroundColor={'#121212'}
      style={{ width: widthPercentageToDP(100), height: heightPercentageToDP(100) }}>
      {!successRegister && (
        <View style={{}}>
          {!loaded && (
            <View>
              <ActivityIndicator size="small" color={colors.primary2} />
            </View>
          )}
          <View
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              marginTop: heightPercentageToDP(80),
            }}>
            {errorButton == true && (
              <View style={{ alignItems: 'center' }}>
                <Text
                  style={[
                    textStyles.normalRegular,
                    { color: 'white', marginBottom: heightPercentageToDP(2) },
                  ]}>
                  Opps! 😅 A connection error occured. Please try again.
                </Text>
                <CustomButton
                  primary
                  text="Try Again"
                  onPress={() => {
                    handleAuth()
                  }}
                />
              </View>
            )}
          </View>
        </View>
      )}
      {successRegister && (
        <View style={{}}>
          <Image
            source={hundredGif}
            style={{
              alignContent: 'flex-start',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              alignSelf: 'flex-start',
              marginTop: heightPercentageToDP(10),
              width: widthPercentageToDP(100),
              height: heightPercentageToDP(65),
              resizeMode: 'contain',
            }}
          />
          <View
            style={{
              alignContent: 'center',
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
              marginTop: widthPercentageToDP(4),
            }}>
            <CustomButton primary text="Get Started" onPress={profile} />
          </View>
        </View>
      )}
    </View>
  )
}

export { AlpacaAutoRegister }
