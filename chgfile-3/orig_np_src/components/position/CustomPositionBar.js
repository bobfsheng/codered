import React, { memo } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import {
  heightPercentageToDP,
  textStyles,
  widthPercentageToDP,
  actuatedNormalize,
} from '@utils'

const CustomPositionBar = memo(
  ({ positionAmount, stockTicker, positionPrice, positionPL }) => {
    return (
      <View style={styles.topBarContainer}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <Text
            numberOfLines={1}
            style={[
              textStyles.bigRegular,
              {
                color: 'white',
                fontSize:
                  parseFloat(positionAmount)?.toFixed(2) > 4
                    ? actuatedNormalize(15)
                    : actuatedNormalize(16),
                width: widthPercentageToDP(80),
                marginTop: '2%',
              },
            ]}>
            {parseFloat(Math.abs(positionAmount))?.toFixed(2) > 4
              ? parseFloat(Math.abs(positionAmount))?.toFixed(0)
              : parseFloat(Math.abs(positionAmount))?.toFixed(2)}{' '}
            shares of {stockTicker} at $ {parseFloat(positionPrice)?.toFixed(2)}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            marginTop: heightPercentageToDP('1'),
          }}>
          <Text
            style={[
              textStyles.normalRegular,
              {
                color: 'white',
                fontSize:
                  parseFloat(positionAmount)?.toFixed(2) > 4
                    ? actuatedNormalize(15)
                    : actuatedNormalize(16),
                marginLeft: widthPercentageToDP(0),
              },
            ]}>
            P&L $ {parseFloat(positionPL)?.toFixed(0)}
          </Text>
          <Text
            style={[
              textStyles.normalRegular,
              {
                color: 'white',
                fontSize:
                  parseFloat(positionAmount)?.toFixed(2) > 4
                    ? actuatedNormalize(15)
                    : actuatedNormalize(16),
                marginLeft: widthPercentageToDP(0),
              },
            ]}>
            Total $ {(parseFloat(positionPrice) * Math.abs(positionAmount))?.toFixed(0)}
          </Text>
        </View>
      </View>
    )
  },
)

const styles = StyleSheet.create({
  topBarContainer: {
    marginTop: widthPercentageToDP(1),
    marginBottom: heightPercentageToDP(10),
    backgroundColor: '#212121',
    height: heightPercentageToDP(10),
    width: widthPercentageToDP(90),
    borderRadius: heightPercentageToDP(1),
    justifyContent: 'center',
    alignSelf: 'center',
  },
  topBarRow: {
    flexDirection: 'row',
    marginHorizontal: widthPercentageToDP(5),
    marginVertical: 5,
  },
  topBarRowText: [
    textStyles.bigRegular,
    {
      color: 'white',
      fontSize: actuatedNormalize(16),
    },
  ],
})
export { CustomPositionBar }
