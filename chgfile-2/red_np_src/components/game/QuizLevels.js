import React from 'react'
import {
  View,
  StyleSheet,
  Text,
} from 'react-native'
import {
  actuatedNormalize,
  heightPercentageToDP,
  textStyles,
} from '@utils'


const QuizLevels = ({ emoji, level, selected, index}) => {
  
  return (
    <View
      style={{
        flexDirection: 'column',
        alignItems: 'center',
        margin: heightPercentageToDP(selected === true ? 2 : 3),
      }}>
      <View
        style={{
          height: heightPercentageToDP(selected === true ? 11 : 9),
          width: heightPercentageToDP(selected === true ? 11 : 9),
          borderRadius: heightPercentageToDP(10),
          backgroundColor:
            selected === true ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.6)',
          borderWidth: heightPercentageToDP(0.1),
          borderColor: 'white',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: heightPercentageToDP(1.5),
        }}>
        <Text style={[styles.headerBig]}>{emoji}</Text>
      </View>
      <Text style={[styles.explanationText]}>Level {index + 1}</Text>
    </View>
  )
}
const styles = StyleSheet.create({
  cardContainer:{height:heightPercentageToDP(10), width:heightPercentageToDP(10)},
  headerBig: [
    textStyles.bigSemiBold,
    { color: 'white', fontSize: actuatedNormalize(25) },
  ],
  explanationText: [
    textStyles.bigRegular,
    { color: 'white', fontSize: actuatedNormalize(14) },
  ],
})

export { QuizLevels }
