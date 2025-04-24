import React, { useEffect, memo, useState } from 'react'
import {
  StyleSheet,
  Pressable,
  View,
  ScrollView,
  Text,
  FlatList,
  RefreshControl,
} from 'react-native'
import {
  actuatedNormalize,
  colors,
  heightPercentageToDP,
  textStyles,
  widthPercentageToDP,
  screenTitle,
  StorageKeys,
  localSaveItem,
} from '@utils'
import { useRefreshHookProfile, useRefreshHookExplore } from '@hooks'
import {
  CustomButton,
  CustomPositionAssetsThree,
  HorizontalRule,
  Icon,
  VirtualizedView,
} from '@components'
import store, {
  signOutAsync,
  useAuthSelector,
  useUserSelector,
  userActions,
  useReduxDispatch,
  getAccountOrders,
  getAccountHistory,
  getAccountActivities,
} from '@store'
import { NavigationService } from '@navigation'
import { capitalize } from 'lodash'
import Tooltip from 'react-native-walkthrough-tooltip'

const ProfileMain = () => {
  const dispatch = useReduxDispatch()
  const {
    positions,
    activities,
    accountHistory,
    cash,
    long_market_value,
    buying_power,
    daytrade_count,
    pattern_day_trader,
    toolTip7,
    toolTip8,
  } = useUserSelector(state => state)
   const [yesterday, setYesterday] = useState()
   const [today, setToday] = useState()
   const [overviewBool, setOverviewBool] = useState(true)
   const [watchlistBool, setWatchlistBool] = useState(true)
   const { isLoggedIn } = useAuthSelector(state => state)

  
  const { handleRefreshExplore } = useRefreshHookExplore()

  useEffect(() => {
    handleRefreshExplore()
  }, [])

  const { handleRefreshProfile, refreshing } = useRefreshHookProfile()

  const handleWatchList = () => {
    setWatchlistBool(prev => !prev)
  }

  const handleOverView = () => {
    setOverviewBool(prev => !prev)
  }
  const handleSignOut = () => {
    dispatch(signOutAsync(store))
  }

  const formatValue = value => {
    if (!value) return
    return value
      ?.toFixed(0)
      ?.toString()
      ?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }
useEffect(() => {
  const fetchData = async () => {
    await dispatch(getAccountOrders())
    await dispatch(getAccountHistory())
    await dispatch(getAccountActivities())
  }

  fetchData().catch(console.error)
}, [])

useEffect(() => {
  if (!accountHistory) return
  setYesterday(accountHistory[accountHistory.length - 2])
  setToday(accountHistory[accountHistory.length - 1])
}, [accountHistory])

  
  const [toolTipVisible1, setToolTipVisible1] = useState(true)
  const [toolTipVisible2, setToolTipVisible2] = useState(false)

  const doBoth = async () => {
    try {
      setToolTipVisible2(true)
      setToolTipVisible1(false)
      dispatch(userActions.setToolTip7({ toolTip7: true }))
      await localSaveItem(StorageKeys.toolTipShown7, JSON.stringify(true))
    } catch (error) {
      console.log(error)
    }
  }

  const doBoth2 = async () => {
    try {
      setToolTipVisible2(false)
      dispatch(userActions.setToolTip8({ toolTip8: true }))
      await localSaveItem(StorageKeys.toolTipShown8, JSON.stringify(true))
    } catch (error) {
      console.log(error)
    }
  }

   const PositionItem = memo(({ position }) => (
     <CustomPositionAssetsThree position={position} />
   ))

  return (
    <>
      <VirtualizedView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        contentContainerStyle={{ paddingHorizontal: widthPercentageToDP(2) }}
        refreshControl={
          <RefreshControl
            colors={[colors.offWhite]}
            tintColor={colors.offWhite}
            refreshing={refreshing}
            onRefresh={handleRefreshProfile}
          />
        }>
        <View style={styles.positionMainContainer}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
            }}>
            <Tooltip
              isVisible={toolTipVisible1 && isLoggedIn && !toolTip7}
              content={
                <View
                  style={{
                    width: widthPercentageToDP(65),
                    height: heightPercentageToDP(13),
                    paddingHorizontal: heightPercentageToDP(0.3),
                  }}>
                  <Text
                    style={[
                      textStyles.bigRegular,
                      {
                        fontSize: actuatedNormalize(12),
                        paddingHorizontal: heightPercentageToDP(0.3),
                        color: 'black',
                        textAlign: 'center',
                      },
                    ]}>
                    Positions are the stocks (assets) you own. If the market was closed
                    when you executed a trade, till your order is filled, it will appear
                    under orders.
                  </Text>
                </View>
              }
              placement="bottom"
              onClose={doBoth}>
              <Pressable
                onPress={() => NavigationService.navigate('OrderAndPositionTopTab')}>
                <Text
                  style={[
                    textStyles.bigMedium,
                    {
                      fontSize: actuatedNormalize(16),
                      color: 'white',
                    },
                  ]}>
                  {'POSITIONS'}
                </Text>
              </Pressable>
            </Tooltip>
            <Icon
              type="AntDesign"
              name={watchlistBool === true ? 'up' : 'down'}
              size={widthPercentageToDP(4)}
              style={{
                marginLeft: widthPercentageToDP(3),
                marginTop: heightPercentageToDP(0.3),
              }}
              color="white"
              onPress={() => {
                handleWatchList()
              }}
            />
          </View>

          {watchlistBool && (
            <View style={{ flexDirection: 'row' }}>
              {positions?.length < 1 ? (
                <View
                  style={{
                    alignContent: 'center',
                    marginLeft: widthPercentageToDP(4),
                  }}>
                  <CustomButton
                    primary
                    onPress={() =>
                      NavigationService.navigate('Invest', {
                        screen: 'InvestTab',
                        params: {
                          easy: false,
                        },
                      })
                    }
                    text="Buy Stocks"
                  />
                </View>
              ) : (
                <FlatList
                  data={positions}
                  horizontal
                  initialNumToRender={3}
                  maxToRenderPerBatch={3}
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => <CustomPositionAssetsThree position={item} />}
                  contentContainerStyle={{
                    alignItems: 'center', // Adjust style as needed
                  }}
                />
              )}
            </View>
          )}
        </View>
        <View
          style={{
            alignItems: 'flex-start',
            paddingHorizontal: widthPercentageToDP(2),
            marginBottom: heightPercentageToDP(2),
          }}>
          <Tooltip
            isVisible={toolTipVisible2 && isLoggedIn && !toolTip8}
            content={
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  width: widthPercentageToDP(55),
                  height: heightPercentageToDP(8),
                  paddingHorizontal: heightPercentageToDP(0.3),
                }}>
                <Text
                  style={[
                    textStyles.bigRegular,
                    {
                      fontSize: actuatedNormalize(12),
                      paddingHorizontal: heightPercentageToDP(0.3),
                      color: 'black',
                      textAlign: 'center',
                    },
                  ]}>
                  You can see & cancel orders that haven't been filled this tab.
                </Text>
              </View>
            }
            placement="bottom"
            onClose={doBoth2}>
            <Pressable
              onPress={() =>
                NavigationService.navigate('OrderAndPositionTopTab', {
                  screen: 'OrderScreen',
                })
              }>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text
                  style={[
                    styles.screenTitle,
                    textStyles.bigMedium,
                    {
                      fontSize: actuatedNormalize(16),
                      color: 'white',
                    },
                  ]}>
                  ORDERS
                </Text>

                <Icon
                  type="Ionicons"
                  name="ios-chevron-forward"
                  size={24}
                  color={colors.offWhite}
                />
              </View>
            </Pressable>

            <Pressable onPress={() => NavigationService.navigate('History', {})}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text
                  style={[
                    styles.screenTitle,
                    textStyles.bigMedium,
                    {
                      marginTop: heightPercentageToDP(1),
                      fontSize: actuatedNormalize(16),
                      color: 'white',
                    },
                  ]}>
                  HISTORY
                </Text>

                <Icon
                  type="Ionicons"
                  name="ios-chevron-forward"
                  size={24}
                  color={colors.offWhite}
                />
              </View>
            </Pressable>
          </Tooltip>
        </View>

        <HorizontalRule />

        <View style={styles.positionMainContainer}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              marginBottom: heightPercentageToDP(1),
              marginLeft: widthPercentageToDP(0.2),
            }}>
            <Pressable onPress={handleOverView}>
              <Text
                style={[
                  textStyles.bigMedium,
                  {
                    fontSize: actuatedNormalize(15),
                    color: 'white',
                  },
                ]}>
                {'ACCOUNT OVERVIEW'}
              </Text>
            </Pressable>
            <Icon
              type="AntDesign"
              name={overviewBool === true ? 'up' : 'down'}
              size={18}
              style={{
                marginLeft: widthPercentageToDP(3),
                marginTop: heightPercentageToDP(0.3),
              }}
              color="white"
              onPress={handleOverView}
            />
          </View>
          {overviewBool && (
            <>
              <View style={styles.overViewSubContainer}>
                <Text style={styles.overViewType}>Daily Profit</Text>
                <Text
                  style={[
                    styles.overViewValue,
                    { color: today - yesterday < 0 ? '#EB5757' : '#AED37F' },
                  ]}>
                  {formatValue(today - yesterday) === undefined
                    ? ''
                    : `$ ${
                        isNaN(today - yesterday) ? '0' : formatValue(today - yesterday)
                      }`}
                </Text>
              </View>
              <View style={styles.overViewSubContainer}>
                <Text style={styles.overViewType}>Gross Profit</Text>
                <Text
                  style={[
                    styles.overViewValue,
                    { color: today - 100000 < 0 ? '#EB5757' : '#AED37F' },
                  ]}>
                  {formatValue(today - 100000) === undefined
                    ? ''
                    : `$ ${formatValue(today - 100000)}`}
                </Text>
              </View>
              <View style={styles.overViewSubContainer}>
                <Text style={styles.overViewType}>Cash Balance</Text>
                <Text style={[styles.overViewValue, { color: colors.white }]}>
                  {formatValue(parseFloat(cash)) === undefined
                    ? ''
                    : `$  ${formatValue(parseFloat(cash))}`}
                </Text>
              </View>
              <View style={styles.overViewSubContainer}>
                <Text style={styles.overViewType}>Stock Positions</Text>
                <Text style={[styles.overViewValue, { color: colors.white }]}>
                  {formatValue(parseFloat(long_market_value)) === undefined
                    ? ''
                    : `$  ${formatValue(parseFloat(long_market_value))}`}
                </Text>
              </View>
              <View style={styles.overViewSubContainer}>
                <Text style={styles.overViewType}>Buying Power</Text>
                <Text style={[styles.overViewValue, { color: colors.white }]}>
                  {formatValue(parseFloat(buying_power)) === undefined
                    ? ''
                    : `$  ${formatValue(parseFloat(buying_power))}`}
                </Text>
              </View>
              <View style={styles.overViewSubContainer}>
                <Text style={styles.overViewType}>Day Trade Count</Text>
                <Text style={[styles.overViewValue, { color: colors.white }]}>
                  {formatValue(parseFloat(daytrade_count)) === undefined
                    ? '0'
                    : `${daytrade_count}`}
                </Text>
              </View>
              <View style={styles.overViewSubContainer}>
                <Text style={styles.overViewType}>Pattern Day Trader</Text>
                <Text style={[styles.overViewValue, { color: colors.white }]}>
                  {`${capitalize(pattern_day_trader)}`}
                </Text>
              </View>
            </>
          )}
        </View>
        <View style={{ alignItems: 'center', marginBottom: heightPercentageToDP(2) }}>
          <CustomButton primary onPress={handleSignOut} text="Sign Out" />
        </View>
      </VirtualizedView>
    </>
  )
}

const styles = StyleSheet.create({
  positionMainContainer: {
    width: '100%',
    justifyContent: 'space-between',
    padding: widthPercentageToDP(3),
  },
  overViewSubContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  overViewType: [
    screenTitle,
    textStyles.hugeRegular,
    {
      marginTop: heightPercentageToDP(1),
      fontSize: actuatedNormalize(14),
      color: 'white',
    },
  ],
  overViewType: [
    screenTitle,
    textStyles.hugeRegular,
    {
      marginTop: heightPercentageToDP(1),
      fontSize: actuatedNormalize(14),
      color: 'white',
    },
  ],
  buttonText: [
    textStyles.bigMedium,
    {
      fontSize: actuatedNormalize(15),
      color: 'black',
      marginTop: heightPercentageToDP(0.3),
    },
  ],
  overViewValue: [
    textStyles.bigMedium,
    {
      fontSize: actuatedNormalize(13),
    },
  ],
})
export { ProfileMain }
