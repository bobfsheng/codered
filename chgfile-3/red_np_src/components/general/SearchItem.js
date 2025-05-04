import React, { useContext } from 'react'
import AssetsContext from 'redvest/contexts/AssetsContext'
import { View, Text, Pressable, StyleSheet } from 'react-native'
i
import _ from 'lodash'

// TODO: pass the props
function SearchItem({ item, onPress }) {
  const { stockTickers: assets } = useContext(AssetsContext)

  let currentStockPrice = 0,
    preClosePrice = 0
  let priceDif = 0,
    percentage = 0

  try {
    if (assets) {
      assets.map(assetItem => {
        if (assetItem.symbol === item.symbol) {
          currentStockPrice = assetItem.todayBar.o
          preClosePrice = assetItem.preBar.c
          priceDif = currentStockPrice - preClosePrice
          percentage = convert(((priceDif / preClosePrice) * 100)?.toFixed(2), true)
        }
      })
    }

    return (
      <Pressable style={style} activeOpacity={0.9} onPress={onPress}>
        <View style={styles.rowContainer}>
          <View style={{ alignSelf: 'center' }}>
            <Text style={symbolStyle}>{item.symbol}</Text>
          </View>
          <View style={styles.valueContainer}>
            <Text style={stockPriceStyle}>${formatValue(currentStockPrice)}</Text>
            <Text style={plStyle}>{`${convert(priceDif)} (${percentage})`}</Text>
          </View>
          <View style={styles.separator} />
        </View>
      </Pressable>
    )
  } catch (e) {
    return null
  }
}

const styles = StyleSheet.create({})

export default SearchItem
