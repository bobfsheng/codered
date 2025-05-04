import React, { useEffect, useState } from 'react'
import { View, Text, RefreshControl, StyleSheet, FlatList } from 'react-native'
import { CustomButton, CustomOrderAssetsTwo, VirtualizedView } from '@components'
import { getAccountOrders, useReduxDispatch, useUserSelector } from '@store'
import { colors, heightPercentageToDP, textStyles, widthPercentageToDP } from '@utils'
import { NavigationService } from '@navigation'

const OrderScreen = () => {
  const dispatch = useReduxDispatch()
  const [loading, setLoading] = useState(false)
  const { orders } = useUserSelector(state => state)
  const [refreshing, setRefreshing] = useState(false)
  const handleRefresh = React.useCallback(async () => {
    setRefreshing(true)
    dispatch(getAccountOrders())
    setRefreshing(false)
    setLoading(false)
  }, [])
  useEffect(() => {
    handleRefresh()
  }, [])
  const renderItem = ({ item }) => (
    <CustomOrderAssetsTwo order={item} handleRefresh={handleRefresh} />
  )

  return (
    <VirtualizedView
      style={{
        backgroundColor: colors.darkBackground,
        paddingTop: heightPercentageToDP(3),
      }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingTop: heightPercentageToDP(2),
        paddingBottom: heightPercentageToDP(3),
      }}
      refreshControl={
        <RefreshControl
          colors={[colors.offWhite]}
          tintColor={colors.offWhite}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      }>
      {orders?.length < 1 ? (
        <View>
          <Text style={styles.orderFilledText}>
            All orders have been filled. 🚀 🙌 Check Positions or History to see the
            filled orders. Or you can refresh by pulling down the screen.
          </Text>
          <View
            style={{
              alignItems: 'center',
              marginVertical: heightPercentageToDP(7),
            }}>
            <CustomButton
              primary
              onPress={() => {
                NavigationService.navigate('PositionScreen', {})
              }}
              text="Positions"
            />
            <CustomButton
              primary
              onPress={() => {
                NavigationService.navigate('History', {})
              }}
              text="History"
            />
          </View>
        </View>
      ) : (
        <>
          <FlatList
            data={orders}
            extraData={orders}
            renderItem={renderItem}
            initialNumToRender={10}
            contentContainerStyle={{ alignItems: 'center' }}
            refreshControl={
              <RefreshControl
                colors={[colors.offWhite]}
                tintColor={colors.offWhite}
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            }
          />
        </>
      )}
    </VirtualizedView>
  )
}
const styles = StyleSheet.create({
  orderFilledText: [
    textStyles.bigSemiBold,
    { color: colors.offWhite, marginHorizontal: widthPercentageToDP(5) },
  ],
})
export { OrderScreen }
