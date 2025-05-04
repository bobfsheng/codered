import React, { useEffect, useState, useRef } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  Easing,
  Platform,
} from 'react-native'
import { AnimatedTyping } from '../../components/general/AnimatedTyping'
import {
  actuatedNormalize,
  colors,
  heightPercentageToDP,
  textStyles,
  widthPercentageToDP,
  localSaveItem,
  StorageKeys,
} from '@utils'
import { CustomStockCircle, CustomAmount, CustomButton } from '@components'
import { NavigationService } from '@navigation'
import store, { useReduxDispatch, userActions, useUserSelector } from '@store'
import { funFacts } from '@constants/funFacts'

// Import your funFacts constant here

const Loading = () => {
  const [selectedFact, setSelectedFact] = useState(null)
  const [factIndex, setFactIndex] = useState(null) // New state for fact index
  const translateXValue = useRef(new Animated.Value(heightPercentageToDP(10))).current
  // const translateXValueText = useRef(new Animated.Value(heightPercentageToDP(10))).current
  const factTextOpacityValue = useRef(new Animated.Value(0)).current

  const scaleValue = useRef(new Animated.Value(1.5)).current
  const circleOpacityValue = useRef(new Animated.Value(0.2)).current
  const [loadingText, setLoadingText] = useState(true)

  const switchFactAndAnimate = () => {
    selectRandomFact()
    // Reset animation values to initial state
    translateXValue.setValue(heightPercentageToDP(28)) // start from the right
    scaleValue.setValue(0.7)
    factTextOpacityValue.setValue(0.5)
    // translateXValueText.setValue(heightPercentageToDP(18))
    // circleOpacityValue.setValue(0.2)

    Animated.sequence([
      Animated.timing(translateXValue, {
        toValue: 0, // end at the center
        duration: 1000,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      // Animated.timing(translateXValueText, {
      //   toValue: 0, // end at the center
      //   duration: 1000,
      //   easing: Easing.out(Easing.quad),
      //   useNativeDriver: true,
      // }),
      Animated.timing(circleOpacityValue, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 0.5,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(translateXValue, {
        toValue: -heightPercentageToDP(18), // exit to the left
        duration: 1000,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(factTextOpacityValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start()
  }

  useEffect(() => {
    // Initialize with the first random fact and animation
    switchFactAndAnimate()

    // Setup interval to switch funFacts every 5 seconds
    const interval = setInterval(switchFactAndAnimate, 3000)

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval)
  }, [])

  // const switchFactAndAnimate = () => {
  //   selectRandomFact()
  //   // Reset animation values to initial state
  //   // translateXValue.setValue(-widthPercentageToDP(50))
  //   scaleValue.setValue(0.7)
  //   circleOpacityValue.setValue(0.2)

  //   Animated.sequence([
  //     Animated.timing(translateXValue, {
  //       toValue: 0,
  //       duration: 1000,
  //       easing: Easing.out(Easing.quad),
  //       useNativeDriver: true,
  //     }),
  //     Animated.timing(circleOpacityValue, {
  //       toValue: 1,
  //       duration: 500,
  //       useNativeDriver: true,
  //     }),
  //     Animated.timing(scaleValue, {
  //       toValue: 0.5,
  //       duration: 500,
  //       useNativeDriver: true,
  //     }),
  //   ]).start()
  // }

  const selectRandomFact = () => {
    const randomIndex = Math.floor(Math.random() * funFacts.length)
    setSelectedFact(funFacts[randomIndex])
    setFactIndex(randomIndex) // Set the fact index
  }
  // const [loadingText, setLoadingText] = useState(true)

  return (
    <View style={styles.container}>
      {selectedFact && (
        <Animated.View
          style={{
            ...styles.circle,
            // opacity: circleOpacityValue,
          }}>
          <Animated.View
            style={{
              transform: [{ translateX: translateXValue }, { scale: scaleValue }],
              opacity: circleOpacityValue, // use the opacity value here
            }}>
            <Text style={styles.emoji}>{selectedFact.emoji}</Text>
          </Animated.View>
        </Animated.View>
      )}
      <View
        style={{
          position: 'absolute',
          top: heightPercentageToDP(50),
        }}>
        {loadingText && (
          <AnimatedTyping
            bold={true}
            slow={true}
            fontSize={actuatedNormalize(18)}
            text={['Loading...']}
            onComplete={() => {
              setLoadingText(prev => !prev)
              setTimeout(() => {
                setLoadingText(prev => !prev)
              }, 50)
            }}
          />
        )}
      </View>
      {selectedFact && (
        <View style={{ marginHorizontal: widthPercentageToDP(10) }}>
          {/* <AnimatedTyping
            fast={true}
            key={factIndex} // Use fact index as key to re-render AnimatedTyping
            fontSize={actuatedNormalize(14)}
            text={[`${selectedFact.fact}...`]}
            onComplete={() => {
              // Handle completion if needed
            }}
          /> */}
          <Animated.Text
            style={[styles.factText, { transform: [{ translateX: translateXValue }] }]}>
            {selectedFact.fact}
          </Animated.Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.darkBackground, // Change the background color as needed
    // justifyContent: 'center',
    paddingTop: heightPercentageToDP(25),
    alignItems: 'center',
  },
  loadingContainer: {
    marginBottom: 20,
  },
  loadingText: [
    textStyles.bigSemiBold,
    {
      textAlign: 'center',
      color: 'white',
      fontSize: actuatedNormalize(18),
      // marginBottom: heightPercentageToDP(2),
    },
  ],
  factContainer: {
    alignItems: 'center',
  },
  factText: [
    textStyles.bigRegular,
    {
      textAlign: 'center',
      color: 'white',
      fontSize: actuatedNormalize(14),
      marginBottom: heightPercentageToDP(2),
    },
  ],
  emoji: {
    // width:widthPercentageToDP(100),
    fontSize: actuatedNormalize(100),
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    alignSelf: 'center',
  },
  circle: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    marginBottom: heightPercentageToDP(13),
    height: heightPercentageToDP(18),
    width: heightPercentageToDP(18),
    borderRadius: heightPercentageToDP(10),
    backgroundColor: 'rgba(255, 255, 255,0.2)',
  },
})

export { Loading }
