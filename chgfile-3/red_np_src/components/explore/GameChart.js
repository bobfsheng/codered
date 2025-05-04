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

const GameChart = memo(({ position, explore }) => {
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
        <LinearGradient
          colors={[colors.offWhite, colors.offWhite]}
          style={[styles.positionCard]}>
          <Text style={styles.symbol}>
            {position?.symbol}
            {'    '}
            {exploreLogos &&
              exploreLogos?.map((item, index) => (
                <Icon
                  type={item.ticker === position.symbol && item.type}
                  name={item.ticker === position.symbol && item.logo}
                  size={widthPercentageToDP(Platform.isPad !== true ? 5 : 4)}
                  style={{ marginTop: heightPercentageToDP(1) }}
                  color="black"
                  onPress={() =>
                    NavigationService.navigate('Invest', {
                      screen: 'InvestTab',
                      params: {
                        stockTicker: position?.symbol,
                      },
                    })
                  }
                  key={index}
                />
              ))}
          </Text>

          <Text style={[styles.symbol, , { fontSize: actuatedNormalize(12) }]}>
            {'$ '}
            {parseFloat(position?.current_price)?.toFixed(2).toString().length < 7
              ? parseFloat(position?.current_price)?.toFixed(2)
              : parseFloat(position?.current_price)?.toFixed(0)}
          </Text>
          <TouchableOpacity
            onPress={() =>
              NavigationService.navigate('Explore', {
                screen: 'ExploreScreen',
                params: {
                  stockTicker: position?.symbol,
                },
              })
            }>
            <CustomExploreMiniChart
              stockTicker={position?.symbol}
              selectedFinalStock={position?.symbol}
            />
          </TouchableOpacity>
        </LinearGradient>
      </Pressable>
    </View>
  )
})
const styles = StyleSheet.create({
  positionCard: {
    flexDirection: 'column',
    alignContent: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    marginLeft: widthPercentageToDP(2),
    paddingVertical: heightPercentageToDP(1),
    width: widthPercentageToDP(35),
    borderRadius: heightPercentageToDP(1),
    marginHorizontal: widthPercentageToDP(1.5),
  },
  symbol: [
    textStyles.normalSemiBold,
    {
      color: 'black',
      fontSize: actuatedNormalize(16),
      paddingHorizontal: widthPercentageToDP(3),
    },
  ],
})
export { GameChart }
