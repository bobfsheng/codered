import React, { memo, useEffect, useState } from 'react'
import { Pressable, View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import { SkypeIndicator } from 'react-native-indicators'
import firestore from '@react-native-firebase/firestore'
import {
  actuatedNormalize,
  colors,
  heightPercentageToDP,
  textStyles,
  widthPercentageToDP,
} from '@utils'
import { NavigationService } from '@navigation'
import { Icon } from '@components'
import { useAuthSelector } from '@store'
import { TouchableOpacity } from 'react-native-gesture-handler'
const hrocket = require('@assets/images/HomeScreen/homerocket.png')

const GameLeaderboardBar = memo(({ rank, score }) => {
  const { userName, userEmoji } = useAuthSelector(state => state)
  const [isLoading, setIsLoading] = useState(false)

  const formatValue = value => {
    if (!value) return
    return value
      ?.toFixed(0)
      ?.toString()
      ?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

const formatRank = rank => {
  if (rank === undefined) {
    return 'undefined'
  } else {
    const lastDigit = rank % 10
    const secondLastDigit = Math.floor((rank % 100) / 10)
    if (lastDigit === 1 && secondLastDigit !== 1) {
      return `${rank}st`
    } else if (lastDigit === 2 && secondLastDigit !== 1) {
      return `${rank}nd`
    } else if (lastDigit === 3 && secondLastDigit !== 1) {
      return `${rank}rd`
    } else {
      return `${rank}th`
    }
  }
}


  return (
    <View style={styles.mainContainer}>
      <Pressable
        onPress={() => NavigationService.navigate('Account', { screen: 'Profile' })}>
        <View style={styles.subContainer}>
          <View style={styles.imageContainer}>
            <TouchableOpacity
              onPress={() =>
                NavigationService.navigate('Account', { screen: 'EmojiSelectorScreen' })
              }>
              {userEmoji?.length < 1 ? (
                <View
                  style={{
                    marginHorizontal: widthPercentageToDP(3),
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignContent: 'center',
                    backgroundColor: '#B2D0CE',
                    width: widthPercentageToDP(11),
                    height: widthPercentageToDP(11),
                    borderRadius: widthPercentageToDP(3),
                  }}>
                  <Text
                    style={{
                      fontSize: actuatedNormalize(26),
                      color: 'white',
                      margin: widthPercentageToDP(0.5),
                      alignSelf: 'center',
                    }}>
                    😎
                  </Text>
                </View>
              ) : (
                <View
                  style={{
                    marginHorizontal: widthPercentageToDP(3),
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignContent: 'center',
                    backgroundColor: '#B2D0CE',
                    width: widthPercentageToDP(11),
                    height: widthPercentageToDP(11),
                    borderRadius: widthPercentageToDP(3),
                  }}>
                  <Text
                    style={{
                      fontSize: actuatedNormalize(26),
                      color: 'white',
                      margin: widthPercentageToDP(0.5),
                      alignSelf: 'center',
                    }}>
                    {userEmoji}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.balanceContainer}>
            <View style={{ width: '100%' }}>
              <Text style={styles.balanceText}>
                {'You   '}{' '}
                <Text
                  style={[styles.balanceText, { color: 'white', textAlign: 'center' }]}>
                  {userName?.toUpperCase()}
                </Text>
              </Text>
            </View>
            <View style={{ width: '100%' }}>
              {isLoading ? (
                <Text style={styles.balanceText}>{'Loading your account😉'}</Text>
              ) : (
                <Text
                  style={[
                    styles.balanceNumber,
                    {
                      fontSize: actuatedNormalize(18),
                    },
                  ]}>
                  {formatValue(parseFloat(score))} points
                </Text>
              )}
            </View>
          </View>
          <View style={styles.percentContainer}>
            <View style={{ width: '100%' }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  height: '100%',
                }}>
                {isLoading ? (
                  <SkypeIndicator color="white" />
                ) : (
                  <Text
                    style={[
                      textStyles.bigBold,
                      {
                        color: colors.primary2,
                        fontSize: actuatedNormalize(15),
                      },
                    ]}>
                    {rank === null ? (
                        <ActivityIndicator color="white" style={{marginRight:widthPercentageToDP(10)}} />
                    ) : (
                      `${formatRank(rank)}    `
                    )}
                  </Text>
                )}
              </View>
            </View>
          </View>
        </View>
      </Pressable>
    </View>
  )
})

const styles = StyleSheet.create({
  mainContainer: {
    width: widthPercentageToDP(85),
    height: heightPercentageToDP(10),
    marginTop: heightPercentageToDP(2),
    backgroundColor: colors.mediumDarkBackground,
    borderRadius: heightPercentageToDP(1),
    marginBottom: heightPercentageToDP(1),
    alignSelf: 'center',
    overflow: 'hidden',
    paddingRight: widthPercentageToDP(2),
  },
  subContainer: {
    flexDirection: 'row',
    height: '100%',
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    resizeMode: 'contain',
    width: widthPercentageToDP(10),
    height: widthPercentageToDP(10),
    marginHorizontal: widthPercentageToDP(3),
  },
  balanceContainer: {
    flex: 1,
    maxWidth: widthPercentageToDP(60),

    justifyContent: 'center',
    alignItems: 'center',
  },
  balanceText: [
    textStyles.bigSemiBold,
    {
      color: 'gray',
      fontSize: actuatedNormalize(13),
    },
  ],
  balanceNumber: [
    textStyles.bigBold,
    {
      color: 'white',
    },
  ],
  percentContainer: {
    maxWidth: widthPercentageToDP(30),
    height: '100%',
  },
})
export { GameLeaderboardBar }
