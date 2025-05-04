import React, { useRef, useEffect, useState, memo } from 'react'
import { Text, Animated, Easing, View } from 'react-native'
import {
  textStyles,
  actuatedNormalize,
  widthPercentageToDP,
  heightPercentageToDP,
  colors,
} from '@utils'
import { NavigationService, Root } from '@navigation'
import LinearGradient from 'react-native-linear-gradient'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useSPYData, useCustomAccountData, useCryptoData, useInviteFriend } from '@hooks'
import { useAuthSelector } from '@store'

const CustomHomeButton = memo(
  ({
    category,
    weeklyRank,
    emoji,
    gradientColors,
    index,
    screen,
    component,
    button,
    title,
    info,
    level,
    levelGame,
    isLoggedIn,
    onPressLoggedOut,
  }) => {
    const { userId } = useAuthSelector(state => state)
    const { onShare } = useInviteFriend(userId)
    const scaleAnimation = useRef(new Animated.Value(1)).current
    const opacityAnimation = useRef(new Animated.Value(0.5)).current
    const translateXAnimation = useRef(
      new Animated.Value(-widthPercentageToDP(27)),
    ).current

    const animateRipple = React.useCallback(() => {
      // Opacity animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(opacityAnimation, {
            toValue: 0.7,
            duration: 300,
            useNativeDriver: true, // Use native driver for better performance
          }),
          Animated.timing(opacityAnimation, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
      ).start()

      // Scale animation
      Animated.loop(
        Animated.sequence([
          Animated.spring(scaleAnimation, {
            toValue: 1.2,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnimation, {
            toValue: 1,
            useNativeDriver: true,
          }),
        ]),
      ).start()

      // Translation animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(translateXAnimation, {
            toValue: widthPercentageToDP(154),
            duration: 3500,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.delay(1000),
          Animated.timing(translateXAnimation, {
            toValue: -widthPercentageToDP(27),
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ).start()
    }, [opacityAnimation, scaleAnimation, translateXAnimation])

    useEffect(() => {
      const baseDelay = 500
      const delay = baseDelay * (index + 1)
      const timeout = setTimeout(animateRipple, delay)
      return () => clearTimeout(timeout)
    }, [animateRipple, index])

    const { spyStatus } = useSPYData()
    const { cryptoStatus } = useCryptoData()

    useEffect(() => {
      //  console.log(cryptoStatus, 'djdjd')
    }, [cryptoStatus])

    const determineColor = (category, spyStatus, cryptoStatus) => {
      if (category === 'Explore') {
        return spyStatus === 'down' ? colors.red : colors.primary3
      }
      if (category === 'Crypto') {
        return cryptoStatus === 'down' ? colors.red : colors.primary3
      }
      if (category === 'Invest') {
        return today - yesterday < 0 ? colors.red : colors.primary3
      }
      return colors.primary // default color for other categories
    }
    const determineTextContent = (category, spyStatus, cryptoStatus) => {
      if (category === 'Explore') {
        return spyStatus === 'down' ? 'down' : 'up'
      } else if (category === 'Invest') {
        return today - yesterday < 0 ? 'down' : 'up' // Or however you wish to phrase it
      } else if (category === 'Crypto') {
        return cryptoStatus === 'down' ? 'down' : 'up' // Again, modify phrasing as needed
      } else {
        return ''
      }
    }
    const { portfolio_value, yesterday, today, pnL } = useCustomAccountData()

    return (
      <TouchableOpacity
        onPress={
          category === 'Friends'
            ? onShare
            : () => {
                if (!isLoggedIn && category === 'Quizzes') {
                  NavigationService.navigate('Games')
                } else if (Array.isArray(screen)) {
                  NavigationService.navigate(screen[0], screen[1])
                } else {
                  NavigationService.navigate(screen)
                }
              }
        }>
        <LinearGradient
          colors={gradientColors}
          style={[styles.cardContainer]}
          start={{ x: 0, y: 0 }} // Top-left corner
          end={{ x: 0.5, y: 0.7 }} // Bottom-right corner
        >
          <Animated.View
            style={{
              position: 'absolute', // Absolute positioning
              top: 0,
              bottom: 0,
              height: '500%',
              width: '40%', // Width of the light streak
              backgroundColor: 'rgba(255,255,255,0.2)', // The light color
              transform: [{ rotate: '-45deg' }, { translateX: translateXAnimation }],
            }}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: widthPercentageToDP(4),
            }}>
            <View style={{ flexDirection: 'row' }}>
              <View style={{}}>
                <Text
                  style={[
                    textStyles.normalBold,
                    {
                      color: 'white',
                      marginTop: heightPercentageToDP(1),
                      fontSize: actuatedNormalize(16),
                      width: widthPercentageToDP(40),
                    },
                  ]}>
                  {title}
                  <Text
                    style={[
                      textStyles.normalBold,
                      {
                        color: determineColor(category, spyStatus),
                        marginTop: heightPercentageToDP(1),
                        fontSize: actuatedNormalize(16),
                        width: widthPercentageToDP(40),
                      },
                    ]}>
                    {determineTextContent(category, spyStatus)}
                  </Text>
                  {(category === 'Explore' ||
                    category === 'Invest' ||
                    category === 'Crypto') &&
                    ' today!'}
                </Text>
                <Text
                  style={[
                    textStyles.normalRegular,
                    {
                      color: 'white',
                      fontSize: actuatedNormalize(12),
                      marginTop: heightPercentageToDP(0.5),
                    },
                  ]}>
                  {info} {category === 'Quizzes' && level}{' '}
                  {category === 'Games' && levelGame}
                </Text>
              </View>
              <View
                style={{
                  width: widthPercentageToDP(18),
                  marginLeft: widthPercentageToDP(2),
                  height: widthPercentageToDP(18),
                  // marginTop: heightPercentageToDP(2),
                  borderRadius: actuatedNormalize(40),
                  backgroundColor: 'rgba(255,255,255,0.6)',
                  justifyContent: 'center',
                }}>
                <Animated.View
                  style={{
                    transform: [{ scale: scaleAnimation }],
                  }}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: actuatedNormalize(30),
                      textAlign: 'center',
                    }}>
                    {emoji}
                  </Text>
                </Animated.View>
              </View>
            </View>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View
              style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                paddingHorizontal: widthPercentageToDP(7),
                borderRadius: heightPercentageToDP(4),
                borderWidth: widthPercentageToDP(0.3),
                borderColor: 'white',
                marginLeft: widthPercentageToDP(3),
                justifyContent: 'center',
              }}>
              <Text
                style={[
                  textStyles.normalSemiBold,
                  {
                    color: 'white',
                    fontSize: actuatedNormalize(14),
                  },
                ]}>
                {button}
              </Text>
            </View>
            <View style={{ alignItems: 'center', marginRight: widthPercentageToDP(3) }}>
              <Text
                style={[
                  textStyles.normalRegular,
                  {
                    color: 'white',
                    fontSize: actuatedNormalize(12),
                  },
                ]}>
                {component}
              </Text>
              <Text
                style={[
                  textStyles.normalSemiBold,
                  {
                    color: 'white',
                    fontSize: actuatedNormalize(18),
                  },
                ]}>
                {category === 'Leaderboard' && weeklyRank}
                {category === 'Invest' && '$' + (today - yesterday).toFixed(2)}
                {category === 'Games' && levelGame}
              </Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    )
  },
)

const styles = {
  cardContainer: {
    justifyContent: 'space-between',
    width: widthPercentageToDP(70),
    height: heightPercentageToDP(23),
    marginHorizontal: widthPercentageToDP(2),
    borderRadius: actuatedNormalize(6),
    marginVertical: heightPercentageToDP(2),
    paddingHorizontal: widthPercentageToDP(2),
    paddingVertical: heightPercentageToDP(2),
  },
}

export { CustomHomeButton }
