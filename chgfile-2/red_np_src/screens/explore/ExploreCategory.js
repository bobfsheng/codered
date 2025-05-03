import React, { useEffect, useLayoutEffect, useState } from 'react'
import { View, Text, SafeAreaView, StyleSheet, FlatList, Image } from 'react-native'
import { DotIndicator } from 'react-native-indicators'
import database from '@react-native-firebase/database'
import { getLastQuote, getLastQuoteCrypto } from '@services'
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
} from '@utils'
import LinearGradient from 'react-native-linear-gradient'
import {
  BackChevron,
  MiniChart,
} from '@components'
import { getStockTickers, useReduxDispatch, useAuthSelector } from '@store'
import { NavigationService } from '@navigation'
import axios from 'axios'
import { alpacaMarketApi } from '@services'
import { useUserSelector } from '@store'

import { TouchableOpacity } from 'react-native-gesture-handler'
import {
  techList,
  bullList,
  cryptoList,
  bearList,
  estateList,
  energyList,
  bioList,
  popularList,
  etfList
} from '@constants/categorySymbols'
import { exploreArray } from '@constants/exploreArray'

const ExploreCategoryItem = ({ item }) => {
  const cryptos = require('@constants/cryptos.json')
  const [lastQuote, setLastQuote] = useState(0)

  {
    cryptos.includes(item.symbol) === false
      ? useEffect(() => {
          ;(async () => {
            if (item.symbol) {
              try {
                const response = await getLastQuote(item.symbol)
                if (response?.trade) {
                  setLastQuote(response?.trade?.p)
                }
              } catch (error) {
                console.log('error =>', error)
                setErrorMessage(error)
              }
            }
          })()
        }, [item.symbol])
      : useEffect(() => {
          ;(async () => {
            if (item.symbol) {
              try {
                // console.log('helre')
                const response = await getLastQuoteCrypto(item.symbol?.toString())
                // console.log('heressqq')
                if (response) {
                  setLastQuote(response?.quotes?.[item.symbol?.toString().toString()].ap)
                  // console.log('hereqaaq')
                } else {
                  setLastQuote(0)
                  // console.log('hello')
                }
              } catch (error) {
                console.log('error =>', error)
                // console.log('helloshshshshn')
              }
            } else {
              setLastQuote(0)
            }
          })()
        }, [item?.symbol])
  }

  return (
    <View>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
        onPress={() =>
          NavigationService.navigate('Explore', {
            screen: 'ExploreScreen',
            params: { stockTicker: item?.symbol },
          })
        }>
        <View>
          <MiniChart
            key={item.symbol}
            stockTicker={item.symbol}
            selectedFinalStock={item.symbol}
          />
          <Text
            style={[
              textStyles.bigMedium,
              {
                width: widthPercentageToDP(50),
                marginTop: heightPercentageToDP(2),
                marginBottom: heightPercentageToDP(0.5),
                fontSize:
                  item?.name?.length > 30 ? actuatedNormalize(12) : actuatedNormalize(16),
                color: 'white',
              },
            ]}>
            {item?.name}
          </Text>
          <Text
            style={[
              textStyles.bigMedium,
              {
                fontSize: actuatedNormalize(14),
                marginBottom: heightPercentageToDP(2),
                color: 'gray',
              },
            ]}>
            {item.symbol}
            {/* {catString} */}
          </Text>
        </View>

        {lastQuote === 0 ? (
          <DotIndicator
            color={colors.white}
            size={5}
            style={{ justifyContent: 'flex-end' }}
          />
        ) : (
          <Text
            style={[
              textStyles.bigMedium,
              {
                marginTop: heightPercentageToDP(2),
                marginBottom: heightPercentageToDP(0.5),
                fontSize: actuatedNormalize(16),
                color: 'white',
              },
            ]}>
            ${' '}
            {lastQuote?.toFixed(2)?.toString()?.length > 4
              ? lastQuote?.toFixed(2)
              : lastQuote?.toFixed(6)}
          </Text>
        )}
      </TouchableOpacity>
      <View
        style={{
          height: heightPercentageToDP(0.06),
          backgroundColor: 'gray',
        }}
      />
    </View>
  )
}
const ExploreCategory = ({ route }) => {
  const { subscriptionName, isSubscriptionLoaded } = useUserSelector(state => state)
  const [lastQuote, setLastQuote] = useState(0)

  const { catString, category, mainHeader } = route.params

  const dispatch = useReduxDispatch()
  useEffect(() => {
    dispatch(getStockTickers())
  }, [])
  const [selectedFinalStock, setFinalSelectedStock] = useState(null)
  const [positionsExplore, setPositionsExplore] = useState(null)
  const [watchlistArrayFromFB, setWatchlistArrayFromFB] = useState([])
  const [watchListWithValues, setWatchListWithValues] = useState([])
  const [selectedExplore, setSelectedExplore] = useState([])

  const { isLoggedIn, userId, alpacaToken } = useAuthSelector(state => state)

  const [refreshing, setRefreshing] = useState(false)

  const removeFromWatchlist = position => {
    const ref = database().ref('User')
    const watchlistArray = watchlistArrayFromFB.filter(watch => watch != position)

    ref.child(`/${userId}/Watchlist`).set(watchlistArray)

    setWatchlistArrayFromFB(watchlistArray)
  }
  //  if the stock is in the list setCheckMark(true)

  const handleRefresh = React.useCallback(async () => {
    setRefreshing(true)
    const alpacaMarketApi = axios.create({
      baseURL: 'https://paper-api.alpaca.markets/',
      headers: {
        Authorization: `Bearer d674ec3c-077b-41c3-b712-3b17d997079d`,
      },
    })
    try {
      const response = await alpacaMarketApi.get('v2/positions')
      if (response.status === 200) {
        setPositionsExplore(response.data)
      }
    } catch (error) {
      // console.log('getPositions explore =>', error.response)
      null
    }
    setRefreshing(false)
  }, [])
  useEffect(() => {
    handleRefresh()
  }, [])
  useEffect(() => {
    if (userId) {
      const ref = database().ref(`/User/${userId}`)
      ref.child('Watchlist').on('value', snapshot => {
        const watchlist = snapshot.val()
        if (watchlist) {
          const watchlistArray = Object.values(watchlist)
          setWatchlistArrayFromFB(watchlistArray)
        } else {
          setWatchlistArrayFromFB([])
        }
      })
    }
  }, [])
  useEffect(() => {
    ;(async () => {
      const getBar = async (stockTicker, start, end) => {
        const timeframe = '1Day'
        const limit = 1

        try {
          const response = await alpacaMarketApi.get(
            `v2/stocks/${stockTicker}/bars?start=${rfc3339(start)}&end=${rfc3339(
              end,
            )}&timeframe=${timeframe}&limit=${limit}`,
          )
          if (response?.data) {
            return response.data.bars[0]
          }
        } catch (error) {
          console.log('getBarsH error==>', error)
        }
      }
      const list = []
      await Promise.all(
        watchlistArrayFromFB.map(async item => {
          const closePrice = await getBar(item, fourDaysAgo, sixHoursAgo)
          const closePrice12 = await getBar(item, twelveMonthsAgo, sixHoursAgo)
          const temp = {
            stockTicker: item,
            closePrice: closePrice?.c,
            closePrice12: closePrice12?.c,
          }
          list.push(temp)
        }),
      )
      setWatchListWithValues(list)
    })()
  }, [watchlistArrayFromFB])

  useLayoutEffect(() => {
    switch (catString) {
      case 'bull':
        setSelectedExplore(bullList)
        break
      case 'bear':
        setSelectedExplore(bearList)
        break
      case 'tech':
        setSelectedExplore(techList)
        break
      case 'popular':
        setSelectedExplore(popularList)
        break
      case 'bio':
        setSelectedExplore(bioList)
        break
      case 'energy':
        setSelectedExplore(energyList)
        break
      case 'estate':
        setSelectedExplore(estateList)
        break
      case 'crypto':
        setSelectedExplore(cryptoList)
        break
      case 'etf':
        setSelectedExplore(etfList)
        break
      default:
        setSelectedExplore([])
        break
    }
  }, [catString])


  const matchingItem = exploreArray.find(item => item.catString === catString)
  

  return (
    <View style={styles.mainView}>
      <SafeAreaView style={styles.mainView}>
        <View
          style={{
            marginHorizontal: widthPercentageToDP(3),
            marginTop: heightPercentageToDP(5),
          }}>
          <View
            style={{
              marginTop:
                Platform.OS === 'android'
                  ? heightPercentageToDP(14)
                  : heightPercentageToDP(10),
              paddingBottom: heightPercentageToDP(5),
            }}>
            <FlatList
              showsVerticalScrollIndicator={false}
              style={{ marginTop: heightPercentageToDP(2) }}
              data={selectedExplore}
              renderItem={({ item }) => <ExploreCategoryItem item={item} />}
            />
          </View>
        </View>
      </SafeAreaView>
      {/* {(!isLoggedIn || (isSubscriptionLoaded === true && subscriptionName === '')) && (
        <AdComponent />
      )} */}

      <View style={{ position: 'absolute' }}>
        {/* <Image style={styles.headerImage} source={mainHeader} /> */}

        <LinearGradient colors={matchingItem?.gradientColors} style={styles.positionCard}>
          <Text
            numberOfLines={1}
            style={[
              textStyles.normalRegular,
              {
                color: 'white',
                alignSelf: 'flex-end',
                fontSize: actuatedNormalize(23),
                marginLeft: widthPercentageToDP(8),
                marginBottom: heightPercentageToDP(4),
                // marginHorizontal: widthPercentageToDP(5),
                // marginVertical: heightPercentageToDP(1),
              },
            ]}>
            {matchingItem.fullStringE}
          </Text>
          <Text
            numberOfLines={1}
            style={[
              textStyles.normalRegular,
              {
                color: 'white',
                marginRight: widthPercentageToDP(8),
                marginTop: heightPercentageToDP(1.5),
                // marginVertical: heightPercentageToDP(1),
                fontSize: actuatedNormalize(50),
              },
            ]}>
            {matchingItem.emoji}
          </Text>
        </LinearGradient>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: widthPercentageToDP(100),
          position: 'absolute',
          marginTop: heightPercentageToDP(6),
        }}>
        <BackChevron onPress={() => NavigationService.navigate('ExploreSelectTicker')} />
      </View>
      <View></View>
    </View>
  )
}
const styles = StyleSheet.create({
  mainView: { flex: 1, backgroundColor: colors.darkBackground },
  headerImage: {
    width: widthPercentageToDP(110),
    height: heightPercentageToDP(20),
    marginLeft: widthPercentageToDP(-5),
    resizeMode: 'cover',
    // marginBottom:heightPercentageToDP(2)
  },
  positionCard: {
    width: widthPercentageToDP(100),
    paddingTop: heightPercentageToDP(6),
    height: heightPercentageToDP(20),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})

export { ExploreCategory }
