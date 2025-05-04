import React, { memo, useEffect } from 'react'
import { View, Image, Text, StyleSheet } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import firestore from '@react-native-firebase/firestore'
import moment from 'moment'
import { NavigationService } from '@navigation'
import {
  actuatedNormalize,
  heightPercentageToDP,
  textStyles,
  widthPercentageToDP,
} from '@utils'
const sell = require('@assets/images/orders/sell.png')
const buy = require('@assets/images/orders/buy.png')
const profit = require('@assets/images/orders/profit.png')

const NotificationBubble = memo(({ notification }) => {
  const {
    id,
    createdAt,
    notficationType,
    seen,
    qty,
    side,
    status,
    symbol,
    updated_at,
    amount,
    notional,
  } = notification
  const updateSeen = async () => {
    await firestore().collection('Notifications').doc(id).update({
      seen: true,
    })
  }
  useEffect(() => {
    if (seen) return
    updateSeen()
  }, [])
  return (
    <TouchableOpacity
      onPress={() =>
        NavigationService.navigate('Invest', {
          screen: 'InvestTab',
          params: {
            stockTicker: symbol,
          },
        })
      }>
      <View
        style={{
          backgroundColor: '#F6F6F6',
          height: heightPercentageToDP(10),
          width: '95%',
          alignSelf: 'center',
          marginVertical: heightPercentageToDP(1),
          borderRadius: 5,
          alignItems: 'center',
          alignSelf: 'center',
          alignContent: 'center',
          flexDirection: 'row',
        }}>
        <View
          style={{
            marginHorizontal: widthPercentageToDP(4),
          }}>
          {notficationType === 'orderFilled' ? (
            <Image source={side === 'buy' ? buy : sell} style={styles.orderCardIcon} />
          ) : (
            <Image source={profit} style={styles.orderCardIcon} />
          )}
        </View>
        <View>
          <Text
            style={[
              textStyles.smallBold,
              {
                color: 'black',
                width: widthPercentageToDP(75),
                fontSize: actuatedNormalize(12),
                marginBottom: heightPercentageToDP(0.7),
              },
            ]}>
            {notficationType === 'moneyDaily'
              ? amount > 0
                ? `You made a profit!`
                : `You closed at a loss.`
              : notficationType === 'orderFilled' && `Your ${symbol} order was ${status}`}
          </Text>
          <Text
            style={[
              textStyles.smallMedium,
              { color: 'black', width: widthPercentageToDP(75) },
            ]}>
            {notficationType === 'moneyDaily'
              ? amount > 0
                ? `You made $${(amount * 2 * 0.9)?.toFixed(2)} on ${moment(
                    createdAt,
                  ).calendar()}`
                : `You lost $${amount?.toFixed(2)} on ${moment(createdAt).calendar()}`
              : notficationType === 'orderFilled' && (qty == undefined) | (qty == null)
              ? `Your ${side} order of ${notional} of ${symbol} was ${status} on ${moment(
                  updated_at,
                ).calendar()}`
              : `Your ${side} order of ${qty} stocks of ${symbol} was ${status} on ${moment(
                  updated_at,
                ).calendar()}`}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
})
const styles = StyleSheet.create({
  orderCardIcon: {
    resizeMode: 'contain',
    height: heightPercentageToDP(11),
    width: widthPercentageToDP(11),
  },
})
export { NotificationBubble }
