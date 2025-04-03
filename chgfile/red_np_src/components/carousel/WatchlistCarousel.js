import React, { memo } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { heightPercentageToDP, textStyles, widthPercentageToDP } from '@utils'
import { NavigationService } from '@navigation'
import Carousel from 'react-native-reanimated-carousel'

const WatchlistCarousel = memo(({ array }) => {
  const cryptos = require('@constants/cryptos.json')
  if (array && array.length < 4) {
    array = [...array, 'AAPL', 'TSLA', 'NFLX']
  }
  if (array == undefined) {
    array = ['AAPL', 'TSLA', 'NFLX', 'GOOG']
  }
  return
  <Carousel
    loop
    width={widthPercentageToDP(110)}
    height={heightPercentageToDP(5)}
    autoPlay={true}
    style={{ marginRight: heightPercentageToDP(10) }}
    data={array}
    scrollAnimationDuration={40000}
    onSnapToItem={index => null}
    renderItem={({ item, index }) => (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
        }}
        key={index} // Add a unique key prop for each item
      >
        {array.map((item, index) => (
          <TouchableOpacity
            style={styles.categoryStyle}
            key={index} // Add a unique key prop for each item
            onPress={() => {
              cryptos.includes(item) === false
                ? NavigationService.navigate('Invest', {
                    screen: 'InvestTab',
                    params: {
                      stockTicker: item,
                    },
                  })
                : NavigationService.navigate('Invest', {
                    screen: 'EasyCryptoInvestScreen',
                    params: {
                      isCrypto: 'crypto',
                    },
                  })
            }}>
            <Text
              numberOfLines={1}
              style={[
                textStyles.normalRegular,
                {
                  color: 'white',
                  marginHorizontal: widthPercentageToDP(5),
                  marginVertical: heightPercentageToDP(1),
                },
              ]}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    )}
  />
})
const styles = StyleSheet.create({
  categoryStyle: {
    borderRadius: 10,
    borderColor: '#648C38',
    borderWidth: widthPercentageToDP(0.5),
    marginHorizontal: widthPercentageToDP(2),
  },
})

export { WatchlistCarousel }
