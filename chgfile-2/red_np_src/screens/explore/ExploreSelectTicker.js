import React, { useEffect, useState, useCallback, memo, useMemo } from 'react'
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Pressable,
  FlatList,
  Keyboard,
} from 'react-native'
import { exploreArray } from '@constants/exploreArray'
import { useRefreshHookExplore, useSPYData } from '@hooks'
import database from '@react-native-firebase/database'
import {
  actuatedNormalize,
  colors,
  fourDaysAgo,
  heightPercentageToDP,
  rfc3339,
  sixHoursAgo,
  textStyles,
  twelveMonthsAgo,
  widthPercentageToDP,
  localSaveItem,
  StorageKeys,
} from '@utils'
import {
  CustomStockTicker,
  Icon,
  CustomWatchlist,
  CustomCarousel,
  CustomExplore,
  // AdComponent,
} from '@components'
import {
  getStockTickers,
  useReduxDispatch,
  useAuthSelector,
  useUserSelector,
  userActions,
} from '@store'
import { NavigationService } from '@navigation'
import { alpacaMarketApi, getLastQuote } from '@services'
import ContentLoader from 'react-native-easy-content-loader'
import Tooltip from 'react-native-walkthrough-tooltip'
import { TouchableOpacity } from 'react-native-gesture-handler'

const ExploreSelectTicker = () => {
  const { subscriptionName, isSubscriptionLoaded, toolTip5 } = useUserSelector(
    state => state,
  )
  const { spyStatus } = useSPYData()

  const dispatch = useReduxDispatch()
  useEffect(() => {
    dispatch(getStockTickers())
  }, [])
  const [selectedFinalStock, setFinalSelectedStock] = useState(null)

  const [watchlistArrayFromFB, setWatchlistArrayFromFB] = useState([])
  const [watchListWithValues, setWatchListWithValues] = useState([])

  const { isLoggedIn, userId, alpacaToken } = useAuthSelector(state => state)

  const [toolTipVisible1, setToolTipVisible1] = useState(true)

  const doBoth = async () => {
    // setToolTipVisible2(true);
    setToolTipVisible1(false)
    dispatch(userActions.setToolTip5({ toolTip5: true }))
    await localSaveItem(StorageKeys.toolTipShown5, JSON.stringify(true))
  }

  const { handleRefreshExplore, positionsExplore } = useRefreshHookExplore()

  useEffect(() => {
    handleRefreshExplore()
  }, [])
  // Memoize the reference to Firebase database
  const watchlistRef = useMemo(() => {
    return userId ? database().ref(`/User/${userId}/Watchlist`) : null
  }, [userId])

  // Function to fetch stock bars
  const getBar = useCallback(
    async (stockTicker, start, end, timeframe = '1Day', limit = 1) => {
      try {
        const response = await alpacaMarketApi.get(`v2/stocks/${stockTicker}/bars`, {
          params: {
            start: rfc3339(start),
            end: rfc3339(end),
            timeframe,
            limit,
          },
        })
        return response?.data?.bars[0]
      } catch (error) {
        console.log('getBarsH error==>', error)
        return null // Return null in case of an error
      }
    },
    [],
  )

  // Effect for Firebase watchlist listener
  useEffect(() => {
    let unsubscribe
    if (watchlistRef) {
      unsubscribe = watchlistRef.on('value', snapshot => {
        const watchlist = snapshot.val()
        setWatchlistArrayFromFB(watchlist ? Object.values(watchlist) : [])
      })
    }
    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [watchlistRef])

  // Effect for fetching stock bar data
  useEffect(() => {
    const fetchStockBarData = async () => {
      const list = await Promise.all(
        watchlistArrayFromFB.map(async item => {
          const closePrice = await getBar(item, fourDaysAgo, sixHoursAgo)
          const closePrice12 = await getBar(item, twelveMonthsAgo, sixHoursAgo)
      
          return {
            stockTicker: item,
            closePrice: closePrice?.c,
            closePrice12: closePrice12?.c,
          }
        }),
      )
      setWatchListWithValues(list)
    }

    if (watchlistArrayFromFB.length > 0) {
      fetchStockBarData()
    }
  }, [watchlistArrayFromFB, getBar])

  return (
    <Pressable style={styles.mainView} onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.mainView}>
        <View
          style={{
            marginTop: heightPercentageToDP(1),
          }}>
          <View
            style={{
              position: 'absolute',
              right: widthPercentageToDP(5),
              left: widthPercentageToDP(5),
              zIndex: 99,
            }}>
            <CustomStockTicker
              tab={'Explore'}
              setFinalSelectedStock={setFinalSelectedStock}
            />
          </View>
          <TouchableOpacity
            onPress={() => dispatch(userActions.setInformation({ infoId: 32 }))}>
            <View
              style={{
                marginTop: heightPercentageToDP(10),
                paddingBottom: heightPercentageToDP(5),
              }}>
              <Text
                style={[
                  textStyles.bigRegular,
                  {
                    marginLeft: widthPercentageToDP(5),
                    fontSize: actuatedNormalize(20),
                    color: 'white',
                  },
                ]}>
                {'  '}Markets are{' '}
                <Text
                  style={{
                    color: spyStatus === 'down' ? colors.redError : colors.primary,
                  }}>
                  {spyStatus}
                </Text>{' '}
                right now
              </Text>
            </View>
          </TouchableOpacity>
          <View
            style={{
              // marginTop: heightPercentageToDP(12),
              paddingBottom: heightPercentageToDP(5),
            }}>
            <Text
              style={[
                textStyles.bigMedium,
                {
                  marginLeft: widthPercentageToDP(5),
                  fontSize: actuatedNormalize(14),
                  color: 'white',
                },
              ]}>
              {watchlistArrayFromFB === null || watchlistArrayFromFB?.length < 1
                ? 'EXPLORE STOCKS'
                : 'WATCHLIST'}
            </Text>
            <View
              style={{
                marginTop: heightPercentageToDP(2),
                marginLeft: widthPercentageToDP(3),
              }}>
              {watchListWithValues?.length === 0 &&
                positionsExplore === null &&
                (watchlistArrayFromFB === null || watchlistArrayFromFB?.length < 1) && (
                  <View
                    style={{
                      height: heightPercentageToDP(20),
                      width: widthPercentageToDP(35),
                      paddingTop: heightPercentageToDP(2),
                      borderRadius: heightPercentageToDP(1),
                      borderWidth: widthPercentageToDP(0.7),
                      borderColor: colors.primary,
                      marginHorizontal: widthPercentageToDP(1.5),
                    }}>
                    <ContentLoader
                      pRows={0}
                      secondaryColor={'rgba(18, 18, 18, 0.2)'}
                      primaryColor={'rgba(18, 18, 18, 0.2)'}
                    />
                    <ContentLoader
                      pRows={3}
                      animationDuration={500}
                      pWidth={[100, 0, 0]}
                      pHeight={[0, 20, 0]}
                      active
                      primaryColor={'rgba(65, 65, 65, 0.2)'}
                      secondaryColor={'rgba(65, 65, 65, 0.9)'}
                    />
                  </View>
                )}
              {watchlistArrayFromFB === null || watchlistArrayFromFB?.length < 1 ? (
                <>
                  <Tooltip
                    isVisible={toolTipVisible1 && isLoggedIn && !toolTip5}
                    content={
                      <View
                        style={{
                          width: widthPercentageToDP(55),
                          height: heightPercentageToDP(6),
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
                          Tap on the small graph{'  '}
                          <Icon
                            type="Ionicons"
                            style={{ marginTop: heightPercentageToDP(0.3) }}
                            name="stats-chart"
                            size={widthPercentageToDP(5)}
                            color="black"
                            onPress={() =>
                              NavigationService.navigate('Explore', {
                                screen: 'ExploreScreen',
                                params: {
                                  stockTicker: position?.symbol,
                                },
                              })
                            }
                          />{' '}
                          to see the prices chart and news
                        </Text>
                      </View>
                    }
                    placement="top"
                    onClose={doBoth}>
                    <FlatList
                      data={positionsExplore}
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                      renderItem={({ item }, index) => {
                        return (
                          <CustomExplore key={index} position={item} explore={true} />
                        )
                      }}
                    />
                  </Tooltip>
                </>
              ) : (
                <>
                  <FlatList
                    data={watchListWithValues}
                    extraData={watchListWithValues}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }, index) => {
                      return <CustomWatchlist key={index} position={item} />
                    }}
                  />
                </>
              )}
            </View>
          </View>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text
            style={[
              textStyles.bigMedium,
              {
                marginLeft: widthPercentageToDP(8),
                marginBottom: heightPercentageToDP(2.5),
                fontSize: actuatedNormalize(14),
                color: 'white',
              },
            ]}>
            Categories
          </Text>
          <View style={{ flexDirection: 'row' }}>
            <Pressable onPress={() => NavigationService.navigate('ExploreStocks')}>
              <Text
                style={[
                  textStyles.bigMedium,
                  {
                    fontSize: actuatedNormalize(12),
                    color: 'white',
                  },
                ]}>
                View all{' '}
              </Text>
            </Pressable>
            <Icon
              type="Entypo"
              name="chevron-small-right"
              size={actuatedNormalize(16)}
              style={{
                marginRight: widthPercentageToDP(5),
              }}
              color="white"
              onPress={() => NavigationService.navigate('ExploreStocks')}
            />
          </View>
        </View>
        <CustomCarousel array={exploreArray} />
      </SafeAreaView>
    </Pressable>
  )
}
const styles = StyleSheet.create({
  mainView: { flex: 1, backgroundColor: colors.darkBackground },
  welcomeBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  welcomeContainer: {
    flexDirection: 'row',
    paddingHorizontal: widthPercentageToDP(3),
    justifyContent: 'space-between',
  },
  welcomeText: [
    textStyles.bigSemiBold,
    {
      color: 'white',
      fontSize: actuatedNormalize(15),
      marginBottom: heightPercentageToDP(2),
    },
  ],
  marketIndicatorIconContainer: {
    flexDirection: 'row',
    marginRight: widthPercentageToDP(5),
  },
  positionMainContainer: {
    width: '100%',
    justifyContent: 'space-between',
    padding: widthPercentageToDP(3),
  },
  optionImages: {
    width: widthPercentageToDP(25),
    height: widthPercentageToDP(25),
    marginHorizontal: widthPercentageToDP(1),
  },
  positionCard: {
    paddingLeft: widthPercentageToDP(2),
    paddingRight: widthPercentageToDP(2),
    height: heightPercentageToDP(20),
    width: widthPercentageToDP(35),
    borderRadius: heightPercentageToDP(1),
    borderWidth: widthPercentageToDP(0.15),
    marginRight: widthPercentageToDP(2),
    borderColor: 'white',
    backgroundColor: '#1F1C1B',
  },
  headerImage: {
    width: widthPercentageToDP(90),
    height: heightPercentageToDP(13),
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  imageStyle: {
    height: heightPercentageToDP(12),
    width: widthPercentageToDP(90),
    resizeMode: 'contain',
  },
  categoryStyle: {
    borderRadius: 10,
    borderColor: '#648C38',
    borderWidth: widthPercentageToDP(0.5),
  },
})
export { ExploreSelectTicker }
