import React, { useState, useEffect, useCallback, memo } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Pressable,

} from 'react-native'
import {
  actuatedNormalize,
  colors,
  heightPercentageToDP,
  textStyles,
  widthPercentageToDP,
} from '@utils'


const cryptos = require('@constants/cryptos.json')

const ExploreListButtons = memo(({ selectedButton, handleButtonPress, stockTicker }) => {
  return (
    <>
      {cryptos.includes(stockTicker) === true ? null : (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: heightPercentageToDP(2),
            marginBottom: heightPercentageToDP(1),
          }}>
          <Pressable onPress={() => handleButtonPress(1)}>
            <Text style={selectedButton === 1 ? styles.header : styles.unSelectedText}>
              {'About'}
            </Text>
          </Pressable>
          <Pressable onPress={() => handleButtonPress(2)}>
            <Text style={selectedButton === 2 ? styles.header : styles.unSelectedText}>
              {'Price'}
            </Text>
          </Pressable>
          <Pressable onPress={() => handleButtonPress(3)}>
            <Text style={selectedButton === 3 ? styles.header : styles.unSelectedText}>
              {/* style={{color:colors.darkBackground}}> */}
              {'News'}
            </Text>
          </Pressable>
          <Pressable onPress={() => handleButtonPress(4)}>
            <Text
              style={selectedButton === 4 ? styles.selectedText : styles.unSelectedText}>
              {/* style={{color:colors.darkBackground}}> */}
              {''}
            </Text>
          </Pressable>
        </View>
      )}
    </>
  )
})
const styles = StyleSheet.create({
  unSelectedText: [
    textStyles.hugeSemiBold,
    {
      marginLeft: widthPercentageToDP(6),
      color: 'gray',
      fontSize: actuatedNormalize(16),
    },
  ],
  header: [
    textStyles.hugeSemiBold,
    {
      marginLeft: widthPercentageToDP(6),
      color: colors.white,
      fontSize: actuatedNormalize(16),
    },
  ],
})
export { ExploreListButtons }
