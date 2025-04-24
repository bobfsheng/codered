import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { actuatedNormalize, colors, textStyles, widthPercentageToDP } from '@utils'
import Ionicons from 'react-native-vector-icons/Ionicons'

const CustomInputLabel = ({
  text,
  textStyle,
  optional = false,
  info = false,
  infog = false,
  big = false,
  hugeFont = false,
  crypto = false,
}) => {
  return (
    <View style={[styles.labelContainer, !big && styles.marginOffset]}>
      <Text
        style={[
          big ? [styles.bigLabel, styles.smallR] : [styles.smallLabel, styles.smallZ],
          hugeFont ? styles.bigFont : null,
          textStyle,
        ]}>
        {text}
      </Text>
      {optional && (
        <Text style={[textStyles.styles.smallR, styles.optional]}>optional</Text>
      )}
      {info && (
        <Ionicons
          name="ios-information-circle"
          size={24}
          color={!crypto ? 'gray' : 'white'}
          style={styles.marginOffset}
        />
      )}

      {infog && (
        <Ionicons
          name="ios-information-circle"
          size={24}
          color={!crypto ? 'gray' : 'white'}
          style={styles.marginOffset}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  smallLabel: {
    color: colors.offWhite,
  },
  bigLabel: {
    color: colors.offWhite,
  },
  bigFont: {
    fontSize: actuatedNormalize(17),
  },
  optional: {
    color: colors.darkGrey,
    paddingLeft: widthPercentageToDP(5),
  },
  marginOffset: {
    marginHorizontal: widthPercentageToDP(1),
  },
  smallR: {
    fontFamily: 'DMSans-Medium',
    fontWeight: '500',
    fontSize: actuatedNormalize(12.5),
  },
  smallZ: {
    fontFamily: 'DMSans-Medium',
    fontWeight: '500',
    fontSize: actuatedNormalize(11.5),
  },
})

export { CustomInputLabel }
