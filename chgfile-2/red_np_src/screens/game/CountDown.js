import React, { useState } from 'react'
import { View, StyleSheet, ScrollView, Text } from 'react-native'
import {
  actuatedNormalize,
  colors,
  heightPercentageToDP,
  textStyles,
  widthPercentageToDP,
} from '@utils'
import LinearGradient from 'react-native-linear-gradient'
import { CustomButton, QuizLevels } from '@components'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { categoriesWithEmojis } from '@constants/categoriesWithEmojis'

const CountDown = ({ route }) => {
  const {
    category,
    emoji,
    explanation,
    gradientColors,
    hours: initialHours,
    minutes: initialMinutes,
    seconds: initialSeconds,
  } = route.params
  

  const [hours, setHours] = useState(initialHours || 3)
  const [minutes, setMinutes] = useState(initialMinutes || 8)
  const [seconds, setSeconds] = useState(initialSeconds || 8)
  const [selectedItem, setSelectedItem] = useState(null)
  const handleItemPress = index => {
    // Update the selected item when it is pressed
    setSelectedItem(index)
  }



  useEffect(() => {
    const timer = setInterval(() => {
      // Update the timer values every second
      if (seconds > 0) {
        setSeconds(seconds - 1)
      } else if (minutes > 0) {
        setSeconds(59)
        setMinutes(minutes - 1)
      } else if (hours > 0) {
        setSeconds(59)
        setMinutes(59)
        setHours(hours - 1)
      } else {
        // Timer has reached 00:00:00, you can handle this event here
        clearInterval(timer)
      }
    }, 1000)

    // Clean up the timer when the component unmounts
    return () => clearInterval(timer)
  }, [hours, minutes, seconds])
  
  return (
    <View style={styles.mainView}>
      <View style={{ marginLeft: widthPercentageToDP(5) }}>
        <Text
          style={[
            styles.header,
            { color: gradientColors[1], marginBottom: heightPercentageToDP(1) },
          ]}>
          Learn & Earn! {emoji}
        </Text>
        <Text
          style={[
            styles.headerBig,
            { color: gradientColors[1], marginBottom: heightPercentageToDP(3) },
          ]}>
          {category}
        </Text>
        <Text style={[styles.explanationText]}>{explanation}</Text>
      </View>
      <LinearGradient
        colors={gradientColors}
        style={[styles.cardContainer]}
        start={{ x: 0, y: 0 }} // Top-left corner
        end={{ x: 1, y: 0.1 }} // Bottom-right corner
      >
        <ScrollView>
          <View style={{ marginLeft: widthPercentageToDP(5) }}>
            <Text style={[styles.header, { marginBottom: heightPercentageToDP(1) }]}>
              Learn & Earn! {emoji}
            </Text>
            <Text style={[styles.explanationText, { color: 'white' }]}>
              {explanation}
            </Text>
            <View style={{ flexDirection: 'row', marginTop: heightPercentageToDP(2) }}>
              <View style={styles.timeCard}>
                <Text
                  style={[styles.headerTime, { marginBottom: heightPercentageToDP(1) }]}>
                  {String(hours).padStart(2, '0')}
                </Text>
                <Text
                  style={[
                    styles.explanationText,
                    { color: 'black', alignSelf: 'center' },
                  ]}>
                  Hours
                </Text>
              </View>
              <View style={styles.timeCard}>
                <Text
                  style={[styles.headerTime, { marginBottom: heightPercentageToDP(1) }]}>
                  {String(minutes).padStart(2, '0')}
                </Text>
                <Text
                  style={[
                    styles.explanationText,
                    { color: 'black', alignSelf: 'center' },
                  ]}>
                  Minutes
                </Text>
              </View>
              <View style={styles.timeCard}>
                <Text
                  style={[styles.headerTime, { marginBottom: heightPercentageToDP(1) }]}>
                  {String(seconds).padStart(2, '0')}
                </Text>
                <Text
                  style={[
                    styles.explanationText,
                    { color: 'black', alignSelf: 'center' },
                  ]}>
                  Seconds
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
        <CustomButton text={'Start'} style={{ alignSelf: 'center' }} />
      </LinearGradient>
    </View>
  )
}
const styles = StyleSheet.create({
  mainView: {
    backgroundColor: colors.darkBackground,
    flex: 1,
    justifyContent: 'space-between',
  },
  cardContainer: {
    height: heightPercentageToDP(40),
    borderTopRightRadius: actuatedNormalize(19),
    borderTopLeftRadius: actuatedNormalize(19),
    paddingBottom: heightPercentageToDP(2),
  },
  timeCard: {
    width: widthPercentageToDP(20),
    height: heightPercentageToDP(11),
    borderRadius: widthPercentageToDP(2),
    marginRight: widthPercentageToDP(3),
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  header: [
    textStyles.bigSemiBold,
    {
      color: 'white',
      fontSize: actuatedNormalize(20),
      marginTop: heightPercentageToDP(3),
    },
  ],
  headerTime: [
    textStyles.bigSemiBold,
    {
      color: 'black',
      fontSize: actuatedNormalize(30),
      // marginTop: heightPercentageToDP(3),
      alignSelf: 'center',
      alignItems: 'center',
    },
  ],
  headerBig: [
    textStyles.bigSemiBold,
    { color: 'white', fontSize: actuatedNormalize(28) },
  ],
  explanationText: [
    textStyles.bigRegular,
    { color: 'gray', fontSize: actuatedNormalize(14) },
  ],
})

export { CountDown }
