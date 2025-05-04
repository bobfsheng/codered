import React from 'react'
import { View, Text, StyleSheet, Pressable } from 'react-native'
import { DotIndicator } from 'react-native-indicators'
import { CustomInputLabel } from '@components'
import { useAuthSelector, useReduxDispatch, userActions } from '@store'
import {
  actuatedNormalize,
  colors,
  heightPercentageToDP,
  textStyles,
  widthPercentageToDP,
} from '@utils'

const AccountBalanceBar = ({ cash, buying_power, challenge }) => {
  const dispatch = useReduxDispatch()
  const { redCoins } = useAuthSelector(state => state)
  return (
    <View style={styles.topBarContainer}>
      <View style={styles.topBarRow}>
        <Pressable
          style={{ flex: 3 }}
          onPress={() =>
            dispatch(userActions.setInformation({ infoId: challenge == true ? 2 : 8 }))
          }>
          <CustomInputLabel
            text={challenge == true ? 'Redvest Coins' : 'Buying Power'}
            big
            info
          />
          {/* {challenge == true &&
            <CustomInputLabel
              text={'Earn more...'}
              big
            // info
            />} */}
        </Pressable>
        <View style={{ flex: 2, alignItems: 'flex-end' }}>
          {buying_power == 0 ? (
            <DotIndicator color="white" size={actuatedNormalize(3)} />
          ) : (
            <Text
              style={[
                styles.topBarRowText,
                {
                  fontSize:
                    parseFloat(buying_power)?.toFixed(0).length > 7
                      ? actuatedNormalize(12)
                      : actuatedNormalize(16),
                },
              ]}>
              {' '}
              ${' '}
              {challenge == true
                ? isNaN(redCoins)
                  ? ' '
                  : parseFloat(redCoins)
                      ?.toFixed(0)
                      ?.toString()
                      ?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                : isNaN(buying_power)
                ? ' '
                : parseFloat(buying_power)
                    ?.toFixed(0)
                    ?.toString()
                    ?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            </Text>
          )}
        </View>
      </View>
      {challenge == false ? (
        <View style={styles.topBarRow}>
          <Pressable
            style={{ flex: 3 }}
            onPress={() =>
              dispatch(userActions.setInformation({ infoId: challenge == true ? 2 : 9 }))
            }>
            <CustomInputLabel text={'Cash Available'} info />
          </Pressable>
          <View style={{ flex: 2, alignItems: 'flex-end' }}>
            {cash == 0 ? (
              <DotIndicator color="white" size={actuatedNormalize(3)} />
            ) : (
              <Text
                style={[
                  styles.topBarRowText,
                  {
                    fontSize:
                      parseFloat(cash)?.toFixed(0)?.length > 9
                        ? actuatedNormalize(12)
                        : actuatedNormalize(15),
                  },
                ]}>
                ${' '}
                {isNaN(cash)
                  ? ' '
                  : parseFloat(cash)
                      ?.toFixed(0)
                      ?.toString()
                      ?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              </Text>
            )}
          </View>
        </View>
      ) : null}
    </View>
  )
}
const styles = StyleSheet.create({
  safeAreaContainer: { flex: 1, backgroundColor: colors.lightBrown },
  topBarContainer: {
    marginTop: widthPercentageToDP(4),
    backgroundColor: '#212121',
    height: heightPercentageToDP(10),
    width: widthPercentageToDP(90),
    borderRadius: heightPercentageToDP(1),
    justifyContent: 'center',
    alignSelf: 'center',
  },
  topBarRow: {
    flexDirection: 'row',
    marginHorizontal: widthPercentageToDP(5),
    marginVertical: 5,
  },
  topBarRowText: [
    textStyles.bigRegular,
    {
      color: 'white',
    },
  ],
  tabsMainContainer: {
    marginHorizontal: heightPercentageToDP(1),
    marginVertical: heightPercentageToDP(3),
    flexDirection: 'row',
  },
  tabContainer: {
    paddingVertical: widthPercentageToDP(3),
    borderRadius: widthPercentageToDP(12),
    minWidth: widthPercentageToDP(28),
    alignItems: 'center',
    marginHorizontal: heightPercentageToDP(1),
  },
  tabText: [
    textStyles.smallBold,
    {
      color: 'black',
    },
  ],
})
export { AccountBalanceBar }
