import React, { memo } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import Carousel from 'react-native-reanimated-carousel'
import {
  heightPercentageToDP,
  widthPercentageToDP,
  actuatedNormalize,
  capitalize,
} from '@utils'
import { NavigationService } from '@navigation'
import { useAuthSelector } from '@store'

const TickerItem = memo(({ symbol, currentPrice }) => {
   const handleNavigation = React.useCallback(
     screen => {
       NavigationService.navigate(screen, {
         stockTicker: symbol,
       })
     },
     [symbol],
   ) 

  return (
    <View style={styles.tickerItem}>
      <TouchableOpacity onPress={() => handleNavigation('ExploreScreen')}>
        <Text style={styles.tickerText}>
          {capitalize(symbol)} ${parseFloat(currentPrice).toFixed(2)}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleNavigation('InvestTab')}>
        <Text style={styles.buyText}>{'  '}Buy</Text>
      </TouchableOpacity>
    </View>
  )
})

const CustomTickerCarousel = memo(({ array }) => {
  const { isLoggedIn } = useAuthSelector(state => state)

   return (
    <Carousel
      loop
      width={widthPercentageToDP(isLoggedIn ? 56 : 90)}
      height={heightPercentageToDP(5)}
      autoPlay={true}
      data={array}
      scrollAnimationDuration={5000}
      onSnapToItem={() => null}
      renderItem={({ index }) => (
        <TickerItem
          key={array[index]?.symbol}
          symbol={array[index]?.symbol}
          currentPrice={array[index]?.current_price}
        />
      )}
    />
  )
})

const styles = StyleSheet.create({
  tickerItem: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tickerText: {
    fontSize: actuatedNormalize(18),
    textAlign: 'center',
    color: 'white',
  },
  buyText: {
    fontSize: actuatedNormalize(18),
    textAlign: 'center',
    color: '#BADF7F',
  },
})

export { CustomTickerCarousel }