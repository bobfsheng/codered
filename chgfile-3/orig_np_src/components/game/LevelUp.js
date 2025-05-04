import React from 'react'
import { Text, View, Image, StyleSheet } from 'react-native'
import {
  textStyles,
  actuatedNormalize,
  widthPercentageToDP,
  heightPercentageToDP,
} from '@utils'
import { CustomButton } from '@components'

const LevelUp = ({ handleNextQuestion, level }) => {
  return (
    <>
      <Text style={styles.levelUpText}>You are leveling up! Level {level} unlocked!</Text>
      <View style={styles.buttonContainer}>
        <CustomButton text="Continue" onPress={handleNextQuestion} />
      </View>
      <Image
        source={require('../../assets/images/onboarding/Coin-6.gif')}
        style={styles.image}
      />
    </>
  )
}

const styles = StyleSheet.create({
  levelUpText: {
    ...textStyles.normalRegular,
    color: 'white',
    fontSize: actuatedNormalize(20),
    textAlign: 'center',
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: heightPercentageToDP(5),
  },
  image: {
    width: widthPercentageToDP('100%'),
    height: heightPercentageToDP('66'),
  },
})

export { LevelUp }
