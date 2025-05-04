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
import { HorizontalRuleDouble } from '@components'

const StockPrices = memo(({ selectedFinalStock }) => {
  return (
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
                    color: selectedFinalStock?.tradable == true ? '#9ECB90' : '#DF6662',
                  },
                ]}>
                {JSON.stringify(selectedFinalStock?.tradable) == 'true' ? 'Yes' : 'No'}
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
                      selectedFinalStock?.fractionable == true ? '#9ECB90' : '#DF6662',
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
                    color: selectedFinalStock?.shortable == true ? '#9ECB90' : '#DF6662',
                  },
                ]}>
                {JSON.stringify(selectedFinalStock?.shortable) == 'true' ? 'Yes' : 'No'}
              </Text>
            </View>
            <HorizontalRuleDouble />
            <View style={styles.rowView}>
              <Text style={styles.category}>Marginable </Text>
              <Text
                style={[
                  styles.amount,
                  {
                    color: selectedFinalStock?.marginable == true ? '#9ECB90' : '#DF6662',
                  },
                ]}>
                {JSON.stringify(selectedFinalStock?.marginable) == 'true' ? 'Yes' : 'No'}
              </Text>
            </View>

            <HorizontalRuleDouble />
          </View>
        </View>
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
  amount2: [
    textStyles.hugeRegular,
    {
      color: colors.white,
      fontSize: actuatedNormalize(16),
    },
  ],
})
export { StockPrices }
