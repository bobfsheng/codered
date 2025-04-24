import React, { memo, useEffect, useState } from 'react'
import { Pressable, StyleSheet, View, Text, Share } from 'react-native'
import { Icon } from '@components'
import {
  colors,
  heightPercentageToDP,
  widthPercentageToDP,
  textStyles,
  actuatedNormalize,
} from '@utils'
import database from '@react-native-firebase/database'
import firestore from '@react-native-firebase/firestore'
import { NavigationService } from '@navigation'
import { useAuthSelector } from '@store'
import LinearGradient from 'react-native-linear-gradient'
import { CustomExploreMiniChart } from '@components'
import dynamicLinks from '@react-native-firebase/dynamic-links'

const CustomWatchlist = memo(({ position }) => {
  const [watchlistArrayFromFB, setWatchlistArrayFromFB] = useState([])

  useEffect(() => {
    if (userId) {
      const ref = database().ref(`/User/${userId}`)
      ref.child('Watchlist').on('value', snapshot => {
        const watchlist = snapshot.val()
        if (watchlist) {
          const watchlistArray = Object.values(watchlist)
          setWatchlistArrayFromFB(watchlistArray)
        } else {
          setWatchlistArrayFromFB([])
        }
      })
    }
  }, [])

  const removeFromWatchlist = async position => {
    const ref = database().ref('User')
    const watchlistArray = watchlistArrayFromFB.filter(watch => watch != position)

    ref.child(`/${userId}/Watchlist`).set(watchlistArray)
    await firestore().collection('User').doc(userId).update({
      Watchlist: watchlistArray,
    })
    setWatchlistArrayFromFB(watchlistArray)
  }
  const { userId } = useAuthSelector(state => state)

  const handleShareStock = async position => {
    try {
      const linkUrl = `https://redvest.app?stockticker=${position.stockTicker}&apn=app.redvest&isi=1609301338&ibi=com.redko.redvest`

      const link = await dynamicLinks().buildShortLink(
        {
          link: linkUrl,
          domainUriPrefix: 'https://redvest.page.link',
          android: {
            packageName: 'com.redko.redvest',
          },
        },
        dynamicLinks.ShortLinkType.SHORT,
      )
      const result = await Share.share({
        message: `If you bought $1000 of ${
          position?.stockTicker
        } stock a year ago, you would have ${
          position?.closePrice - position?.closePrice12 < 0 ? 'lost' : 'made'
        } $${((1000 / position?.closePrice12)?.toFixed(0) * position?.closePrice - 1000)
          ?.toFixed(0)
          ?.replace('-', '')}.The last close price was ${
          position?.closePrice
        } per share! ${link}`,
      })
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      console.log('error =>', error)
    }
  }

  return (
    <Pressable>
      <LinearGradient
        colors={[colors.offWhite, colors.offWhite]}
        style={[styles.positionCard]}>
        <View
          style={{
            marginTop: heightPercentageToDP(1),
            flexDirection: 'column',
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
            }}>
            <Icon
              type="Ionicons"
              name="checkmark-circle-sharp"
              size={20}
              color="black"
              onPress={() => removeFromWatchlist(position?.stockTicker)}
            />

            <Icon
              type="Feather"
              name="share"
              size={20}
              color="black"
              onPress={() => handleShareStock(position)}
              style={{ marginLeft: widthPercentageToDP(2) }}
            />
          </View>
          <View style={{ flexDirection: 'column' }}>
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}>
              <Pressable
                onPress={() =>
                  NavigationService.navigate('Explore', {
                    screen: 'ExploreScreen',
                    params: { stockTicker: position?.stockTicker },
                  })
                }>
                <Text
                  style={[
                    textStyles.normalSemiBold,
                    { color: 'black', fontSize: actuatedNormalize(17) },
                  ]}>
                  {position?.stockTicker}
                </Text>
              </Pressable>
              <Text
                style={[
                  textStyles.normalSemiBold,
                  {
                    // color:
                    //   position?.closePrice - position?.closePrice12 < 0
                    //     ? '#EB5757'
                    //     : '#6CAE00',
                    color: 'black',
                    fontSize: actuatedNormalize(15),
                    marginRight: widthPercentageToDP(2),
                  },
                ]}>
                {'$'}
                {position?.closePrice && parseFloat(position?.closePrice)?.toFixed(2)}
              </Text>
            </View>
            <CustomExploreMiniChart
              stockTicker={position?.stockTicker}
              selectedFinalStock={position?.stockTicker}
              explore={false}
            />
            {/* <View style={{ flexDirection: 'row' }}>
              <Text
                numberOfLines={4}
                style={[
                  textStyles.normalRegular,
                  {
                    color: 'white',
                    width: widthPercentageToDP(30),
                    marginTop: heightPercentageToDP(3),
                    fontSize: actuatedNormalize(7.5),
                  },
                ]}>
                If you invested $ 1000 a year ago you would make
              </Text>
              <Text
                style={[
                  textStyles.normalBold,
                  {
                    color:
                      position?.closePrice - position?.closePrice12 < 0
                        ? '#EB5757'
                        : '#6CAE00',
                    fontSize: actuatedNormalize(11),
                    marginTop: heightPercentageToDP(6),
                    marginLeft: widthPercentageToDP(-20),
                  },
                ]}>
                {' '}
                ${' '}
                {!isNaN(position?.closePrice12) &&
                  (
                    (1000 / position?.closePrice12)?.toFixed(0) * position?.closePrice -
                    1000
                  )?.toFixed(0)}
              </Text>
            </View> */}
          </View>
        </View>
      </LinearGradient>
    </Pressable>
  )
})
const styles = StyleSheet.create({
  positionCard: {
    paddingHorizontal: widthPercentageToDP(2),
    // width: widthPercentageToDP(35),
    marginLeft: widthPercentageToDP(2),
    borderRadius: heightPercentageToDP(1.3),
    // borderWidth: widthPercentageToDP(0.7),
    marginHorizontal: widthPercentageToDP(1.5),
    // borderColor: colors.primary,
    paddingBottom: heightPercentageToDP(1),
  },
  symbol: [
    textStyles.normalSemiBold,
    {
      color: 'black',
      fontSize: actuatedNormalize(17),
      marginTop: heightPercentageToDP(1),
    },
  ],
  priceText: [
    textStyles.normalSemiBold,
    {
      color: '#242424',
      marginTop: heightPercentageToDP(1.5),
      marginRight: widthPercentageToDP(2),
    },
  ],
  priceValue: [
    textStyles.normalSemiBold,
    {
      color: 'white',
    },
  ],
  plText: [
    textStyles.normalSemiBold,
    {
      color: colors.lightDarkBackground,
      marginTop: heightPercentageToDP(1.5),
      fontSize: actuatedNormalize(10),
    },
  ],
  finalPriceValue: [
    textStyles.normalSemiBold,
    {
      color: 'white',
      marginRight: widthPercentageToDP(2),
    },
  ],
})
export { CustomWatchlist }
