import React, { useEffect, useState } from 'react'
import { ScrollView, Text, RefreshControl, StyleSheet, View } from 'react-native'
import { CustomButton, CustomPositionAssetsThree } from '@components'
import { getAccountPositions, useReduxDispatch, useUserSelector } from '@store'
import { NavigationService } from '@navigation'
import { colors, heightPercentageToDP, textStyles, widthPercentageToDP } from '@utils'
const PositionScreen = () => {
  const dispatch = useReduxDispatch()
  const {
    positions,
    accountHistory,
    cash,
    long_market_value,
    buying_power,
    daytrade_count,
    pattern_day_trader,
  } = useUserSelector(state => state)
  const [refreshing, setRefreshing] = useState(false)
  const handleRefresh = React.useCallback(async () => {
    setRefreshing(true)
    dispatch(getAccountPositions())

    setRefreshing(false)
  }, [])
  useEffect(() => {
    handleRefresh()
  }, [])
  return (
    <ScrollView
      style={{
        backgroundColor: colors.darkBackground,
        paddingTop: heightPercentageToDP(3),
      }}
      nestedScrollEnabled={true}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ alignItems: 'center' }}
      refreshControl={
        <RefreshControl
          colors={[colors.offWhite]}
          tintColor={colors.offWhite}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      }>
      <View style={{ marginBottom: heightPercentageToDP(6) }}>
        {positions?.length < 1 && (
          <View>
            <Text style={styles.orderFilledText}>
              You currently don't own any stocks. When you buy stocks or equity they will
              appear here. 🚀 🙌
            </Text>
            <View
              style={{
                alignItems: 'center',
                marginVertical: heightPercentageToDP(7),
              }}>
              <CustomButton
                primary
                onPress={() =>
                  NavigationService.navigate('Invest', {
                    screen: 'InvestTab',
                    params: {
                      easy: false,
                    },
                  })
                }
                text="Invest"
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
        )}
        {positions &&
          positions.map((position, index) => (
            <CustomPositionAssetsThree
              position={position}
              key={index}
              containerStyle={{ width: widthPercentageToDP(90) }}
            />
          ))}
      </View>
    </ScrollView>
  )
}
const styles = StyleSheet.create({
  orderFilledText: [
    textStyles.bigSemiBold,
    { color: colors.offWhite, marginHorizontal: widthPercentageToDP(5) },
  ],
})

export { PositionScreen }
