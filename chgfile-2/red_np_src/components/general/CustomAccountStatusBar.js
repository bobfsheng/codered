import React, { memo } from 'react'
import { Image, Pressable, View, Text, StyleSheet } from 'react-native'
import { SkypeIndicator } from 'react-native-indicators'
import {
  actuatedNormalize,
  colors,
  heightPercentageToDP,
  textStyles,
  widthPercentageToDP,
} from '@utils'
import { Icon } from '@components'
import { NavigationService } from '@navigation'
import { useCustomAccountData } from '@hooks'
import { useAuthSelector } from '@store'
import { TouchableOpacity } from 'react-native-gesture-handler'
const hrocket = require('@assets/images/HomeScreen/homerocket.png')

const CustomAccountStatusBar = memo(({ showInPercentage }) => {
  const { portfolio_value, yesterday, today, pnL } = useCustomAccountData()

  const { userEmoji } = useAuthSelector(state => state)
  const formatValue = value => {
    if (value === 0) {
      return '0' // Return '0' as a string when the value is 0
    }
    if (!value) return
    return value
      ?.toFixed(0)
      ?.toString()
      ?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      ?.replace('-', '')
  }

  return (
    <View style={styles.mainContainer}>
      <Pressable
        onPress={() => NavigationService.navigate('Account', { screen: 'Profile' })}>
        <View style={styles.subContainer}>
          <View style={styles.imageContainer}>
            <TouchableOpacity
              onPress={() =>
                NavigationService.navigate('Account', { screen: 'EmojiSelectorScreen' })
              }>
              {userEmoji !== undefined ? (
                <View
                  style={{
                    justifyContent: 'center',
                    alignContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                    marginHorizontal: widthPercentageToDP(3),
                    backgroundColor: '#B2D0CE',
                    width: widthPercentageToDP(13),
                    height: widthPercentageToDP(13),
                    borderRadius: widthPercentageToDP(10),
                  }}>
                  <Text
                    style={{
                      fontSize: actuatedNormalize(22),
                      color: 'white',
                      justifyContent: 'center',
                      alignContent: 'center',
                      alignItems: 'center',
                      alignSelf: 'center',
                    }}>
                    {userEmoji}
                  </Text>
                </View>
              ) : (
                <Image source={hrocket} style={styles.image} />
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.balanceContainer}>
            <View style={{ width: '100%' }}>
              {isNaN(today - yesterday) ? (
                <Text style={styles.balanceText}>{'Pull down to refresh'}</Text>
              ) : (
                <Text style={styles.balanceText}>{'Your Balance'}</Text>
              )}
            </View>
            <View style={{ width: '100%' }}>
              {isNaN((today - yesterday) / yesterday) ? (
                <Text style={styles.balanceText}>{'Loading your account😉'}</Text>
              ) : (
                <Text
                  style={[
                    styles.balanceNumber,
                    {
                      fontSize: actuatedNormalize(
                        portfolio_value?.toString()?.length > 10 ? 16 : 21,
                      ),
                    },
                  ]}>
                  {portfolio_value === 'NaN' ? '' : `$ ${portfolio_value}`}
                </Text>
              )}
            </View>
          </View>
          <View style={styles.percentContainer}>
            <View style={{ width: '100%' }}>
              {isNaN((today - yesterday) / yesterday) ? (
                <View style={{ height: '100%', width: '100%' }}>
                  <SkypeIndicator color="white" />
                </View>
              ) : (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: heightPercentageToDP(5),
                    marginRight: widthPercentageToDP(4),
                    paddingHorizontal: widthPercentageToDP(1),
                    paddingVertical: widthPercentageToDP(0.8),
                    borderRadius: widthPercentageToDP(20),
                    backgroundColor: today - yesterday < 0 ? colors.red : colors.primary,
                  }}>
                  <Text
                    style={[
                      textStyles.bigBold,
                      {
                        color: today - yesterday < 0 ? 'white' : 'white',
                        fontSize: actuatedNormalize(13),
                      },
                    ]}>
                    {today - yesterday < 0 && ' -'}
                    {showInPercentage === true
                      ? `   ${(((today - yesterday) / yesterday) * 100)
                          ?.toFixed(2)
                          ?.toString()
                          ?.replace('-', '')}% `
                      : `   $ ${
                          isNaN(today - yesterday) ? '0' : formatValue(today - yesterday)
                        } `}
                  </Text>
                  <Icon
                    type="AntDesign"
                    name={today - yesterday < 0 ? 'down' : 'up'}
                    size={actuatedNormalize(14)}
                    style={{ marginRight: widthPercentageToDP(2) }}
                    color={'white'}
                  />
                </View>
              )}
            </View>
          </View>
        </View>
      </Pressable>
    </View>
  )
})

const styles = StyleSheet.create({
  mainContainer: {
    width: widthPercentageToDP(96),
    height: heightPercentageToDP(12),
    backgroundColor: colors.mediumDarkBackground,
    borderRadius: heightPercentageToDP(1),
    marginBottom: heightPercentageToDP(1),
    alignSelf: 'center',
    overflow: 'hidden',
    paddingRight: widthPercentageToDP(2),
  },
  subContainer: {
    flexDirection: 'row',
    height: '100%',
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    // marginRight: widthPercentageToDP(5),
  },
  image: {
    resizeMode: 'contain',
    width: widthPercentageToDP(10),
    height: widthPercentageToDP(10),
    marginHorizontal: widthPercentageToDP(3),
  },
  balanceContainer: {
    flex: 1,
    maxWidth: widthPercentageToDP(60),
    justifyContent: 'center',
    alignItems: 'center',
  },
  balanceText: [
    textStyles.bigSemiBold,
    {
      color: 'white',
      fontSize: actuatedNormalize(13),
    },
  ],
  balanceNumber: [
    textStyles.bigBold,
    {
      color: 'white',
    },
  ],
  percentContainer: {
    maxWidth: widthPercentageToDP(30),
    height: '100%',
  },
})
export { CustomAccountStatusBar }
