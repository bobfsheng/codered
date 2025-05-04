import React, { memo } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import {
  colors,
  heightPercentageToDP,
  widthPercentageToDP,
  textStyles,
  actuatedNormalize,
  capitalize,
} from '@utils'
import { HorizontalRule } from '@components'
import { DotIndicator } from 'react-native-indicators'

const TickerInfo = memo(({ volume, closePrice, lowPrice, highPrice, openPrice }) => {
  return (
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
  amount2: [
    textStyles.hugeRegular,
    {
      color: colors.white,
      fontSize: actuatedNormalize(16),
    },
  ],
})
export { TickerInfo }
