import React, { memo } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import {
  actuatedNormalize,
  colors,
  heightPercentageToDP,
  textStyles,
  widthPercentageToDP,
} from '@utils'
import { stockInfo } from '@constants/stockInfo'

const cryptos = require('@constants/cryptos.json')

const ExploreStockInfo = memo(
  ({
    lastQuote,
    stockName,
    stockTicker,
    closePriceYesterday,
    selectedFinalStock,
    refreshingColor,
  }) => {
    const foundStock = stockInfo.find(stock => stock.symbol === stockTicker)

    const formatValue = value => {
      if (!value) return
      return value?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }

    return (
      <>
        <View style={styles.tickerContainer}>
          <Text style={styles.stockTickerText}>
            {stockTicker}
            {'  '}
            {foundStock?.info?.longName && !stockName && (
              <Text numberOfLines={1} style={styles.foundStockText}>
                {foundStock?.info?.longName}
              </Text>
            )}
            <Text numberOfLines={1} style={styles.foundStockText}>
              {stockName}
            </Text>
          </Text>
        </View>
        <Text
          style={[
            styles.lastQuoteText,
            { color: refreshingColor === false ? colors.white : '#C4DAA9' },
          ]}>
          {selectedFinalStock?.class === 'crypto' || cryptos.includes(stockTicker)
            ? `${
                lastQuote.toFixed(3) === 0.0
                  ? lastQuote?.toFixed(8)
                  : formatValue(lastQuote?.toFixed(2))
              }`
            : `$ ${formatValue(lastQuote.toFixed(2))}  `}
          <Text
            style={[
              styles.priceChangeText,
              { color: closePriceYesterday >= 0 ? '#9ECB90' : colors.redError },
            ]}>
            {isNaN(closePriceYesterday) || closePriceYesterday === 0
              ? ''
              : `% ${closePriceYesterday}`}
          </Text>
        </Text>
      </>
    )
  },
)

const styles = StyleSheet.create({
  foundStockText: [
    textStyles.bigRegular,
    {
      color: 'gray',
      marginLeft: widthPercentageToDP(6),
      fontSize: actuatedNormalize(14),
      width: widthPercentageToDP(60),
    },
  ],
  tickerContainer: {
    flexDirection: 'row',
    marginBottom: heightPercentageToDP(0.3),
    marginLeft: widthPercentageToDP(6),
  },
  stockTickerText: [
    textStyles.bigMedium,
    {
      color: colors.white,
      marginBottom: heightPercentageToDP(0.3),
      marginTop: heightPercentageToDP(2),
      fontSize: actuatedNormalize(22),
    },
  ],
  lastQuoteText: [
    textStyles.bigBold,
    {
      marginLeft: widthPercentageToDP(6),
      fontSize: actuatedNormalize(26),
    },
  ],
  priceChangeText: [
    textStyles.bigBold,
    {
      marginLeft: widthPercentageToDP(4),
      fontSize: actuatedNormalize(12),
    },
  ],
})

export { ExploreStockInfo }
