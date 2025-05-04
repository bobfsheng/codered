import React, { memo } from 'react'
import { Pressable, StyleSheet, View, Text, Platform } from 'react-native'
import { Icon } from '@components'
import {
  colors,
  heightPercentageToDP,
  widthPercentageToDP,
  textStyles,
  actuatedNormalize,
} from '@utils'
import { NavigationService } from '@navigation'
import { exploreLogos } from '@constants/exploreLogos'

const CustomSuggestions = memo(({ position }) => {
  return (
    <View style={{ flexDirection: 'row' }}>
      <Pressable
        onPress={() =>
          NavigationService.navigate('Invest', {
            screen: 'InvestTab',
            params: {
              stockTicker: position?.symbol,
            },
          })
        }>
        <View style={[styles.positionCard]}>
          <View
            style={{
              borderRadius: 100,
              backgroundColor: '#DADADA',
              width: widthPercentageToDP(8),
              height: widthPercentageToDP(8),
              alignContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
              justifyContent: 'center',
              marginBottom: heightPercentageToDP(1),
            }}>
            {exploreLogos &&
              exploreLogos?.map(item => (
                <Icon
                  type={item.ticker === position.symbol && item.type}
                  name={item.ticker === position.symbol && item.logo}
                  size={widthPercentageToDP(Platform.isPad !== true ? 5 : 3)}
                  color="#39383A"
                  onPress={() =>
                    NavigationService.navigate('Invest', {
                      screen: 'InvestTab',
                      params: {
                        stockTicker: position?.symbol,
                      },
                    })
                  }
                />
              ))}
          </View>

          <Text style={styles.symbol}>{position?.symbol}</Text>

          <Text style={[styles.symbol]}>
            {'$ '}
            {parseFloat(position?.current_price)?.toFixed(2).toString().length < 7
              ? parseFloat(position?.current_price)?.toFixed(2)
              : parseFloat(position?.current_price)?.toFixed(0)}
          </Text>
        </View>
      </Pressable>
    </View>
  )
})
const styles = StyleSheet.create({
  positionCard: {
    flexDirection: 'column',
    alignItems: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    height: heightPercentageToDP(13),
    width: widthPercentageToDP(20),
    borderRadius: heightPercentageToDP(1),
    borderWidth: widthPercentageToDP(0.7),
    borderColor: colors.primary,
    marginHorizontal: widthPercentageToDP(1.5),
  },
  symbol: [
    textStyles.normalSemiBold,
    {
      color: 'white',
      fontSize: actuatedNormalize(12),
      alignContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      justifyContent: 'center',
    },
  ],
})
export { CustomSuggestions }
