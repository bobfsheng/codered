import React, { memo } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import {
  actuatedNormalize,
  colors,
  heightPercentageToDP,
  textStyles,
  widthPercentageToDP,
} from '@utils'
import { NavigationService } from '@navigation'

const CustomAssetsExplore = memo(({ position, containerStyle }) => {
  return (
    <View style={{ flexDirection: 'row' }}>
      <LinearGradient
        colors={['#EEEEEE', '#B4D0B2']}
        style={[styles.positionCard, containerStyle]}>
        <TouchableOpacity
          onPress={() =>
            NavigationService.navigate('Invest', {
              screen: 'InvestTab',
              params: {
                stockTicker: position.symbol,
              },
            })
          }>
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              alignContent: 'center',
              alignSelf: 'center',
              justifyContent: 'center',
              // marginLeft: widthPercentageToDP(5),
            }}>
            <Text
              style={[
                textStyles.normalSemiBold,
                {
                  color: colors.darkBackground,
                  fontSize: actuatedNormalize(17),
                },
              ]}>
              {position.symbol}
            </Text>
            <Text
              style={[
                textStyles.normalSemiBold,
                {
                  color: colors.darkBackground,
                  fontSize: actuatedNormalize(17),
                },
              ]}>
              $ {position.current_price}
            </Text>
          </View>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  )
})
const styles = StyleSheet.create({
  positionCard: {
    flexDirection: 'column',
    alignItems: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    height: heightPercentageToDP(18),
    width: widthPercentageToDP(35),
    borderRadius: heightPercentageToDP(1),
    borderWidth: widthPercentageToDP(0.15),
    borderColor: colors.white,
    marginTop: heightPercentageToDP(1),
    marginHorizontal: widthPercentageToDP(1),
  },
})
export { CustomAssetsExplore }