import React, { useRef, useEffect } from 'react'
import { Text, View, StyleSheet, Animated, Easing } from 'react-native'
import {
  textStyles,
  actuatedNormalize,
  widthPercentageToDP,
  heightPercentageToDP,
  colors,
} from '@utils'
import { AdComponent, CustomButton } from '@components'

const RippleText = ({ text, fontSizing }) => {
  const scaleValue = useRef(new Animated.Value(1)).current
  const opacityValue = useRef(new Animated.Value(0.5)).current

  useEffect(() => {
    const animateRipple = () => {
      // Start with opacity and scale at 1
      opacityValue.setValue(1)
      scaleValue.setValue(1)

      // Animate opacity to 0.7 and back to 1 with fluid timing
      Animated.timing(opacityValue, {
        toValue: 0.7,
        duration: 300, // Adjust the duration as needed
        easing: Easing.inOut(Easing.quad), // Use a fluid easing function
        useNativeDriver: false,
      }).start(() => {
        Animated.timing(opacityValue, {
          toValue: 1,
          duration: 300, // Adjust the duration as needed
          easing: Easing.inOut(Easing.quad), // Use the same easing function
          useNativeDriver: false,
        }).start()
      })

      // Animate scale to 1.2 and back to 1 with fluid timing
      Animated.sequence([
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
      ]).start()
    }

    // Call the animation function when the component mounts
    animateRipple()
  }, [])

  return (
    <View style={styles.rippleContainer}>
      <Animated.View
        style={{
          alignContent: 'center',
          alignItems: 'center',
          opacity: opacityValue, // Apply opacity animation
          transform: [{ scale: scaleValue }], // Apply scale animation
        }}>
        <Text
          style={
            {
              color: 'white',
              fontSize: actuatedNormalize(fontSizing),
            //   width: widthPercentageToDP(85),
              margin: heightPercentageToDP(2),
              textAlign: 'center',
            }
          }>
          {text}
        </Text>
      </Animated.View>
    </View>
  )
}

const styles = {
  buttonStyle: {
    fontSize: actuatedNormalize(11),
    borderWidth: 2,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: colors.primary,
    width: widthPercentageToDP(90),
    height: heightPercentageToDP(8),
    borderRadius: 3,
  },
  rippleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent', // You can change this to any desired background color
    padding: 20,
    borderRadius: 999,
  },
}

export { RippleText }
