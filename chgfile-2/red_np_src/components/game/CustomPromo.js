import React from 'react'
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native'
import {
  actuatedNormalize,
  heightPercentageToDP,
  widthPercentageToDP,
  textStyles,
} from '@utils'
import { useInviteFriend } from '@hooks'
import { useAuthSelector } from '@store'
import LinearGradient from 'react-native-linear-gradient'

const CustomPromo = ({ buttonText, promoMessage, gradientColors, textColor, onPress }) => {
  // const { userId } = useAuthSelector(state => state)
  // const { onShare } = useInviteFriend(userId)

  const handlePress = () => {
    onShare()
  }

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <LinearGradient
          colors={gradientColors}
          style={[styles.card]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}>
          <Text style={[styles.header, { color: textColor }]}>{promoMessage}</Text>
          <View style={[styles.button, { backgroundColor: textColor }]}>
            <Text
              style={
                (styles.buttonText,
                {
                  color: textColor === 'white' ? 'black' : 'white',
                  fontSize: actuatedNormalize(13),
                })
              }>
              {buttonText}
            </Text>
          </View>
        </LinearGradient>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    marginVertical: heightPercentageToDP(2),
    marginRight: widthPercentageToDP(4),
  },
  card: {
    height: heightPercentageToDP(20),
    width: widthPercentageToDP(55),
    borderRadius: heightPercentageToDP(1),
    backgroundColor: 'rgba(101,191,255,0.3)',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: widthPercentageToDP(5),
    paddingVertical: heightPercentageToDP(2.5),
  },
  header: {
    ...textStyles.bigRegular,
    color: 'white',
    fontSize: actuatedNormalize(16),
  },
  button: {
    // backgroundColor: 'white',
    paddingHorizontal: widthPercentageToDP(3),
    paddingVertical: heightPercentageToDP(0.5),
    borderRadius: heightPercentageToDP(7),
    marginTop: heightPercentageToDP(2),
  },
  buttonText: {
    ...textStyles.bigRegular,
    fontSize: actuatedNormalize(15),
  },
})

export { CustomPromo }
