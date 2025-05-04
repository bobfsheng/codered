import React, { memo } from 'react'
import { Pressable, StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import { useRoute } from '@react-navigation/stack'
import LinearGradient from 'react-native-linear-gradient'
import { Icon } from '@components'
import {
  colors,
  heightPercentageToDP,
  widthPercentageToDP,
  textStyles,
  actuatedNormalize,
} from '@utils'
import { CustomPositionMiniChart } from '@components'
import { NavigationService } from '@navigation'
import { stockInfo } from '@constants/stockInfo'

const CustomPositionAssets = memo(({ position, explore }) => {
   const foundStock = stockInfo.find(stock => stock.symbol === position?.symbol)

  return (
    <View style={{ flexDirection: 'row' }}>
      <Pressable
        onPress={() => {
          explore === false
            ? NavigationService.navigate('InvestScreenPosition', {
                stockTicker: position?.symbol,
                amount: position?.qty,
                price: position?.avg_entry_price,
                side: position?.side,
                pl: position?.unrealized_pl,
              })
            : NavigationService.navigate('Invest', {
                screen: 'InvestTab',
                params: {
                  stockTicker: position?.symbol,
                },
              })
        }}>
        <LinearGradient
          colors={[colors.offWhite, colors.offWhite]}
          style={[styles.positionCard]}>
          <Text style={styles.symbol}>{position?.symbol} </Text>

          <Text
            numberOfLines={1}
            style={[
              textStyles.bigRegular,
              {
                // paddingHorizontal: 10,
                color: 'gray',
                // marginLeft: widthPercentageToDP(6),
                fontSize: actuatedNormalize(10),
                width: widthPercentageToDP(30),
                // marginBottom: heightPercentageToDP(1.5),
              },
            ]}>
            {foundStock?.info?.longName && foundStock?.info?.longName}
          </Text>

          <Text style={[styles.symbol, { fontSize: actuatedNormalize(12) }]}>
            {'$ '}
            {parseFloat(position?.current_price)?.toFixed(2).toString().length < 7
              ? parseFloat(position?.current_price)?.toFixed(2)
              : parseFloat(position?.current_price)?.toFixed(0)}
          </Text>
          <TouchableOpacity
            onPress={() => {
              explore === false
                ? NavigationService.navigate('Home', {
                    screen: 'ExplorePosition',
                    params: {
                      stockTicker: position?.symbol,
                      amount: position?.qty,
                      price: position?.avg_entry_price,
                      side: position?.side,
                      pl: position?.unrealized_pl,
                      current_price: position?.current_price,
                      daily_profit: position?.unrealized_intraday_pl,
                      daily_profit_pr: position?.unrealized_intraday_plpc,
                      cost: position?.cost_basis,
                      market_value: position?.market_value,
                      change_today: position?.change_today,
                    },
                  })
                : NavigationService.navigate('Explore', {
                    screen: 'ExploreScreen',
                    params: {
                      stockTicker: position?.symbol,
                    },
                  })
            }}>
            <CustomPositionMiniChart position={position} />
          </TouchableOpacity>
          <Text style={styles.symbol}>
            <Icon
              type="AntDesign"
              name={position?.unrealized_pl < 0 ? 'downcircle' : 'upcircle'}
              size={actuatedNormalize(14)}
              color={position?.unrealized_pl < 0 ? colors.red : colors.primary4}
            />{' '}
            <Text
              style={[
                styles.symbol,
                {
                  fontSize: actuatedNormalize(12),
                  color:
                    parseFloat(position?.unrealized_pl) < 0
                      ? colors.redError
                      : colors.primary,
                },
              ]}>
              $ {parseFloat(position?.unrealized_pl)?.toFixed(2)}{' '}
            </Text>
          </Text>
        </LinearGradient>
      </Pressable>
    </View>
  )
})
const styles = StyleSheet.create({
  positionCard: {
    paddingHorizontal: widthPercentageToDP(2),
    paddingVertical: heightPercentageToDP(1),
    // width: widthPercentageToDP(38),
    borderRadius: heightPercentageToDP(0.5),
    borderWidth: widthPercentageToDP(0.15),
    marginHorizontal: widthPercentageToDP(1.5),
    borderColor: 'white',
    backgroundColor: '#1F1C1B',
    marginBottom: heightPercentageToDP(0),
  },
  symbol: [
    textStyles.normalSemiBold,
    {
      color: 'black',
      fontSize: actuatedNormalize(15),
      marginTop: heightPercentageToDP(1),
    },
  ],
  priceText: [
    textStyles.normalSemiBold,
    {
      color: '#242424',
      marginTop: heightPercentageToDP(0.5),
      marginRight: widthPercentageToDP(2),
    },
  ],
  priceValue: [
    textStyles.normalSemiBold,
    {
      color: 'black',
    },
  ],
  plText: [
    textStyles.normalSemiBold,
    {
      color: colors.lightDarkBackground,
      marginTop: heightPercentageToDP(1.5),
      fontSize: actuatedNormalize(10),
    },
  ],
  finalPriceValue: [
    textStyles.normalSemiBold,
    {
      color: 'black',
      marginRight: widthPercentageToDP(2),
    },
  ],
})
export { CustomPositionAssets }
