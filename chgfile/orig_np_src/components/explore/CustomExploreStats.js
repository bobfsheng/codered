import React, { memo, useState, useEffect } from 'react'
import { Pressable, StyleSheet, View, Text } from 'react-native'
import {
  colors,
  heightPercentageToDP,
  widthPercentageToDP,
  textStyles,
  actuatedNormalize,
  capitalize,
} from '@utils'
import { HorizontalRule, HorizontalRuleDouble } from '@components'
import { getBar, getCrypto } from '@services'
import moment from 'moment'
import { DotIndicator } from 'react-native-indicators'

const CustomExploreStats = memo(({ stockTicker, selectedFinalStock, stockName }) => {
  const cryptos = require('@constants/cryptos.json')
  const [volume, setVolume] = useState(0)
  const [closePrice, setClosePrice] = useState(0)
  const [lowPrice, setLowPrice] = useState(0)
  const [highPrice, setHighPrice] = useState(0)
  const [openPrice, setOpenPrice] = useState(0)

  const getCryptoHandle = React.useCallback(async () => {
    const response = await getCrypto(stockTicker)
    const symbolString =
      cryptos.includes(stockTicker) === true
        ? stockTicker
        : selectedFinalStock.symbol.toString()
    const data = response?.bars[symbolString]

    if (response?.bars) {
      const res = data[0]
      setVolume(res.v)
      setClosePrice(res.c)
      setLowPrice(res.l)
      setHighPrice(res.h)
      setOpenPrice(res.o)
    }
  }, [])
  const getBarsHandle = React.useCallback(async () => {
    const response = await getBar(stockTicker)
    if (response?.bars) {
      const res = response.bars[response.bars?.gth - 1]
      setVolume(res.v)
      setClosePrice(res.c)
      setLowPrice(res.l)
      setHighPrice(res.h)
      setOpenPrice(res.o)
    }
  }, [])

  selectedFinalStock?.class == 'crypto' || cryptos.includes(stockTicker) === true
    ? useEffect(() => {
        getCryptoHandle()
      }, [])
    : useEffect(() => {
        getBarsHandle()
      }, [])

  return (
    <>
      <View style={{ alignItems: 'center', marginTop: 10 }}>
        {(selectedFinalStock?.tradable == true || stockName == undefined) && (
          <>
            <View style={[styles.rowView, { width: '80%' }]}>
              <View>
                <Text style={styles.category2}>Volume</Text>
              </View>
              <View>
                {volume === 0 ? (
                  <DotIndicator color={colors.white} size={actuatedNormalize(5)} />
                ) : (
                  <Text style={styles.amount2}>{volume?.toFixed(0)}</Text>
                )}
              </View>
            </View>
            <HorizontalRule style={{ width: '80%' }} />
            <View style={[styles.rowView, { width: '80%' }]}>
              <View>
                <Text style={styles.category2}>Close Price</Text>
              </View>
              <View>
                {closePrice === 0 ? (
                  <DotIndicator color={colors.white} size={actuatedNormalize(5)} />
                ) : (
                  <Text style={styles.amount2}>$ {closePrice.toFixed(2)}</Text>
                )}
              </View>
            </View>
            <HorizontalRule style={{ width: '80%' }} />
            <View style={[styles.rowView, { width: '80%' }]}>
              <View>
                <Text style={styles.category2}>Low Price</Text>
              </View>
              <View>
                {lowPrice.toFixed(2) === 0 ? (
                  <DotIndicator color={colors.white} size={actuatedNormalize(5)} />
                ) : (
                  <Text style={styles.amount2}>$ {lowPrice.toFixed(2)}</Text>
                )}
              </View>
            </View>
            <HorizontalRule style={{ width: '80%' }} />
            <View style={[styles.rowView, { width: '80%' }]}>
              <View>
                <Text style={styles.category2}>High Price</Text>
              </View>
              <View>
                {highPrice === 0 ? (
                  <DotIndicator color={colors.white} size={actuatedNormalize(5)} />
                ) : (
                  <Text style={styles.amount2}>$ {highPrice.toFixed(2)}</Text>
                )}
              </View>
            </View>
            <HorizontalRule style={{ width: '80%' }} />
            <View style={[styles.rowView, { width: '80%' }]}>
              <View>
                <Text style={styles.category2}>Open Price</Text>
              </View>
              <View>
                {openPrice === 0 ? (
                  <DotIndicator color={colors.white} size={actuatedNormalize(5)} />
                ) : (
                  <Text style={styles.amount2}>$ {openPrice.toFixed(2)}</Text>
                )}
              </View>
            </View>
            <HorizontalRule style={{ width: '90%' }} />
          </>
        )}
        {!(stockName == undefined) && (
          <>
            <View style={{ alignSelf: 'flex-start' }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <View style={styles.columnsView}>
                  <View style={styles.rowView}>
                    <Text style={styles.category}>Exchange</Text>
                    <Text style={styles.amount}>{selectedFinalStock?.exchange}</Text>
                  </View>
                  <HorizontalRuleDouble />
                  <View style={styles.rowView}>
                    <Text style={styles.category}>Class</Text>
                    <Text style={styles.amount}>
                      {capitalize(selectedFinalStock?.class)?.replace('_', ' ')}
                    </Text>
                  </View>
                  <HorizontalRuleDouble />
                  <View style={styles.rowView}>
                    <Text style={styles.category}>Tradable</Text>
                    <Text
                      style={[
                        styles.amount,
                        {
                          color:
                            selectedFinalStock?.tradable == true ? '#9ECB90' : '#DF6662',
                        },
                      ]}>
                      {JSON.stringify(selectedFinalStock?.tradable) == 'true'
                        ? 'Yes'
                        : 'No'}
                    </Text>
                  </View>
                  <HorizontalRuleDouble />
                  <View style={styles.rowView}>
                    <Text style={styles.category}>Fractionable</Text>
                    <Text
                      style={[
                        styles.amount,
                        {
                          color:
                            selectedFinalStock?.fractionable == true
                              ? '#9ECB90'
                              : '#DF6662',
                        },
                      ]}>
                      {JSON.stringify(selectedFinalStock?.fractionable) == 'true'
                        ? 'Yes'
                        : 'No'}
                    </Text>
                  </View>
                  <HorizontalRuleDouble />
                </View>
                <View style={styles.columnsView}>
                  <View style={styles.rowView}>
                    <Text style={styles.category}>Symbol</Text>
                    <Text style={[styles.amount, { color: colors.primary2 }]}>
                      {selectedFinalStock?.symbol}
                    </Text>
                  </View>
                  <HorizontalRuleDouble />
                  <View style={styles.rowView}>
                    <Text style={styles.category}>Status</Text>
                    <Text style={[styles.amount, { color: colors.primary2 }]}>
                      {capitalize(selectedFinalStock?.status)}
                    </Text>
                  </View>
                  <HorizontalRuleDouble />
                  <View style={styles.rowView}>
                    <Text style={styles.category}>Shortable</Text>
                    <Text
                      style={[
                        styles.amount,
                        {
                          color:
                            selectedFinalStock?.shortable == true ? '#9ECB90' : '#DF6662',
                        },
                      ]}>
                      {JSON.stringify(selectedFinalStock?.shortable) == 'true'
                        ? 'Yes'
                        : 'No'}
                    </Text>
                  </View>
                  <HorizontalRuleDouble />
                  <View style={styles.rowView}>
                    <Text style={styles.category}>Marginable </Text>
                    <Text
                      style={[
                        styles.amount,
                        {
                          color:
                            selectedFinalStock?.marginable == true
                              ? '#9ECB90'
                              : '#DF6662',
                        },
                      ]}>
                      {JSON.stringify(selectedFinalStock?.marginable) == 'true'
                        ? 'Yes'
                        : 'No'}
                    </Text>
                  </View>

                  <HorizontalRuleDouble />
                </View>
              </View>
            </View>
          </>
        )}
      </View>
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
      fontSize: actuatedNormalize(12),
    },
  ],
  amount: [
    textStyles.hugeRegular,
    {
      color: colors.white,
      fontSize: actuatedNormalize(12),
    },
  ],
  category2: [
    textStyles.hugeSemiBold,
    {
      color: colors.white,
      fontSize: actuatedNormalize(14),
    },
  ],
  category3: [
    textStyles.hugeSemiBold,
    {
      color: colors.white,
      width: widthPercentageToDP(90),
      fontSize: actuatedNormalize(14),
      marginBottom: heightPercentageToDP(1.5),
    },
  ],
  header: [
    textStyles.hugeSemiBold,
    {
      marginLeft: widthPercentageToDP(6),
      color: colors.white,
      fontSize: actuatedNormalize(20),
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
export { CustomExploreStats }
