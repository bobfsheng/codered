import React, { useState } from 'react'
import {
  StyleSheet,
  Keyboard,
  Pressable,
  View,
  Text,
  Button,
  FlatList,
  Platform,
  RefreshControl,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native'
import { NavigationService } from '@navigation'
import LinearGradient from 'react-native-linear-gradient'
import {
  actuatedNormalize,
  colors,
  heightPercentageToDP,
  textStyles,
  widthPercentageToDP,
  capitalize,
} from '@utils'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useReduxDispatch, useAuthSelector, useUserSelector } from '@store'
import { BullBear } from '@components'
import { useGetFriends, useSearchFriends } from '@hooks'
import { stockInfo } from '@constants/stockInfo'

const BullorBear = () => {
  // Sort the stockInfo array based on marketCap
  const sortedStockInfo = [...stockInfo].sort((a, b) => {
    const marketCapA = a.info.marketCap || 0
    const marketCapB = b.info.marketCap || 0
    return marketCapB - marketCapA
  })
  

  return (
    <>
      <View style={styles.safeAreaContainer}>
        <View style={styles.mainContainer}>
          <View style={styles.topBarBackChevron}></View>
          <BullBear stocks={sortedStockInfo} />
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  safeAreaContainer: { flex: 1, backgroundColor: colors.darkBackground },
  mainContainer: {
    paddingBottom: heightPercentageToDP(13),
    // marginTop: heightPercentageToDP(Platform.isPad !== true ? 8 : 3),
  },
  
})
export { BullorBear }
