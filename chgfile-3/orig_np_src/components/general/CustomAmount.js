import React, { memo } from 'react'
import {
  Pressable,
  StyleSheet,
  View,
  Text,
  Platform,
  TouchableOpacity,
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { Icon } from '@components'
import {
  colors,
  heightPercentageToDP,
  widthPercentageToDP,
  textStyles,
  actuatedNormalize,
} from '@utils'
import { CustomExploreMiniChart } from '@components'
import { NavigationService } from '@navigation'
import { exploreLogos } from '@constants/exploreLogos'

const CustomAmount = memo(({ amount, selectedAmount }) => {
    const formatValue = value => {
      if (!value) return
      return value
        ?.toFixed(0)
        ?.toString()
        ?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
  return (
    // <View style={{ flexDirection: 'column' }}>
    <LinearGradient
      colors={
        selectedAmount === amount
          ? [colors.primary, '#B9CC00']
          : [colors.offWhite, colors.offWhite]
      }
      start={{ x: 0, y: 0.7 }}
      end={{ x: 1, y: 0.7 }}
      style={[styles.positionCard]}>
      <Text
        style={[styles.symbol, { color: selectedAmount === amount ? 'white' : 'black' }]}>
        ${formatValue(amount)}
      </Text>
    </LinearGradient>
    // </View>
  )
})
const styles = StyleSheet.create({
  positionCard: {
    flexDirection: 'column',
    alignContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    // marginLeft: widthPercentageToDP(2),
    paddingVertical: widthPercentageToDP(2.5),
    paddingHorizontal: heightPercentageToDP(2),
    // width: widthPercentageToDP(27),
    // height: widthPercentageToDP(17),
    borderRadius: heightPercentageToDP(20),
    marginHorizontal: widthPercentageToDP(1.5),
  },
  symbol: [
    textStyles.normalBold,
    {
      alignContent: 'center',
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: actuatedNormalize(14),
    },
  ],
})
export { CustomAmount }
