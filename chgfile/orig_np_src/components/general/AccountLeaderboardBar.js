import React, { memo, useEffect, useState } from 'react'
import { Pressable, View, Text, StyleSheet } from 'react-native'
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

const AccountLeaderboardBar = memo(() => {
  const { userName, userEmoji, isLoggedIn, weeklyRank } = useAuthSelector(state => state)
  const { userId } = useAuthSelector(state => state)
  const [isLoading, setIsLoading] = useState(false)
  const [portfolioValue, setPortfolioValue] = useState('0')
  const [rankMovement, setRankMovement] = useState('0')
  const [finalRank , setFinalRank] = useState(weeklyRank ?? 173597)
  const formatValue = value => {
    if (!value) return
    return value
      ?.toFixed(0)
      ?.toString()
      ?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  useEffect(() => {
    ;(async () => {
      try {
        setIsLoading(true)
        const snapshot = await firestore().collection('User').doc(userId).get()
        const userData = snapshot.data()
        const { portfolioYalue,  prevWeeklyRank } = userData
        setRankMovement(prevWeeklyRank > prevWeeklyRank ? 'down' : 'up')
        setPortfolioValue(parseFloat(portfolioYalue).toFixed(2).toString())
        setFinalRank(weeklyRank)
        if (weeklyRank === 1) {
          setFinalRank('1st')
        } else if (weeklyRank === 2) {
          setFinalRank('2nd')
        } else if (weeklyRank === 3) {
          setFinalRank('3rd')
        } else {
          setFinalRank(`${weeklyRank}th`)
        }
        setIsLoading(false)
      } catch (error) {
        setIsLoading(false)
      }
    })()
  }, [userId])

  const min = 170000
  const max = 270000
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min
  

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
                      fontSize: actuatedNormalize(
                        portfolioValue?.toString()?.length > 10
                          ? 18
                          : !isLoggedIn
                          ? 14
                          : 20,
                      ),
                    },
                  ]}>
                  {portfolioValue === 'NaN' ||
                  formatValue(parseFloat(portfolioValue)) === undefined
                    ? ''
                    : `$ ${formatValue(parseFloat(portfolioValue))}`}
                  {!isLoggedIn && !userName ? 'Join The Leaderboard 🏆' : ''}
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
                        color: rankMovement == 'down' ? colors.redError : colors.primary2,
                        fontSize: actuatedNormalize(15),
                      },
                    ]}>
                    {isLoggedIn && (
                      <Icon
                        type="AntDesign"
                        // name={  'upcircle'}
                        name={rankMovement == 'down' ? 'downcircle' : 'upcircle'}
                        // name={position?.unrealized_pl < 0 ? 'downcircle' : 'upcircle'}
                        size={actuatedNormalize(14)}
                        // color={colors.primary4}
                        color={rankMovement == 'down' ? colors.redError : colors.primary4}
                      />
                    )}{' '}
                    {isLoggedIn && weeklyRank == undefined ? formatValue(randomNumber) +'th' : `${finalRank}   `}
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
export { AccountLeaderboardBar }
