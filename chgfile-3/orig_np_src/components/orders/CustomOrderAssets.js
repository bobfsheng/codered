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

const CustomOrderAssets = memo(({ orders }) => {
  return (
    <View style={styles.mainContainer}>
      {orders.length > 0 ? (
        <ScrollView
          style={{ marginBottom: heightPercentageToDP(1) }}
          nestedScrollEnabled={true}>
          <View style={styles.headerBarContainer}>
            <Text style={styles.heading}>{'Orders'}</Text>
            <Text style={styles.heading}>{'Amount'}</Text>
            <Text style={styles.heading}>{'Side'}</Text>
          </View>

          {orders &&
            orders?.map((order, index) => (
              <Pressable
                key={index}
                onPress={() =>
                  NavigationService.navigate('OrderAndPositionTopTab', {
                    screen: 'OrderScreen',
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
                      {order?.symbol}
                    </Text>

                    <Text
                      style={[
                        textStyles.normalRegular,
                        { color: 'white', fontSize: actuatedNormalize(12) },
                      ]}>
                      {' '}
                      {isNaN(order?.qty) || order?.qty == null
                        ? '$ ' + parseFloat(order?.notional)?.toFixed(0)
                        : parseFloat(order?.qty)?.toFixed(0)}
                    </Text>
                    <Text
                      style={[
                        textStyles.normalSemiBold,
                        {
                          color: 'white',
                          fontSize: actuatedNormalize(12),
                          marginTop: heightPercentageToDP(0),
                        },
                      ]}>
                      {order?.side?.toUpperCase()}
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
                  easy: true,
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
                },
              ]}>
              You currently don't have any active orders.
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
                {'            '}You can place an order
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
                🏆
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
    paddingHorizontal: widthPercentageToDP(5),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})
export { CustomOrderAssets }
