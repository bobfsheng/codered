import React, { memo } from 'react'
import { View, Text, StyleSheet, Pressable } from 'react-native'
import { Icon } from '@components'
import {
  actuatedNormalize,
  colors,
  heightPercentageToDP,
  textStyles,
  widthPercentageToDP,
} from '@utils'
const sell = require('@assets/images/orders/sell.png')
const buy = require('@assets/images/orders/buy.png')
const profit = require('@assets/images/orders/profit.png')

const NotificationBetPopup = memo(({}) => {
  const opponentUserName = 'Jake'
  const time = 'March 15th'
  const amount = 14

  return (
    <>
      <View
        style={{
          backgroundColor: '#F6F6F6',
          alignSelf: 'center',
          width: '85%',
          marginVertical: heightPercentageToDP(1),
          borderRadius: 5,
        }}>
        <Icon
          type="Ionicons"
          name={'close'}
          size={widthPercentageToDP(4.5)}
          color="black"
          onPress={() => setFeedBoxModal(prev => !prev)}
          style={{
            paddingTop: widthPercentageToDP(4),
            paddingRight: widthPercentageToDP(4),
            alignSelf: 'flex-end',
          }}
        />
        <View
          style={{
            paddingVertical: heightPercentageToDP(3),
            alignItems: 'center',
            alignSelf: 'center',
            alignContent: 'center',
            justifyContent: 'center',
          }}>
          {/* <View
          style={{
            marginHorizontal: widthPercentageToDP(4),
          }}>
        {opponentUserEmoji !== undefined ? <View style={{ alignContent: 'center',
                    alignItems: 'center',
                    justifyContent: 'center',marginHorizontal: widthPercentageToDP(1),backgroundColor:'#B2D0CE', width:widthPercentageToDP(14), height:widthPercentageToDP(14), borderRadius:widthPercentageToDP(30)}}><Text
                style={
                  {
                    fontSize: actuatedNormalize(22),
                    color: 'white',
                    margin:widthPercentageToDP(0.5),
                    alignSelf: 'center',
                  }
                  
                }>{opponentUserEmoji}</Text></View> : <Image source={hrocket} style={styles.image} />}
        </View> */}
          <View>
            <Text
              style={[
                textStyles.smallBold,
                {
                  textAlign: 'center',
                  color: 'black',
                  width: widthPercentageToDP(75),
                  fontSize: actuatedNormalize(12),
                  marginBottom: heightPercentageToDP(3),
                },
              ]}>
              <Text
                // textDecorationLine='underline'
                style={[
                  textStyles.smallBold,
                  {
                    color: colors.primary,
                    fontSize: actuatedNormalize(12),
                    textDecorationLine: 'underline',
                  },
                ]}>
                {opponentUserName}
              </Text>{' '}
              challenged you for{' '}
              <Text
                style={[
                  textStyles.smallBold,
                  { color: colors.primary, fontSize: actuatedNormalize(12) },
                ]}>
                ${amount}.
              </Text>{' '}
              Whoever makes more profit in {time} wins! Challenged on
            </Text>
          </View>
          <View style={styles.orderCardOptions}>
            <Pressable
              style={[
                styles.orderOption,
                {
                  borderColor: 'black',
                  borderWidth: heightPercentageToDP(0.1),
                  backgroundColor: 'white',
                },
              ]}
              onPress={() => setSelectedOrder('')}>
              <Text style={[textStyles.normalSemiBold, { color: 'black' }]}>Accept</Text>
            </Pressable>
            <Pressable
              style={[
                styles.orderOption,
                {
                  backgroundColor: 'black',
                },
              ]}
              onPress={() => handleCancelOrder()}>
              <Text style={[textStyles.normalSemiBold, { color: 'white' }]}>Deny</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </>
  )
})
const styles = StyleSheet.create({
  orderCardIcon: {
    resizeMode: 'contain',
    height: heightPercentageToDP(11),
    width: widthPercentageToDP(11),
  },
  orderCardOptions: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'space-around',
    width: '90%',
    borderRadius: 30,
    // marginBottom: 25,
  },
  orderOption: {
    borderRadius: 30,
    width: '47%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
export { NotificationBetPopup }
