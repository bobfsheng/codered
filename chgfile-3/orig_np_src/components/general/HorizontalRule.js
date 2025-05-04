import React from 'react'
import { StyleSheet, View } from 'react-native'
import { colors, heightPercentageToDP, widthPercentageToDP } from '@utils'

const HorizontalRule = ({ style }) => {
  return <View style={[styles.horizontalRule, style]} />
}

const styles = StyleSheet.create({
  horizontalRule: {
    height: 1,
    backgroundColor: colors.darkGrey,
    width: widthPercentageToDP(95),
    marginVertical: heightPercentageToDP(1),
    alignSelf: 'center',
  },
})

export { HorizontalRule }
