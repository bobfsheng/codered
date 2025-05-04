import React, { memo, useEffect, useState } from 'react'
import { Image, Pressable, View, Text, StyleSheet } from 'react-native'
import { SkypeIndicator } from 'react-native-indicators'
import database from '@react-native-firebase/database'
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

const CustomUserStatusBar = memo(userInfo => {
  const data = userInfo
  const userEmoji = data.userInfo?.userEmoji
  const prevWeeklyRank = data.userInfo?.prevWeeklyRank
  const userName = data.userInfo?.userName
  const portfolioValue = data.userInfo?.portfolioYalue
  const weeklyRank = data.userInfo?.weeklyRank
  const { isLoggedIn } = useAuthSelector(state => state)
  const [isLoading, setIsLoading] = useState(false)

  // console.log( userName, weeklyRank, data.userInfo.userName)
  const formatValue = value => {
    if (!value) return
    return value
      ?.toFixed(2)
      ?.toString()
      ?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }
  useEffect(() => {
    ;(async () => {
      try {
        setIsLoading(true)

        setWeeklyRank(weeklyRank)
        if (weeklyRank === 1) {
          setWeeklyRank('1st')
        } else if (weeklyRank === 2) {
          setWeeklyRank('2nd')
        } else if (weeklyRank === 3) {
          setWeeklyRank('3rd')
        } else {
          setWeeklyRank(`${weeklyRank}th`)
        }
        setIsLoading(false)
      } catch (error) {
        setIsLoading(false)
      }
    })()
  }, [])

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
                    fontSize: actuatedNormalize(14),
                    color: 'white',
                    margin: widthPercentageToDP(0.5),
                    alignSelf: 'center',
                  }}>
                  {userEmoji == '' || userEmoji == undefined ? '🚀' : userEmoji}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.balanceContainer}>
            <View style={{ width: '100%' }}>
              <Text style={styles.balanceText}>
                {''}{' '}
                <Text
                  style={[styles.balanceText, { color: 'white', textAlign: 'center' }]}>
                  {userName == undefined ? '' : userName}
                  {/* {!isLoggedIn ? 'Join The Leaderboard 🏆' : ''} */}
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
                        portfolioValue?.toString()?.length > 10 ? 18 : 20,
                      ),
                    },
                  ]}>
                  {portfolioValue === 'NaN' || portfolioValue == undefined
                    ? ''
                    : `$ ${formatValue(parseFloat(portfolioValue))}`}
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
                        color:
                          prevWeeklyRank < parseFloat(weeklyRank)
                            ? colors.redError
                            : colors.primary2,
                        fontSize: actuatedNormalize(15),
                      },
                    ]}>
                    <Icon
                      type="AntDesign"
                      name={
                        prevWeeklyRank < parseFloat(weeklyRank)
                          ? 'downcircle'
                          : 'upcircle'
                      }
                      // name={position?.unrealized_pl < 0 ? 'downcircle' : 'upcircle'}
                      size={actuatedNormalize(14)}
                      // color={position?.unrealized_pl < 0 ? colors.red : colors.primary4}
                      color={
                        prevWeeklyRank < parseFloat(weeklyRank)
                          ? colors.redError
                          : colors.primary4
                      }
                    />{' '}
                    {weeklyRank == 'undefinedth' ? '' : weeklyRank}th
                    {'  '}
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
export { CustomUserStatusBar }
