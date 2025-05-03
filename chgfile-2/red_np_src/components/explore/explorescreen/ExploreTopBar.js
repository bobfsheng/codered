import React, { useState, useEffect, useCallback, memo } from 'react'
import {
  View,
  Text,
  StyleSheet,
} from 'react-native'
import {
  actuatedNormalize,
  colors,
  heightPercentageToDP,
  textStyles,
  widthPercentageToDP,
} from '@utils'
import {
  BackChevron,
  Icon,
} from '@components'


const ExploreTopBar = memo(
  ({
    stockTicker,
    addWatchlistBool,
    handleShare,
    handleRemoveFromWatchList,
    handleAddToWatchList,
  }) => {
    return (
      <>
        <View style={styles.topBar}>
          <View style={styles.topBarBackChevron}>
            <BackChevron />
          </View>
          <Text numberOfLines={1} style={styles.topBarTitle}>
            {stockTicker}
            {'  '}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              marginVertical: 5,
              marginRight: widthPercentageToDP(4),
            }}>
            <Icon
              type="Ionicons"
              name={addWatchlistBool ? 'checkmark-circle-sharp' : 'add-circle'}
              size={widthPercentageToDP(6.5)}
              color="white"
              style={{ marginHorizontal: 5 }}
              onPress={() => {
                addWatchlistBool ? handleRemoveFromWatchList() : handleAddToWatchList()
              }}
            />

            <Icon
              type="Feather"
              name="share"
              size={widthPercentageToDP(6)}
              color="white"
              onPress={handleShare}
              style={{ marginHorizontal: 5 }}
            />
          </View>
        </View>
      </>
    )
  },
)
const styles = StyleSheet.create({
  topBar: { flexDirection: 'row' },
  topBarBackChevron: {
    flex: 1,
  },
  topBarTitle: [
    textStyles.bigMedium,
    {
      color: colors.white,
      marginTop: heightPercentageToDP(0.5),
      fontSize: actuatedNormalize(17),
      maxWidth: widthPercentageToDP(40),
    },
  ],
})
export { ExploreTopBar }
