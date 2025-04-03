import React, { memo } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import {
  colors,
  heightPercentageToDP,
  widthPercentageToDP,
  textStyles,
  actuatedNormalize,
} from '@utils'
import { TouchableOpacity } from 'react-native-gesture-handler'

const CustomExploreChartBar = memo(({ selectedGraphList, setSelectedGraphList }) => {
  const graphsList = ['1W', '1M', '1Y', 'ALL']

  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'space-evenly',
        }}>
        {graphsList.map((item, index) => {
          return (
            <TouchableOpacity
              style={{
                backgroundColor: item === selectedGraphList ? '#9ECB90' : 'transparent',
                width: widthPercentageToDP(17),
                height: heightPercentageToDP(4),
                borderRadius: widthPercentageToDP(1),
                alignItems: 'center',
                alignContent: 'center',
                justifyContent: 'center',
              }}
              key={index}
              onPress={() => {
                setSelectedGraphList(item)
              }}>
              <Text
                style={[
                  textStyles.normalBold,
                  {
                    color: item === selectedGraphList ? 'white' : 'gray',
                  },
                ]}>
                {item}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>
    </>
  )
})
const styles = StyleSheet.create({
  positionCard: {
    flexDirection: 'column',
    alignItems: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    paddingVertical: heightPercentageToDP(1),
    width: widthPercentageToDP(35),
    borderRadius: heightPercentageToDP(1),
    borderWidth: widthPercentageToDP(0.7),
    borderColor: colors.primary,
    marginHorizontal: widthPercentageToDP(1.5),
  },
  symbol: [
    textStyles.normalSemiBold,
    {
      color: 'white',
      fontSize: actuatedNormalize(16),
      paddingHorizontal: widthPercentageToDP(3),
      alignContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      justifyContent: 'center',
    },
  ],
})
export { CustomExploreChartBar }
