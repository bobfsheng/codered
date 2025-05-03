import React, { useState } from 'react'
import { StyleSheet, Pressable, View, Text, SafeAreaView } from 'react-native'
import {
  actuatedNormalize,
  colors,
  heightPercentageToDP,
  textStyles,
  widthPercentageToDP,
} from '@utils'
import { AccountBalanceBar, HorizontalRule, Icon } from '@components'
import { NavigationService } from '@navigation'
import { Friends,Challenges } from '@screens'
// import { Challenges } from 'screens/profile'

const CustomScreen = () => {


  const handleButtonPress = button => {
    setSelectedButton(button)
  }

  return (
    <SafeAreaView style={styles.mainContainer}>

      <AccountBalanceBar challenge={true} />

    
      <HorizontalRule style={{marginTop:heightPercentageToDP(4)}} />
      <Challenges profile={true} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, paddingTop: 25, backgroundColor: colors.darkBackground },
  scrollView: {
    backgroundColor: colors.darkBackground,
    marginBottom: heightPercentageToDP(0),
  },
  topSection: {
    justifyContent: 'space-between',
    marginBottom: heightPercentageToDP(2),
  },
  topIconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: widthPercentageToDP(3),
  },
  positionMainContainer: {
    width: '100%',
    justifyContent: 'space-between',
    padding: widthPercentageToDP(3),
  },

  buttonText: [
    textStyles.bigMedium,
    {
      fontSize: actuatedNormalize(15),
      color: 'black',
      marginTop: heightPercentageToDP(0.3),
    },
  ],
  selectedText: [
    textStyles.bigBold,
    {
      fontSize: actuatedNormalize(15),
      color: 'white',
    },
  ],
  unSelectedText: [
    textStyles.bigRegular,
    {
      fontSize: actuatedNormalize(15),
      color: 'gray',
    },
  ],
})
export { CustomScreen }
