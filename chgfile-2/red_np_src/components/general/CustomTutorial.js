import React, { useState, useEffect, useRef } from 'react'
import {
  Pressable,
  StyleSheet,
  View,
  Text,
  Platform,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { Icon, CustomButton } from '@components'
import {
  colors,
  heightPercentageToDP,
  widthPercentageToDP,
  textStyles,
  actuatedNormalize,
} from '@utils'
import AppIntroSlider from 'react-native-app-intro-slider'
import { NavigationService } from '@navigation'
import { exploreLogos } from '@constants/exploreLogos'

const CustomTutorial = ({ data, onPress }) => {
  const [activeSlide, setActiveSlide] = useState(0)

  // Initialize animated values
  const emojiSizeAnim = useRef(new Animated.Value(actuatedNormalize(30))).current
  const circleOpacityAnim = useRef(new Animated.Value(0)).current
  const textScaleAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(emojiSizeAnim, {
          toValue: actuatedNormalize(45),
          duration: 500,
          useNativeDriver: false,
        }),
        Animated.timing(circleOpacityAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: false,
        }),
      ]),
      Animated.timing(textScaleAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false,
      }),
    ]).start()
  }, [])

  const renderItem = ({ item }) => (
  
      <LinearGradient
        colors={item.color}
        start={{ x: 0.3, y: 0.3}}
        end={{ x: 1, y: 0.7 }}
        style={[styles.slide]}>
        <Animated.View style={[styles.circle, { opacity: circleOpacityAnim }]}>
          <Animated.Text style={[styles.emoji, { fontSize: emojiSizeAnim }]}>
            {item.emoji}
          </Animated.Text>
        </Animated.View>
        <Animated.Text
          style={[
            styles.title,
            {
              transform: [
                {
                  scale: textScaleAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.03],
                  }),
                },
              ],
            },
          ]}>
          {item.title}
        </Animated.Text>
        <Animated.Text
          style={[
            styles.body,
            {
              transform: [
                {
                  scale: textScaleAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.03],
                  }),
                },
              ],
            },
          ]}>
          {item.body}
        </Animated.Text>
        <View style={{ marginBottom: heightPercentageToDP(6) }}>
          <CustomButton text={'Play'} onPress={onPress} />
        </View>
      </LinearGradient>

  )

  const onSlideChange = index => {
    setActiveSlide(index)
  }

  return (
    <View style={styles.container}>
      {/* <View style={{  backgroundColor: data[activeSlide].color }} /> */}
      <AppIntroSlider
        data={data}
        renderItem={renderItem}
        onSlideChange={onSlideChange}
        showNextButton={false}
        showDoneButton={false}
        dotStyle={styles.dot}
        activeDotStyle={styles.activeDot}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: heightPercentageToDP(57),
    marginTop: heightPercentageToDP(23),
  },
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    marginBottom: heightPercentageToDP(4),
    height: heightPercentageToDP(12),
    width: heightPercentageToDP(12),
    borderRadius: heightPercentageToDP(10),
    backgroundColor: 'rgba(255, 255, 255,0.7)',
  },
  slide: {
    alignItems: 'center',
    justifyContent: 'center',
    borderTopRightRadius: actuatedNormalize(20),
    borderTopLeftRadius: actuatedNormalize(20),
    height: heightPercentageToDP(55), // Slide is only half the screen size
  },
  emoji: [
    textStyles.bigSemiBold,
    {
      textAlign: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      alignContent: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: actuatedNormalize(45),
    },
  ],
  title: [
    textStyles.bigSemiBold,
    {
      textAlign: 'center',
      color: 'white',
      fontSize: actuatedNormalize(18),
      marginBottom: heightPercentageToDP(2),
    },
  ],
  body: [
    textStyles.bigRegular,
    {
      textAlign: 'center',
      color: 'white',
      fontSize: actuatedNormalize(15),
      marginBottom: heightPercentageToDP(2),
      paddingHorizontal: widthPercentageToDP(8),
    },
  ],
  dot: {
    backgroundColor: 'rgba(255, 255, 255,0.5)',
    width: widthPercentageToDP(2),
    height: widthPercentageToDP(2),
    borderRadius: widthPercentageToDP(8),
    marginHorizontal: 4,
    marginBottom: heightPercentageToDP(5),
  },
  activeDot: {
    backgroundColor: 'white',
    width: widthPercentageToDP(2),
    height: widthPercentageToDP(2),
    borderRadius: widthPercentageToDP(8),
    marginHorizontal: 4,
    marginBottom: heightPercentageToDP(5),
  },
})
export { CustomTutorial }
