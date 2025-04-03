import React from 'react'
import {
  View,
  StyleSheet,
  Text,
} from 'react-native'
import {
  actuatedNormalize,
  heightPercentageToDP,
  widthPercentageToDP,
  textStyles,
} from '@utils'
import { TouchableOpacity } from 'react-native-gesture-handler'


const GameButton = ({ buttonText, promoMessage, onPress }) => {
  return (
    <View
      style={{
        flexDirection: 'column',
        alignItems: 'center',
        margin: heightPercentageToDP(2),
      }}>
      <View
        style={{
          height: heightPercentageToDP(19),
          width: widthPercentageToDP(85),
          borderRadius: heightPercentageToDP(1),
          backgroundColor: 'rgba(101,191,255,0.3)',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          padding: widthPercentageToDP(5),
          marginBottom: heightPercentageToDP(1.5),
        }}>
        {/* <Text style={[styles.headerBig]}>{emoji}</Text> */}
        <Text style={[styles.headerBig]}>{promoMessage}</Text>
        {/* <Text style={[styles.headerBig]}>30% Off Premium Quizzes</Text> */}
        <TouchableOpacity onPress={onPress}>
          <View style={[styles.button]}>
            {/* <Text style={[styles.buttonText]}>Get Now</Text> */}
            <Text style={[styles.buttonText]}>{buttonText}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  cardContainer: { height: heightPercentageToDP(20), width: heightPercentageToDP(0) },
  button: {
    backgroundColor: 'white',
    paddingHorizontal: widthPercentageToDP(3),
    paddingVertical: heightPercentageToDP(0.5),
    borderRadius: heightPercentageToDP(7),
    marginTop: heightPercentageToDP(2),
  },
  headerBig: [textStyles.bigRegular, { color: 'white', fontSize: actuatedNormalize(20) }],
  buttonText: [
    textStyles.bigRegular,
    { color: 'black', fontSize: actuatedNormalize(14) },
  ],
})

export { GameButton }
