import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Pressable,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native'
import { DotIndicator } from 'react-native-indicators'
import { AccountBalanceBar  } from '@components'
import { NavigationService } from '@navigation'
import { useAuthSelector, useUserSelector, useReduxDispatch, userActions } from '@store'
import {
  actuatedNormalize,
  colors,
  heightPercentageToDP,
  textStyles,
  widthPercentageToDP,
  localSaveItem,
  StorageKeys,
} from '@utils'
import { InvestScreen } from './InvestScreen'
import { EasyInvestScreen } from './EasyInvestScreen'
import Tooltip from 'react-native-walkthrough-tooltip'

const InvestTab = ({ route }) => {
  const dispatch = useReduxDispatch()
  const { isLoggedIn } = useAuthSelector(state => state)
  const stockTicker = route?.params?.stockTicker
  const { buying_power, cash, toolTip3, toolTip4 } = useUserSelector(state => state)
  const [investTab, setInvestTab] = useState(!route?.params?.easy)
  const handleChangeTabs = condition => {
    setInvestTab(condition)
  }
  useEffect(() => {
    setInvestTab(!route?.params?.easy)
  }, [route?.params?.easy])

  // if (route?.params?.tab == 'easy') {
  //   useEffect(() => {
  //     setInvestTab(!route?.params?.tab)
  //   }, [route?.params?.tab])
  // }

  const [toolTipVisible1, setToolTipVisible1] = useState(true)

  const doBoth = async () => {
    // setToolTipVisible2(true);
    setToolTipVisible1(false)
    dispatch(userActions.setToolTip3({ toolTip3: true }))
    await localSaveItem(StorageKeys.toolTipShown3, JSON.stringify(true))
    // setShowMarketModal(true)
  }

  return (
    <Pressable
      style={styles.safeAreaContainer}
      onPress={Keyboard.dismiss}
      accessible={false}>
      <SafeAreaView style={styles.safeAreaContainer}>
      <AccountBalanceBar cash={cash} buying_power={buying_power} challenge={false}/>
        <View style={styles.tabsMainContainer}>
          <Pressable
            onPress={() => {
              handleChangeTabs(true)
            }}>
            <View
              style={[
                styles.tabContainer,
                { backgroundColor: investTab ? colors.white : 'transparent' },
              ]}>
              <Text
                style={[
                  styles.tabText,
                  { color: investTab ? colors.offBlack : colors.mediumGrey },
                ]}>
                INVEST
              </Text>
            </View>
          </Pressable>
          
          <Tooltip
            isVisible={toolTipVisible1 && isLoggedIn && !toolTip3}
            content={
              <View
                style={{
                  width: widthPercentageToDP(47),
                  height: heightPercentageToDP(5),
                  paddingHorizontal: heightPercentageToDP(0.3),
                }}>
                <Text
                  style={[
                    textStyles.bigRegular,
                    {
                      fontSize: actuatedNormalize(12),
                      // width:widthPercentageToDP(40),
                      paddingHorizontal: heightPercentageToDP(0.3),
                      color: 'black',
                      textAlign: 'center',
                    },
                  ]}>
                  Easiest way to place an order, type it out.
                </Text>
              </View>
            }
            placement="bottom"
            onClose={doBoth}>
            <Pressable
              onPress={() => {
                handleChangeTabs(false)
              }}>
              <View
                style={[
                  styles.tabContainer,
                  { backgroundColor: investTab ? 'transparent' : colors.white },
                ]}>
                <Text
                  style={[
                    styles.tabText,
                    { color: investTab ? colors.mediumGrey : colors.offBlack },
                  ]}>
                  EASY ORDER
                </Text>
              </View>
            </Pressable>
            
            
          </Tooltip>
          <Pressable
              onPress={() =>
                NavigationService.navigate('EasyCryptoInvestScreen')
              }>
              <View
                style={[
                  styles.tabContainer,
                  { backgroundColor: 'transparent'  },
                ]}>
                <Text
                  style={[
                    styles.tabText,
                    { color: colors.mediumGrey },
                  ]}>
                  CRYPTO
                </Text>
              </View>
            </Pressable>
        </View>
        <View style={{ flex: 1 }}>
          {investTab ? (
            <InvestScreen stockTicker={stockTicker} />
          ) : (
            <EasyInvestScreen stockTickeri={stockTicker} toolTip4={toolTip4} />
          )}
        </View>
        {/* </Pressable> */}
      </SafeAreaView>
    </Pressable>
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
export { InvestTab }
