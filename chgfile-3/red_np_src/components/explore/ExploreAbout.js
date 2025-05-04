import React, { memo, useEffect, useState } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, Linking } from 'react-native'
import {
  colors,
  heightPercentageToDP,
  widthPercentageToDP,
  textStyles,
  actuatedNormalize,
  capitalize,
} from '@utils'
import { HorizontalRule } from '@components'
import { stockInfo } from '@constants/stockInfo'
import LinearGradient from 'react-native-linear-gradient'

const ExploreAbout = memo(({ stockTicker, lastQuote }) => {
  let stockTickerAdj

  // Check if stockTicker is a string
  if (typeof stockTicker === 'string' && stockTicker.length > 15) {
    try {
      const parsedStockTicker = JSON.parse(stockTicker)
      stockTickerAdj = parsedStockTicker.symbol
    } catch (error) {
      console.error('Failed to parse stockTicker:', error)
    }
  } else if (typeof stockTicker === 'object' && stockTicker?.symbol) {
    stockTickerAdj = stockTicker.symbol
  } else {
    stockTickerAdj = stockTicker
  }

  const foundStock = stockInfo.find(stock => stock.symbol === stockTickerAdj)

  const [longInfo, setLongInfo] = useState(false)
  useEffect(() => {}, [])

  return (
    <>
      {foundStock !== undefined && (
        <>
          <View style={{ alignItems: 'center', marginTop: 10 }}>
            <HorizontalRule />
          </View>

          <View
            style={[
              styles.rowView,
              {
                flexDirection: 'column',
                marginLeft: widthPercentageToDP(6),
                width: '80%',
              },
            ]}>
            {foundStock?.info?.companyOfficers?.[0]?.name && (
              <>
                <Text style={[styles.category4, { color: 'white' }]}>About</Text>
                {/* <TouchableOpacity onPress={() => setFeedBoxModal(prev => !prev)}> */}
                <TouchableOpacity onPress={() => setLongInfo(prev => !prev)}>
                  <Text
                    numberOfLines={longInfo == true ? 300 : 3}
                    style={[
                      styles.category3,
                      { fontWeight: '900', fontSize: actuatedNormalize(13) },
                    ]}>
                    {/* {longBusinessSummary} */}
                    {foundStock?.info?.longBusinessSummary}
                  </Text>

                  <Text style={[styles.category3, { color: 'gray' }]}>
                    {longInfo == true ? 'Show less...' : 'Show more...'}
                  </Text>
                </TouchableOpacity>
                <Text style={[styles.category4, { color: 'white' }]}>Overview</Text>
                <View style={{ flexDirection: 'row' }}>
                  <LinearGradient
                    colors={[ 'teal','lightblue']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      borderRadius: actuatedNormalize(4),
                      width: widthPercentageToDP(40),
                      height: heightPercentageToDP(12),
                      backgroundColor: 'white',
                      // alignItems: "center",
                      justifyContent: 'center',
                      marginBottom: heightPercentageToDP(2),
                      padding: widthPercentageToDP(4),
                    }}>
                    <Text
                      numberOfLines={2}
                      style={[
                        styles.category3,
                        {
                          color: 'white',
                          fontSize: actuatedNormalize(12),
                          width: widthPercentageToDP(33),
                          marginTop: heightPercentageToDP(2),
                        },
                      ]}>
                      {foundStock?.info?.industry}
                      {'   '}
                      {/* <Text style={[styles.category3, { color: 'white' }]}>
                        {1 < 0 ? '👍' : '👎'}
                      </Text> */}
                    </Text>
                    <Text
                      style={[
                        styles.category3,
                        { color: 'black'},
                      ]}>
                      Industry
                    </Text>
                  </LinearGradient>
                  <LinearGradient
                    colors={
                      foundStock?.info?.overallRisk <= 5
                        ? [colors.primary, colors.primary2]
                        : [colors.redError, colors.red]
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      borderRadius: actuatedNormalize(4),
                      width: widthPercentageToDP(40),
                      height: heightPercentageToDP(12),
                      backgroundColor: 'white',
                      marginHorizontal: widthPercentageToDP(4),
                      padding: widthPercentageToDP(4),
                      marginBottom: heightPercentageToDP(2),
                    }}>
                    <Text style={[styles.category3, { color: 'white' }]}>
                      {foundStock?.info?.overallRisk <= 5 ? 'Low ' : 'High '}
                      <Text style={[styles.category3, { color: 'white' }]}>
                        {foundStock?.info?.overallRisk <= 5 ? '🟢' : '🔴'}
                      </Text>
                    </Text>
                    <Text style={[styles.category3, { color: 'black' }]}>
                      Risk Level {foundStock?.info?.overallRisk}
                    </Text>
                  </LinearGradient>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <LinearGradient
                    colors={
                      foundStock?.info?.recommendationKey !== 'sell'
                        ? [colors.primary2, colors.primary3]
                        : [colors.redError, colors.red]
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      borderRadius: actuatedNormalize(4),
                      width: widthPercentageToDP(40),
                      height: heightPercentageToDP(12),
                      backgroundColor: 'white',
                      marginBottom: heightPercentageToDP(2),
                      padding: widthPercentageToDP(4),
                    }}>
                    <Text style={[styles.category3, { color: 'white' }]}>
                      {capitalize(foundStock?.info?.recommendationKey)}
                      {'   '}
                      <Text style={[styles.category3, { color: 'white' }]}>
                        {foundStock?.info?.recommendationKey !== 'sell' ? '👍' : '👎'}
                      </Text>
                    </Text>
                    <Text style={[styles.category3, { color: 'black' }]}>
                      Analysts Say
                    </Text>
                  </LinearGradient>
                  <LinearGradient
                    colors={
                      parseFloat(foundStock?.info?.bookValue / lastQuote).toFixed(2) < 1
                        ? ['orange', 'red']
                        : [colors.primary, colors.primary2]
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      borderRadius: actuatedNormalize(4),
                      width: widthPercentageToDP(40),
                      height: heightPercentageToDP(12),
                      backgroundColor: 'white',
                      marginHorizontal: widthPercentageToDP(4),
                      padding: widthPercentageToDP(4),
                      marginBottom: heightPercentageToDP(2),
                    }}>
                    <Text style={[styles.category3, { color: 'white' }]}>
                      {parseFloat(foundStock?.info?.bookValue / lastQuote).toFixed(2) < 1
                        ? 'Overvalued'
                        : 'Undervalued'}
                      {'   '}
                      <Text style={[styles.category3, { color: 'white' }]}>
                        {foundStock?.info?.overallRisk < 1 ? '📉' : '📈'}
                      </Text>
                    </Text>
                    <Text style={[styles.category3, { color: 'black' }]}>Estimated</Text>
                  </LinearGradient>
                </View>
                <Text style={[styles.category3, { color: 'gray' }]}>CEO</Text>
                <Text style={styles.category3}>
                  {foundStock?.info?.companyOfficers[0]?.name}
                </Text>
                <Text style={[styles.category3, { color: 'gray' }]}>Industry Sector</Text>
                <Text style={styles.category3}>{foundStock?.info?.sector}</Text>
                <Text style={[styles.category3, { color: 'gray' }]}>Website</Text>
                <TouchableOpacity
                  onPress={() => Linking.openURL(foundStock?.info?.website)}>
                  <Text style={styles.category3}>{foundStock?.info?.website}</Text>
                </TouchableOpacity>
                <Text style={[styles.category3, { color: 'gray' }]}>Overall Risk</Text>
                <Text style={styles.category3}>{foundStock?.info?.overallRisk}</Text>
                <Text style={[styles.category3, { color: 'gray' }]}>Book Value</Text>
                <Text style={styles.category3}>{foundStock?.info?.bookValue}</Text>
                {lastQuote !== 0 && (
                  <>
                    <Text style={[styles.category3, { color: 'gray' }]}>
                      Book : Price Ratio
                    </Text>
                    <Text style={styles.category3}>
                      {parseFloat(foundStock?.info?.bookValue / lastQuote).toFixed(2)}
                    </Text>
                  </>
                )}
                <Text style={[styles.category3, { color: 'gray' }]}>
                  Analyst Recommendation
                </Text>
                <Text
                  style={[
                    styles.category3,
                    {
                      color:
                        foundStock?.info?.recommendationKey == 'sell'
                          ? colors.redError
                          : colors.primary2,
                    },
                  ]}>
                  {capitalize(foundStock?.info?.recommendationKey)}
                </Text>
                {/* </TouchableOpacity> */}
                <TouchableOpacity
                  onPress={() => Linking.openURL('https://www.redvest.app/terms')}>
                  <Text style={[styles.category3, { color: 'gray' }]}>Disclaimer</Text>
                </TouchableOpacity>
                {/* <Text style={styles.category3}>{newsContent}</Text> */}
              </>
            )}
          </View>
        </>
      )}
    </>
  )
})
const styles = StyleSheet.create({
  columnsView: {
    flexDirection: 'column',
    width: '50%',
    justifyContent: 'flex-start',
    paddingHorizontal: '5%',
  },
  rowView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: heightPercentageToDP(2),
    marginBottom: heightPercentageToDP(1),
    paddingHorizontal: 5,
  },

  category: [
    textStyles.hugeSemiBold,
    {
      color: colors.white,
      fontSize: actuatedNormalize(10),
    },
  ],
  amount: [
    textStyles.hugeRegular,
    {
      color: colors.white,
      fontSize: actuatedNormalize(10),
    },
  ],
  category2: [
    textStyles.hugeSemiBold,
    {
      color: colors.white,
      fontSize: actuatedNormalize(10),
    },
  ],
  category3: [
    textStyles.hugeSemiBold,
    {
      color: colors.white,
      width: widthPercentageToDP(90),
      fontSize: actuatedNormalize(13),
      marginTop: heightPercentageToDP(1),
      marginBottom: heightPercentageToDP(1.5),
    },
  ],
  category4: [
    textStyles.hugeSemiBold,
    {
      color: colors.white,
      width: widthPercentageToDP(90),
      fontSize: actuatedNormalize(15),
      marginBottom: heightPercentageToDP(1.5),
    },
  ],
  amount2: [
    textStyles.hugeRegular,
    {
      color: colors.white,
      fontSize: actuatedNormalize(16),
    },
  ],
})
export { ExploreAbout }
