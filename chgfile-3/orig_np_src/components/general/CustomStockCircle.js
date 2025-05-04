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

const CustomStockCircle = memo(({ stock , symbol, selected, onPress, index}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={{ flexDirection: 'column' }}>
        <LinearGradient
          colors={
            selected === stock
              ? [colors.primary, '#B9CC00']
              : [colors.offWhite, colors.offWhite]
          }
          start={{ x: 0, y: 0.7 }}
          end={{ x: 1, y: 0.7 }}
          style={[styles.positionCard]}>
          {exploreLogos &&
            exploreLogos?.map((item, index) => (
              <Icon
                type={item.ticker === symbol && item.type}
                name={item.ticker === symbol && item.logo}
                size={widthPercentageToDP(Platform.isPad !== true ? 8 : 6)}
                style={{}}
                color={selected === stock ? 'white' : 'black'}
                key={index}
                onPress={onPress}
              />
            ))}
        </LinearGradient>
        <Text style={[styles.symbol]}>{stock}</Text>
      </View>
    </TouchableOpacity>
  )
})
const styles = StyleSheet.create({
  positionCard: {
    flexDirection: 'column',
    alignContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: widthPercentageToDP(2),
    paddingVertical: heightPercentageToDP(1),
    width: widthPercentageToDP(17),
    height: widthPercentageToDP(17),
    borderRadius: heightPercentageToDP(20),
    marginHorizontal: widthPercentageToDP(1.5),
  },
  symbol: [
    textStyles.normalRegular,
    {
      color: 'white',
      alignContent: 'center',
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: actuatedNormalize(14),
      marginTop:heightPercentageToDP(1),
      paddingHorizontal: widthPercentageToDP(3),
    },
  ],
})
export { CustomStockCircle }
