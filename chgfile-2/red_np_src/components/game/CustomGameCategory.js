import React, { useRef, useEffect } from 'react'
import { Text, Animated, Easing } from 'react-native'
import {
  textStyles,
  actuatedNormalize,
  widthPercentageToDP,
  heightPercentageToDP,
} from '@utils'
import { NavigationService, Root } from '@navigation'
import LinearGradient from 'react-native-linear-gradient'
import { TouchableOpacity } from 'react-native-gesture-handler'

const CustomGameCategory = React.memo(
  ({
    category,
    emoji,
    gradientColors,
    screen,
    index,
    isLoggedIn,
    setShowOrderconfirmationModal,
  }) => {
    const scaleValue = useRef(new Animated.Value(1)).current
    const opacityValue = useRef(new Animated.Value(0.5)).current
    const translateXValue = useRef(new Animated.Value(-widthPercentageToDP(27))).current // Starting outside of the view

    useEffect(() => {
      // Define individual delay values for each emoji animation
      const baseDelay = 500 // This can be adjusted as per your requirement
      const staggeredDelay = baseDelay * index // You can adjust this value to speed up or slow down the staggered effect
      const delay = baseDelay * (index + 1) // Adjust the maximum delay value as needed

      const animateRipple = () => {
        // Start with opacity and scale at 1
        opacityValue.setValue(1)
        scaleValue.setValue(1)

        // Create a looped animation sequence for each emoji
        Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.timing(opacityValue, {
              toValue: 0.7,
              duration: 300, // Adjust the duration as needed
              easing: Easing.inOut(Easing.quad), // Use a fluid easing function
              useNativeDriver: false,
            }),
            Animated.timing(opacityValue, {
              toValue: 1,
              duration: 300, // Adjust the duration as needed
              easing: Easing.inOut(Easing.quad), // Use the same easing function
              useNativeDriver: false,
            }),
            Animated.delay(1000), // Delay between each loop iteration (adjust as needed)
          ]),
        ).start()

        // Create a looped animation sequence for scale
        Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.spring(scaleValue, {
              toValue: 1.2,
              friction: 0, // Adjust the friction for fluidity
              tension: 0, // Adjust the tension for fluidity
              useNativeDriver: false,
            }),
            Animated.spring(scaleValue, {
              toValue: 1,
              friction: 0,
              tension: 0,
              useNativeDriver: false,
            }),
            Animated.delay(1000), // Delay between each loop iteration (adjust as needed)
          ]),
        ).start()
      }

      // Call the animation function when the component mounts
      const timeout = setTimeout(() => {
        animateRipple()

        Animated.loop(
          Animated.sequence([
            Animated.timing(translateXValue, {
              toValue: widthPercentageToDP(104),
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
        onPress={() => {
          if (category !== "Let's Guess" && category !== 'What If?') {
            if (isLoggedIn) {
              if (screen !== 'QuizCategory') {
                NavigationService.navigate(screen)
              } else {
                NavigationService.navigate('QuizCategory', {
                  categoryParam: 'All Categories',
                })
              }
            } else {
              setShowOrderconfirmationModal(true)
            }
          }
          // If category is "Let's Guess" or 'What If?', do nothing (return null)
        }}>
        <LinearGradient
          colors={
            category === "Let's Guess" || category === 'What If?'
              ? ['rgba(255,255,255,0.5)', 'rgba(255,255,255,0.2)']
              : gradientColors
          }
          style={[styles.cardContainer]}
          start={{ x: 0, y: 0 }} // Top-left corner
          end={{ x: 1, y: 1 }} // Bottom-right corner
        >
          <Animated.View
            style={{
              position: 'absolute', // Absolute positioning
              top: 0,
              bottom: 0,
              height: '500%',
              width: '40%', // Width of the light streak
              backgroundColor: 'rgba(255,255,255,0.2)', // The light color
              transform: [{ rotate: '-45deg' }, { translateX: translateXValue }],
            }}
          />
          <Animated.View
            style={{
              alignContent: 'center',
              alignItems: 'center',
              transform: [{ scale: scaleValue }],
            }}>
            <Text
              style={{
                color: 'white',
                fontSize: actuatedNormalize(26),
                marginBottom: heightPercentageToDP(1),
                textAlign: 'center',
              }}>
              {emoji}
            </Text>
          </Animated.View>
          <Text
            style={[
              textStyles.normalRegular,
              {
                color: 'white',
                fontSize: actuatedNormalize(12),
              },
            ]}>
            {category}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    )
  },
)

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
}

export { CustomGameCategory }
