import React, { memo } from 'react'
import { View, ScrollView, Text, Pressable, StyleSheet } from 'react-native'
import {
  actuatedNormalize,
  colors,
  heightPercentageToDP,
  textStyles,
  widthPercentageToDP,
} from '@utils'
import { NavigationService } from '@navigation'

const CustomPositionAssetsTwo = memo(({ positions }) => {
  return (
    <View style={styles.mainContainer}>
      {positions.length > 0 ? (
        <ScrollView
          style={{ marginBottom: heightPercentageToDP(1) }}
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}>
          <View style={styles.headerBarContainer}>
            <Text style={styles.heading}>{'Positions'}</Text>
            <Text style={styles.heading}>{'P&L'}</Text>
            <Text style={styles.heading}>{'Qty'}</Text>
            <Text style={styles.heading}>{'Total'}</Text>
          </View>

          {positions &&
            positions.map((position, index) => (
              <Pressable
                key={index}
                onPress={() =>
                  NavigationService.navigate('OrderAndPositionTopTab', {
                    screen: 'PositionScreen',
                  })
                }>
                <View
                  style={{
                    height: heightPercentageToDP(5),
                  }}>
                  <View style={styles.informationContainer}>
                    <Text
                      style={[
                        textStyles.normalSemiBold,
                        { color: 'white', fontSize: actuatedNormalize(14) },
                      ]}>
                      {position.symbol}
                    </Text>

                    <Text
                      style={[
                        textStyles.normalBold,
                        {
                          color: position.unrealized_pl < 0 ? '#EB5757' : '#78AC43',
                          fontSize: actuatedNormalize(13),
                        },
                      ]}>
                      $ {parseFloat(position?.unrealized_pl)?.toFixed(0)}
                    </Text>
                    <Text
                      style={[
                        textStyles.normalRegular,
                        { color: 'white', fontSize: actuatedNormalize(12) },
                      ]}>
                      {isNaN(position?.qty) || position?.qty == null
                        ? '$ ' + parseFloat(position?.notional)?.toFixed(0)
                        : parseFloat(position?.qty)?.toFixed(0)}
                    </Text>
                    <Text
                      style={[
                        textStyles.normalSemiBold,
                        { color: 'white', fontSize: actuatedNormalize(12) },
                      ]}>
                      ${' '}
                      {Math.abs((position?.qty * position?.avg_entry_price)?.toFixed(0))}
                    </Text>
                  </View>
                </View>
              </Pressable>
            ))}
        </ScrollView>
      ) : (
        <View style={{ flexDirection: 'column', paddingTop: heightPercentageToDP(5) }}>
          <Pressable
            onPress={() =>
              NavigationService.navigate('Invest', {
                screen: 'InvestTab',
                params: {
                  easy: false,
                },
              })
            }>
            <Text
              style={[
                textStyles.normalSemiBold,
                {
                  color: 'white',
                  width: widthPercentageToDP(90),
                  textAlign: 'center',
                  marginTop: heightPercentageToDP(0.7),
                  // alignSelf:'center',
                  // alignItems:'center',
                  // justifyContent:'center',
                },
              ]}>
              You don't own any stocks or assets yet.
            </Text>
            <View style={{ flexDirection: 'row' }}>
              <Text
                style={[
                  textStyles.normalSemiBold,
                  {
                    color: 'white',
                    marginTop: heightPercentageToDP(0.7),
                    textAlign: 'center',
                  },
                ]}>
                {'            '}You can start investing
              </Text>

              <Text
                textDecorationLine={true}
                style={[
                  textStyles.normalSemiBold,
                  {
                    color: 'white',
                    textAlign: 'center',
                    marginTop: heightPercentageToDP(0.7),
                    justifyContent: 'center',
                    textDecorationLine: 'underline',
                  },
                ]}>
                {' '}
                here!
              </Text>
              <Text
                textDecorationLine={true}
                style={[
                  textStyles.normalSemiBold,
                  {
                    color: 'white',
                    textAlign: 'center',
                  },
                ]}>
                {' '}
                🔥
              </Text>
            </View>
          </Pressable>
        </View>
      )}
    </View>
  )
})
const styles = StyleSheet.create({
  mainContainer: {
    borderWidth: widthPercentageToDP(0.3),
    borderColor: colors.white,
    marginTop: widthPercentageToDP(2),
    paddingVerical: heightPercentageToDP(1),
    backgroundColor: colors.darkBackground,
    height: heightPercentageToDP(17),
    width: widthPercentageToDP(90),
    marginLeft: widthPercentageToDP(5),
    borderRadius: heightPercentageToDP(2),
  },
  headerBarContainer: {
    flexDirection: 'row',
    paddingHorizontal: widthPercentageToDP(5),
    justifyContent: 'space-between',
  },
  heading: [
    textStyles.normalMedium,
    {
      color: '#79767D',
      fontSize: actuatedNormalize(13),
      marginTop: widthPercentageToDP(4),
    },
  ],
  informationContainer: {
    marginTop: heightPercentageToDP(2),
    flexDirection: 'row',
    paddingHorizontal: widthPercentageToDP(5),
    justifyContent: 'space-between',
  },
})
export { CustomPositionAssetsTwo }
