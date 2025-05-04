import React, { useRef, useEffect } from 'react'
import { Text, Animated, Easing, View } from 'react-native'
import {
  textStyles,
  actuatedNormalize,
  widthPercentageToDP,
  heightPercentageToDP,
} from '@utils'
import { NavigationService, Root } from '@navigation'
import LinearGradient from 'react-native-linear-gradient'
import { TouchableOpacity } from 'react-native-gesture-handler'

const ChallengeFriends = ({ category, emoji, gradientColors, screen, index }) => {
  const scaleValue = useRef(new Animated.Value(1)).current
  const opacityValue = useRef(new Animated.Value(0.5)).current
  const translateXValue = useRef(new Animated.Value(-widthPercentageToDP(27))).current // Starting outside of the view

  useEffect(() => {
    // Define individual delay values for each emoji animation
    const baseDelay = 500 // This can be adjusted as per your requirement
    const staggeredDelay = baseDelay * index // You can adjust this value to speed up or slow down the staggered effect
    const delay = baseDelay * (index + 1) // Adjust the maximum delay value as needed



    // Call the animation function when the component mounts
    const timeout = setTimeout(() => {


      Animated.loop(
        Animated.sequence([
          Animated.timing(translateXValue, {
            toValue: widthPercentageToDP(110),
            duration: 2500,
            easing: Easing.linear,
            useNativeDriver: false,
          }),
          Animated.delay(1000),
          Animated.timing(translateXValue, {
            toValue: -widthPercentageToDP(27),
            duration: 0,
            useNativeDriver: false,
          }),
        ]),
      ).start()
    }, staggeredDelay)

    // Clear timeout when component is unmounted
    return () => clearTimeout(timeout)
  }, [])

  return (
    <TouchableOpacity
      style={{ paddingHorizontal: widthPercentageToDP(8) }}
      onPress={() => NavigationService.navigate('Compete')}>
      <LinearGradient
        // key={index}
        colors={['#4169E1', '#6495ED']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.imageStyle, { alignItems: 'center' }]}>
        <Animated.View
          style={{
            position: 'absolute', // Absolute positioning
            top: 0,
            bottom: 0,
            height: '500%',
            width: '37%', // Width of the light streak
            backgroundColor: 'rgba(255,255,255,0.2)', // The light color
            transform: [{ rotate: '-25deg' }, { translateX: translateXValue }],
          }}
        />
        <Text
          style={{
            fontSize: actuatedNormalize(30),
            marginHorizontal: widthPercentageToDP(4),
          }}>
          🏆{' '}
        </Text>
        <View>
          <Text
            style={[
              textStyles.hugeRegular,
              { color: 'white', fontSize: actuatedNormalize(16) },
            ]}>
            Challenge Friends
          </Text>
          <Text
            style={[
              textStyles.mediumRegular,
              {
                color: 'white',
                fontSize: actuatedNormalize(11),
                width: widthPercentageToDP(65),
              },
            ]}>
            See Who Has The Best Portfolio Earn Virtual Redvest Coins
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  )
}

const styles = {
  cardContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    width: widthPercentageToDP(27),
    height: heightPercentageToDP(14),
    marginHorizontal: widthPercentageToDP(2),
    borderRadius: actuatedNormalize(2),
    marginVertical: heightPercentageToDP(2),
  },
  imageStyle: {
    height: heightPercentageToDP(12),
    width: widthPercentageToDP(86),
    resizeMode: 'contain',
    marginBottom: heightPercentageToDP(2),
    borderRadius: actuatedNormalize(3),
    flexDirection: 'row',
  },
}

export { ChallengeFriends }
