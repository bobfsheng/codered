import React, { memo, useEffect } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import {
  RefreshControl,
  View,
  StyleSheet,
  Text,
  FlatList,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from 'react-native'
import { NavigationService } from '@navigation'
import { getAccountActivities, useReduxDispatch, useUserSelector } from '@store'
import {
  actuatedNormalize,
  capitalize,
  colors,
  heightPercentageToDP,
  textStyles,
  widthPercentageToDP,
} from '@utils'

const sell = require('@assets/images/orders/sell.png')
const buy = require('@assets/images/orders/buy.png')

const History = () => {
  const formatValue = value => {
    if (!value) return
    return value
      ?.toFixed(2)
      ?.toString()
      ?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }
  const dispatch = useReduxDispatch()
  const { activities } = useUserSelector(state => state)
  const [refreshing, setRefreshing] = React.useState(false)
  const onRefresh = React.useCallback(() => {
    setRefreshing(true)
    dispatch(getAccountActivities())
    setTimeout(() => {
      setRefreshing(false)
    }, 500)
  }, [])

  useEffect(() => {
    onRefresh()
  }, [])

  const ActivityList = memo(({ item }) => {
    
    return (
      <TouchableOpacity
        onPress={() =>
          NavigationService.navigate('Invest', {
            screen: 'InvestTab',
            params: {
              stockTicker: item?.symbol,
            },
          })
        }>
        <LinearGradient colors={['#EEEEEE', '#B4D0B2']} style={styles.positionCard}>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            <Image
              source={item.side === 'buy' ? buy : sell}
              style={styles.orderCardIcon}
            />
            <View
              style={{
                flexDirection: 'column',
                marginLeft: widthPercentageToDP(5),
              }}>
              <Text
                style={[
                  textStyles.normalBold,
                  {
                    color: item?.order_status === 'filled' ? '#78C62A' : '#4AC6D7',
                    fontSize: actuatedNormalize(14),
                    marginLeft: widthPercentageToDP(0),
                    width: widthPercentageToDP(67),
                  },
                ]}>
                {capitalize(item?.side)} {item?.symbol}
                {' Order - '}
                {capitalize(item?.order_status)?.replace('_', ' ')}
              </Text>
              <Text
                style={[
                  textStyles.normalSemiBold,
                  {
                    color: 'black',
                    fontSize: actuatedNormalize(12),
                    marginTop: heightPercentageToDP(1),
                    marginRight: widthPercentageToDP(0),
                  },
                ]}>
                Quantity: {parseFloat(item?.qty)?.toFixed(3)}{' '}
              </Text>
              <Text
                style={[
                  textStyles.normalSemiBold,
                  {
                    color: 'black',
                    fontSize: actuatedNormalize(12),
                    marginRight: widthPercentageToDP(0),
                  },
                ]}>
                Price: $ {formatValue(parseFloat(item?.price))}
              </Text>
              <Text
                style={[
                  textStyles.normalSemiBold,
                  {
                    color: 'black',
                    fontSize: actuatedNormalize(12),
                    marginRight: widthPercentageToDP(0),
                  },
                ]}>
                {capitalize(item?.order_status)?.replace('_', ' ')} at{' '}
                {new Date(item?.transaction_time)?.getMonth() + 1}/
                {new Date(item?.transaction_time)?.getDate()}/
                {new Date(item?.transaction_time)?.getFullYear()}{' '}
                {new Date(item?.transaction_time)?.getHours()}:
                {new Date(item?.transaction_time)?.getMinutes().toString().length < 2
                  ? `0` + new Date(item?.transaction_time)?.getMinutes()
                  : new Date(item?.transaction_time)?.getMinutes()}
              </Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    )
  })
  const renderItem = ({ item }) => <ActivityList item={item} />
  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.topBar}>
        <View style={{ flex: 1, marginTop: heightPercentageToDP(2) }} />
      </View>
      <FlatList
        data={activities.filter(activity => activity?.side)}
        renderItem={renderItem}
        initialNumToRender={10}
        contentContainerStyle={{ alignItems: 'center' }}
        refreshControl={
          <RefreshControl
            colors={[colors.offWhite]}
            tintColor={colors.offWhite}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeAreaView: {
    backgroundColor: colors.darkBackground,
    paddingBottom: heightPercentageToDP(3),
    flex: 1,
  },
  topBar: { flexDirection: 'row' },
  topBarBackChevron: {
    flex: 1,
  },
  topBatTitle: { flex: 4, justifyContent: 'center', alignItems: 'center' },
  positionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: heightPercentageToDP(15),
    width: widthPercentageToDP(90),
    borderRadius: heightPercentageToDP(1),
    borderWidth: widthPercentageToDP(0.15),

    borderColor: 'black',
    backgroundColor: '#1F1C1B',
    marginBottom: heightPercentageToDP(2),
  },
  orderCardIcon: {
    resizeMode: 'contain',
    height: heightPercentageToDP(10),
    width: widthPercentageToDP(13),
    marginLeft: widthPercentageToDP(4),
  },
})

export { History }
