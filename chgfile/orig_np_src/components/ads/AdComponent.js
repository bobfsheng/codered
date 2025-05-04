import React, { memo, useState } from 'react'
import { View, Platform } from 'react-native'
import {
  AppOpenAd,
  TestIds,
  BannerAd,
  BannerAdSize,
  InterstitialAd,
  AdEventType,
} from 'react-native-google-mobile-ads'

const AdComponent = memo(({}) => {
  const adUnitID = Platform.select({
    // ios: 'ca-app-pub-6423039727754608/1048994534',
    ios: 'ca-app-pub-6423039727754608/1006797704',
    // android: 'ca-app-pub-6423039727754608/4539544763',
    android: 'ca-app-pub-6423039727754608/4942173285',
  })
  const adUnitId = __DEV__ ? TestIds.BANNER : adUnitID
  const appOpenAd = AppOpenAd.createForAdRequest(adUnitId, {
    requestNonPersonalizedAdsOnly: true,
    keywords: ['stock market', 'finance', 'stocks', 'money'],
  })
  AppOpenAd.createForAdRequest(TestIds.APP_OPEN)

  const [loaded, setLoaded] = useState(false)
  const adUnitIDInterstitial = Platform.select({
    ios: 'ca-app-pub-6423039727754608/1108049995',
    android: 'ca-app-pub-6423039727754608/8432006241',
  })
  const adUnitIdInterstitial = __DEV__ ? TestIds.INTERSTITIAL : adUnitIDInterstitial
  const interstitial = InterstitialAd.createForAdRequest(adUnitIdInterstitial, {
    requestNonPersonalizedAdsOnly: true,
    keywords: ['stock market', 'finance', 'stocks', 'money'],
  })

  const loadAd = async () => {
    try {
      const unsubscribe = interstitial.addAdEventsListener(({ type, payload }) => {
        if (type === AdEventType.LOADED) {
          interstitial.show({ immersiveModeEnabled: true })
          setLoaded(true)
        }
        if (type === AdEventType.ERROR) {
          console.log({ payload })
          // null
        }
        if (type === AdEventType.CLOSED) {
          setLoaded(false)
        }
      })
      interstitial.load()
      return unsubscribe
    } catch (error) {
      console.log('error ad=>', error)
      // setErrorMessage(error)
    }
  }

  return (
    <View style={{ alignItems: 'center' }}>
      {/* <BannerAd
        unitId={adUnitId}
        // unitId={TestIds.BANNER}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        // requestOptions={{
        //   requestNonPersonalizedAdsOnly: true,
        // }}
      /> */}
    </View>
  )
})

export { AdComponent }
