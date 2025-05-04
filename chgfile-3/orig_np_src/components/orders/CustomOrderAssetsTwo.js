import React, { memo, useState } from 'react'
import {
  capitalize,
  heightPercentageToDP,
  textStyles,
  widthPercentageToDP,
  colors,
  cancelOrderFirestore
} from '@utils'
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  ActivityIndicator,
  Platform,
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import firestore from '@react-native-firebase/firestore'
import { cancelOrderWithId, useReduxDispatch, useAuthSelector } from '@store'
const sell = require('@assets/images/orders/sell.png')
const buy = require('@assets/images/orders/buy.png')
const vertical3dots = require('@assets/images/vertical-3dots.png')
const CustomOrderAssetsTwo = memo(({ order, handleRefresh }) => {
  const dispatch = useReduxDispatch()
  const [selectedOrder, setSelectedOrder] = useState('')
  const [loading, setLoading] = useState(false)
    const { userId } = useAuthSelector(state => state)

const handleCancelOrder = async () => {
 try {
    await cancelOrderFirestore(userId, selectedOrder)
    const pendingOrderRef = firestore().collection('PendingOrders').doc(selectedOrder)

    const pendingOrderSnapshot = await pendingOrderRef.get()
    if (pendingOrderSnapshot.exists) {
      await pendingOrderRef.delete()
    } else {
      console.warn(`Pending order ${selectedOrder} not found.`)
    }

    // Update UI state
    setLoading(true)
    dispatch(cancelOrderWithId(selectedOrder))
    setSelectedOrder('')
    handleRefresh()
  } catch (error) {
    console.error('Error canceling order:', error.message)
  } finally {
    setLoading(false)
  }
}

  return (
    <>
      {loading == true ? (
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.3)',
          }}>
          <ActivityIndicator size="small" color={colors.primary2} />
        </View>
      ) : (
        <Pressable
          onPress={() => {
            setSelectedOrder(selectedOrder ? '' : order?.id)
          }}>
          <LinearGradient colors={['#EEEEEE', '#B4D0B2']} style={styles.orderCard}>
            <Image
              source={order?.side === 'buy' ? buy : sell}
              style={styles.orderCardIcon}
            />
            <View>
              <Text style={[textStyles.normalSemiBold, { color: 'black' }]}>
                {capitalize(order?.side)} Status - {capitalize(order?.status)}
              </Text>
              <Text style={[textStyles.normalRegular, { color: 'black' }]}>
                {isNaN(order?.qty) || order?.qty == null
                  ? '$ ' + order?.notional
                  : order?.qty}
                {isNaN(order?.qty) || order?.qty == null ? ' dollars of ' : ' shares of '}
                {order?.symbol}
              </Text>
            </View>
            <Pressable
              onPress={() => {
                setSelectedOrder(selectedOrder ? '' : order?.id)
              }}>
              <Image source={vertical3dots} style={styles.orderCardDots} />
            </Pressable>
          </LinearGradient>
        </Pressable>
      )}
      {selectedOrder && (
        <View style={styles.orderCardOptions}>
          <Pressable
            style={[
              styles.orderOption,
              {
                backgroundColor: 'black',
                borderColor: 'white',
                borderWidth: heightPercentageToDP(0.2),
              },
            ]}
            onPress={() => handleCancelOrder()}>
            <Text style={[textStyles.normalSemiBold, { color: 'white' }]}>
              Cancel Order
            </Text>
          </Pressable>
          <Pressable
            style={[styles.orderOption, { backgroundColor: 'white' }]}
            onPress={() => setSelectedOrder('')}>
            <Text style={[textStyles.normalSemiBold, { color: 'black' }]}>
              Keep Order
            </Text>
          </Pressable>
        </View>
      )}
    </>
  )
})
const styles = StyleSheet.create({
  orderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'space-between',
    paddingLeft: '5%',
    paddingRight: '7%',
    height: 100,
    width: '90%',
    borderRadius: heightPercentageToDP(Platform.isPad !== true ? 1.5 : 0.5),
    backgroundColor: '#1F1C1B',
    marginBottom: 18,
  },
  orderCardIcon: {
    resizeMode: 'contain',
    height: heightPercentageToDP(Platform.isPad !== true ? 15 : 8),
    width: widthPercentageToDP(Platform.isPad !== true ? 15 : 8),
  },
  orderCardDots: {
    resizeMode: 'contain',
    height: '20%',
    color: 'black',
  },
  orderCardOptions: {
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'space-between',
    width: '90%',
    borderRadius: 30,
    marginBottom: 25,
  },
  orderOption: {
    borderRadius: 30,
    width: '47%',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
export { CustomOrderAssetsTwo }
