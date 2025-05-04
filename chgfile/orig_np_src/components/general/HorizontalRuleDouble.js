import React from 'react'
import { StyleSheet, View } from 'react-native'
import { colors, heightPercentageToDP, widthPercentageToDP } from '@utils'

const HorizontalRuleDouble = () => {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <View style={styles.horizontalRule} />
      <View style={styles.horizontalRule} />
    </View>
  )
}

const styles = StyleSheet.create({
  horizontalRule: {
    flex: 1,
    height: 1,
    backgroundColor: colors.darkGrey,
    width: widthPercentageToDP(45),
    marginVertical: heightPercentageToDP(0.1),
    alignSelf: 'center',
  },
})

export { HorizontalRuleDouble }
