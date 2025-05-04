import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Share,
  RefreshControl,
} from 'react-native'
import { stockInfo } from '@constants/stockInfo'
import database from '@react-native-firebase/database'
import firestore from '@react-native-firebase/firestore'
import dynamicLinks from '@react-native-firebase/dynamic-links'
import {
  actuatedNormalize,
  colors,
  heightPercentageToDP,
  textStyles,
  widthPercentageToDP,
} from '@utils'
import {
  BackChevron,
  CustomButton,
  HorizontalRule,
  Icon,
  HorizontalRuleDouble,
  CustomExploreChart, 
  CustomExploreChartBar
} from '@components'
import {
  getBarsD,
  getBarsH,
  getBarsM,
  getBarsY,
  getBarsA,
  getBar,
  getCrypto,
  getCryptoA,
  getLastQuote,
} from '@services'
import moment from 'moment'
import { LineChart } from 'react-native-chart-kit'
import { DotIndicator } from 'react-native-indicators'
import { NavigationService } from '@navigation'
import { useAuthSelector, useReduxDispatch, getMarketStatus } from '@store'
import { cryptoFormat } from '@constants/cryptoFormat'

const ExplorePosition = ({ route }) => {
  const dispatch = useReduxDispatch()
  const {
    stockTicker,
    amount,
    price,
    side,
    pl,
    current_price,
    daily_profit,
    daily_profit_pr,
    cost,
    market_value,
    change_today,
    username,
  } = route?.params

  const cryptos = require('@constants/cryptos.json')

    const formatValue = value => {
      if (!value) return
      return value
        ?.toString()
        ?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
  const foundStock = stockInfo.find(stock => stock.symbol === stockTicker)

  const { userId, isLoggedIn } = useAuthSelector(state => state)
  const chartConfig = {
    backgroundColor: colors.darkBackground,
    backgroundGradientFrom: colors.darkBackground,
    backgroundGradientTo: colors.darkBackground,
    fontSize: actuatedNormalize(12),
    decimalPlaces: 2, // optional, defaults to 2dp
    fillShadowGradientOpacity: 0.5,
    fillShadowGradientFromOffset: 1,
    color: (opacity = 1) => `white`,
    fillShadowGradient: colors.darkBackground,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    strokeWidth: '3',
    propsForDots: {
      r: '30',
      strokeWidth: '10',
      stroke: `rgba(255, 255, 255, 0)`,
      fill: `rgba(255, 255, 255, 0)`,
    },
  }

  dispatch(getMarketStatus())

  const [chartClick, setChartClick] = useState(null)
  const [chartClickTime, setChartClickTime] = useState(null)
  const [chartClickCoords, setChartClickCoords] = useState({ x: 0, y: 0 })
  const [refreshing, setRefreshing] = useState(false)
  const [refreshingColor, setRefreshingColor] = useState(false)
  const [lastQuote, setLastQuote] = useState(0)
  const screenWidth = Dimensions.get('window').width
  const graphsList = ['1H', '1W', '1M', '1Y', 'ALL']
  const [selectedGraphList, setSelectedGraphList] = useState('1M')
  const [barDataLabels, setbarDataLabels] = useState(['', '', ''])
  const [addWatchlistBool, setAddWatchlistBool] = useState(false)
  const [watchlistArrayFromFB, setWatchlistArrayFromFB] = useState([])

  const [barDataSet, setbarDataSet] = useState([0, 0, 0])
  const [volume, setVolume] = useState(0)
  const [closePrice, setClosePrice] = useState(0)
  const [closePriceYesterday, setClosePriceYesterday] = useState(0)
  const [lowPrice, setLowPrice] = useState(0)
  const [highPrice, setHighPrice] = useState(0)
  const [openPrice, setOpenPrice] = useState(0)

  const handleAddToWatchList = async () => {
    if (isLoggedIn) {
      setAddWatchlistBool(true)
      const ref = database().ref('User')
      const watchlistArray = watchlistArrayFromFB

      watchlistArray.push(stockTicker)

      setWatchlistArrayFromFB(watchlistArray)
      ref.child(`/${userId}/Watchlist`).set(watchlistArray)
      await firestore().collection('User').doc(userId).update({
        Watchlist: watchlistArray,
      })
    } else {
      NavigationService.navigate('Account', { screen: 'SignInScreen' })
    }
  }
  const handleRemoveFromWatchList = async () => {
    if (isLoggedIn) {
      setAddWatchlistBool(true)
      const ref = database().ref('User')
      const watchlistArray = watchlistArrayFromFB.filter(stock => stock != stockTicker)
      setWatchlistArrayFromFB(watchlistArray)
      ref.child(`/${userId}/Watchlist`).set(watchlistArray)
      await firestore().collection('User').doc(userId).update({
        Watchlist: watchlistArray,
      })

      setAddWatchlistBool(false)
    } else {
      NavigationService.navigate('Account', { screen: 'SignInScreen' })
    }
  }

  const handleShare = async () => {
    try {
      const linkUrl = `https://redvest.app?stockticker=${stockTicker}&apn=app.redvest&isi=1609301338&ibi=com.redko.redvest`

      const link = await dynamicLinks().buildShortLink(
        {
          link: linkUrl,
          domainUriPrefix: 'https://redvest.page.link',
          android: {
            packageName: 'com.redko.redvest',
          },
        },
        dynamicLinks.ShortLinkType.SHORT,
      )
      const result = await Share.share({
        message: `Check out ${stockTicker} stock, last price was $ ${closePrice} per share! ${link}`,
      })
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      console.log('error =>', error)
    }
  }

  const handleBuy = () => {
    NavigationService.navigate('InvestScreenPosition', {
      stockTicker: stockTicker,
      amount: amount,
      price: price,
      side: side,
      pl: pl,
    })
  }

  const handleDataAndLabel = (bars, selectedGraphList) => {
    const arr = []
    const labelArr = []
    const half = Math.floor(bars.length / 2)
    const quater = Math.floor(half / 2)
    let labelFormat = 'MMM DD hh:mmA'
    switch (selectedGraphList) {
      case '1H':
        break
      case '1W':
        labelFormat = 'MMM DD hh:mmA'
        break
      case '1M':
        labelFormate = 'MMM DD'
        break
      case '1Y':
        labelFormate = 'MMM DD YYYY'
        break
      case 'ALL':
        labelFormate = 'MMM DD YYYY'
        break
      default:
    }
    for (let i = 0; i < bars.length; i++) {
      arr.push(`${bars[i].c}`)
      labelArr.push(moment(bars[i].t).format(labelFormate))
    }
    setbarDataSet(arr)
    setbarDataLabels(labelArr)
    if (arr.length > 0) {
      const firstValue = parseFloat(arr[0])
      const lastValue = parseFloat(arr[arr.length - 1])
      // Calculate percent change
      const percentChange = ((lastValue - firstValue) / firstValue) * 100
      setClosePriceYesterday(percentChange.toFixed(2)) // This will log the last value
    } else {
      null
    }
  }
  const getCryptoHandle = React.useCallback(async () => {
    const response = await getCrypto(
      cryptoFormat.find(obj => obj.ticker === stockTicker).formatted,
    )
    // const symbolString = newCrypto
    const data =
      response?.bars[cryptoFormat.find(obj => obj.ticker === stockTicker).formatted]
    // console.log('szz',response.bars)
    if (response?.bars) {
      // console.log('resp,',response.bars)
      const res = data[0]
      setVolume(res.v)
      setClosePrice(res.c)
      setLowPrice(res.l)
      setHighPrice(res.h)
      setOpenPrice(res.o)
    }
  }, [])
  const getBarsHandle = React.useCallback(async () => {
    const response = await getBar(stockTicker)
    if (response?.bars) {
      const res = response.bars[response.bars.length - 1]
      setVolume(res.v)
      setClosePrice(res.c)
      setLowPrice(res.l)
      setHighPrice(res.h)
      setOpenPrice(res.o)
    }
  }, [])
  const getBarsHHandle = React.useCallback(async () => {
    const response = await getBarsH(stockTicker)
    if (response?.bars) {
      handleDataAndLabel(response?.bars, '1H')
    } else {
      setbarDataSet([0, 0, 0, 0, 0])
      setbarDataLabels(['', '', '', '', ''])
    }
  }, [])
  const getBarsDHandle = React.useCallback(async () => {
    const response = await getBarsD(stockTicker)
    if (response?.bars) {
      handleDataAndLabel(response?.bars, '1W')
    } else {
      setbarDataSet([0, 0, 0, 0, 0])
      setbarDataLabels(['', '', '', '', ''])
    }
  }, [])
  const getBarsMHandle = React.useCallback(async () => {
    const response = await getBarsM(stockTicker)
    if (response?.bars) {
      handleDataAndLabel(response?.bars, '1M')
    } else {
      setbarDataSet([0, 0, 0, 0, 0])
      setbarDataLabels(['', '', '', '', ''])
    }
  }, [])
  const getBarsYHandle = React.useCallback(async () => {
    const response = await getBarsY(stockTicker)
    if (response?.bars) {
      handleDataAndLabel(response?.bars, '1Y')
    } else {
      setbarDataSet([0, 0, 0, 0, 0])
      setbarDataLabels(['', '', '', '', ''])
    }
  }, [])
  const getBarsAHandle = React.useCallback(async () => {
    const response = await getBarsA(stockTicker)
    if (response?.bars) {
      handleDataAndLabel(response?.bars, 'ALL')
    } else {
      setbarDataSet([0, 0, 0, 0, 0])
      setbarDataLabels(['', '', '', '', ''])
    }
  }, [])

  const getCryptoAHandle = React.useCallback(async () => {
    // const newCrypto = cryptoFormat.find(obj => obj.ticker === stockTicker).formatted
    const response = await getCryptoA(
      cryptoFormat.find(obj => obj.ticker === stockTicker).formatted,
    )
    if (response?.bars) {
      handleDataAndLabel(
        response?.bars?.[cryptoFormat.find(obj => obj.ticker === stockTicker).formatted],
        'ALL',
      )
    } else {
      setbarDataSet([0, 0, 0, 0, 0])
      setbarDataLabels(['', '', '', '', ''])
    }
  }, [])

  const data = {
    // labels: barDataLabels,

    datasets: [
      {
        data: barDataSet,
        // strokeWidth: 2, // optional
      },
    ],
    // legend: [stockTicker], // optional
  }

  cryptos.includes(stockTicker) === true
    ? useEffect(() => {
        getCryptoHandle()
        switch (selectedGraphList) {
          case '1H':
            getCryptoAHandle()
            break
          case '1W':
            getCryptoAHandle()
            break
          case '1M':
            getCryptoAHandle()

            break
          case '1Y':
            getCryptoAHandle()

            break
          case 'ALL':
            getCryptoAHandle()
            break
          default:
            getCryptoAHandle()
        }
      }, [selectedGraphList])
    : useEffect(() => {
        getBarsHandle()
        switch (selectedGraphList) {
          case '1H':
            getBarsHHandle()
            break
          case '1W':
            getBarsDHandle()
            break
          case '1M':
            getBarsMHandle()

            break
          case '1Y':
            getBarsYHandle()

            break
          case 'ALL':
            getBarsAHandle()

            break
          default:
            getBarsHHandle()
        }
      }, [selectedGraphList])

  // console.log(barDataSet, 'ssss')

  useEffect(() => {
    if (userId) {
      const ref = database().ref(`/User/${userId}`)
      ref.child('Watchlist').on('value', snapshot => {
        const watchlist = snapshot.val()
        if (watchlist) {
          if (watchlist.includes(stockTicker)) {
            setAddWatchlistBool(true)
          }
          const watchlistArray = Object.values(watchlist)
          setWatchlistArrayFromFB(watchlistArray)
        } else {
          setWatchlistArrayFromFB([])
        }
      })
    }
  }, [])

  const handleRefresh = async () => {
    setRefreshingColor(true)
    setRefreshing(true)

    if (stockTicker) {
      try {
        const response = await getLastQuote(stockTicker)
        if (response?.trade) {
          setLastQuote(response?.trade?.p)
        } else {
          setLastQuote(0)
        }
      } catch (error) {
        console.log('error =>', error)
      }
    } else {
      setLastQuote(0)
    }
    // })()

    for (let i = 0; i < 2; i++) {
      setTimeout(() => setRefreshingColor(prev => !prev), i * 1000)
      setRefreshingColor(false)
    }

    setRefreshing(false)
  }

  useEffect(() => {
    handleRefresh()
  }, [])

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.topBar}>
        <View style={styles.topBarBackChevron}>
          {/* <BackChevron
            onPress={() => {
              NavigationService.navigate('Home', { screen: 'HomeScreen' })
            }}
          /> */}
        </View>

        <View
          style={{
            flexDirection: 'row',
            // marginVertical: 5,
            marginRight: widthPercentageToDP(4),
          }}>
          <Icon
            type="Ionicons"
            name={addWatchlistBool ? 'checkmark-circle-sharp' : 'add-circle'}
            size={28}
            color="white"
            style={{ marginHorizontal: 5 }}
            onPress={() => {
              addWatchlistBool ? handleRemoveFromWatchList() : handleAddToWatchList()
            }}
          />

          <Icon
            type="Feather"
            name="share"
            size={24}
            color="white"
            onPress={handleShare}
            style={{ marginHorizontal: 5 }}
          />
        </View>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            colors={[colors.offWhite]}
            tintColor={colors.offWhite}
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        }>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 10,
            marginTop: heightPercentageToDP(2),
          }}>
          <View>
            {username && (
              <Text
                style={[
                  textStyles.bigMedium,
                  {
                    marginBottom: heightPercentageToDP(1),
                    marginLeft: widthPercentageToDP(6),
                    color: 'gray',
                    fontSize: actuatedNormalize(13),
                  },
                ]}>
                {username}'s Position
              </Text>
            )}
            {foundStock?.info?.longName && (
              <Text
                numberOfLines={1}
                style={[
                  textStyles.bigRegular,
                  {
                    // paddingHorizontal: 10,
                    color: 'gray',
                    marginLeft: widthPercentageToDP(6),
                    fontSize: actuatedNormalize(14),
                    width: widthPercentageToDP(80),
                    marginBottom: heightPercentageToDP(1.5),
                  },
                ]}>
                {foundStock?.info?.longName}
              </Text>
            )}
            <Text
              style={[
                textStyles.bigMedium,
                {
                  marginLeft: widthPercentageToDP(6),
                  color: colors.white,
                  fontSize: actuatedNormalize(20),
                },
              ]}>
              {stockTicker}
              {'  '}
            </Text>

            <Text
              style={[
                textStyles.bigBold,
                {
                  marginLeft: widthPercentageToDP(6),
                  color: colors.white,
                  fontSize: actuatedNormalize(25),
                },
              ]}>
              {cryptos.includes(stockTicker) === true
                ? closePrice < 1000
                  ? `${closePrice.toFixed(5)}`
                  : `${formatValue(closePrice.toFixed(2))}`
                : lastQuote < 1000
                ? `$ ${formatValue(lastQuote.toFixed(2))}`
                : `$ ${formatValue(lastQuote.toFixed(2))}`}
              <Text
                style={[
                  textStyles.bigBold,
                  {
                    marginLeft: widthPercentageToDP(4),
                    color: closePriceYesterday >= 0 ? '#9ECB90' : colors.redError,
                    fontSize: actuatedNormalize(12),
                  },
                ]}>
                {'    '} %{closePriceYesterday}
              </Text>
            </Text>
          </View>
        </View>

        <View>
          <CustomExploreChart
            lastQuote={lastQuote}
            data={data}
            closePrice={closePrice}
            barDataLabels={barDataLabels}
            selectedGraphList={selectedGraphList}
            setSelectedGraphList={setSelectedGraphList}
          />
          {cryptos.includes(stockTicker) !== true && (
            <CustomExploreChartBar
              barDataLabels={barDataLabels}
              selectedGraphList={selectedGraphList}
              setSelectedGraphList={setSelectedGraphList}
            />
          )}
        </View>
        <View style={{ paddingVertical: heightPercentageToDP(3) }}>
          <HorizontalRule />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View style={styles.columnsView}>
              <View style={styles.rowView}>
                <Text style={styles.category}>Amount</Text>
                <Text style={styles.amount}>{parseFloat(amount)?.toFixed(2)}</Text>
              </View>
              <HorizontalRuleDouble />
              <View style={styles.rowView}>
                <Text style={styles.category}>Average Entry</Text>
                <Text style={styles.amount}>$ {parseFloat(price)?.toFixed(2)}</Text>
              </View>
              <HorizontalRuleDouble />
              <View style={styles.rowView}>
                <Text style={styles.category}>Position Side</Text>
                <Text style={styles.amount}>
                  {side.charAt(0)?.toUpperCase() + side.slice(1)}
                </Text>
              </View>
              <HorizontalRuleDouble />
              <View style={styles.rowView}>
                <Text style={styles.category}>Profit</Text>
                <Text
                  style={[
                    styles.amount,
                    { color: pl < 0 ? colors.redError : colors.primary2 },
                  ]}>
                  {parseFloat(pl)?.toFixed(2)}
                </Text>
              </View>
              <HorizontalRuleDouble />
              <View style={styles.rowView}>
                <Text style={styles.category}>Current Price</Text>
                <Text style={styles.amount}>
                  ${parseFloat(current_price)?.toFixed(2)}
                </Text>
              </View>
              <HorizontalRuleDouble />
            </View>
            <View style={styles.columnsView}>
              <View style={styles.rowView}>
                <Text style={styles.category}>Daily Profit</Text>
                <Text
                  style={[
                    styles.amount,
                    { color: daily_profit_pr < 0 ? colors.redError : colors.primary2 },
                  ]}>
                  ${parseFloat(daily_profit)?.toFixed(0)}
                </Text>
              </View>
              <HorizontalRuleDouble />
              <View style={styles.rowView}>
                <Text style={styles.category}>Daily Profit</Text>
                <Text
                  style={[
                    styles.amount,
                    { color: daily_profit_pr < 0 ? colors.redError : colors.primary2 },
                  ]}>
                  %{parseFloat(daily_profit_pr)?.toFixed(2)}
                </Text>
              </View>
              <HorizontalRuleDouble />
              <View style={styles.rowView}>
                <Text style={styles.category}>Cost</Text>
                <Text style={styles.amount}>${parseFloat(cost)?.toFixed(0)}</Text>
              </View>
              <HorizontalRuleDouble />
              <View style={styles.rowView}>
                <Text style={styles.category}>Market Value</Text>
                <Text style={styles.amount}>
                  {' '}
                  ${parseFloat(market_value)?.toFixed(0)}
                </Text>
              </View>
              <HorizontalRuleDouble />
              <View style={styles.rowView}>
                <Text style={styles.category}>Today's Change</Text>
                <Text
                  style={[
                    styles.amount,
                    { color: daily_profit_pr < 0 ? colors.redError : colors.primary2 },
                  ]}>
                  %{parseFloat(change_today)?.toFixed(2)}
                </Text>
              </View>
              <HorizontalRuleDouble />
            </View>
          </View>
          <View style={{ alignItems: 'center', marginTop: 10 }}>
            <CustomButton primary text="Trade" onPress={handleBuy} />
            <View style={[styles.rowView, { width: '80%' }]}>
              <View>
                <Text style={styles.category2}>Volume</Text>
              </View>
              <View>
                {volume === 0 ? (
                  <DotIndicator color={colors.white} size={actuatedNormalize(5)} />
                ) : (
                  <Text style={styles.amount2}>{volume}</Text>
                )}
              </View>
            </View>
            <HorizontalRule style={{ width: '80%' }} />
            <View style={[styles.rowView, { width: '80%' }]}>
              <View>
                <Text style={styles.category2}>Close Price</Text>
              </View>
              <View>
                {closePrice === 0 ? (
                  <DotIndicator color={colors.white} size={actuatedNormalize(5)} />
                ) : (
                  <Text style={styles.amount2}>{closePrice}</Text>
                )}
              </View>
            </View>
            <HorizontalRule style={{ width: '80%' }} />
            <View style={[styles.rowView, { width: '80%' }]}>
              <View>
                <Text style={styles.category2}>Low Price</Text>
              </View>
              <View>
                {lowPrice.toFixed(2) === 0 ? (
                  <DotIndicator color={colors.white} size={actuatedNormalize(5)} />
                ) : (
                  <Text style={styles.amount2}>{lowPrice.toFixed(2)}</Text>
                )}
              </View>
            </View>
            <HorizontalRule style={{ width: '80%' }} />
            <View style={[styles.rowView, { width: '80%' }]}>
              <View>
                <Text style={styles.category2}>High Price</Text>
              </View>
              <View>
                {highPrice === 0 ? (
                  <DotIndicator color={colors.white} size={actuatedNormalize(5)} />
                ) : (
                  <Text style={styles.amount2}>{highPrice}</Text>
                )}
              </View>
            </View>
            <HorizontalRule style={{ width: '80%' }} />
            <View style={[styles.rowView, { width: '80%' }]}>
              <View>
                <Text style={styles.category2}>Open Price</Text>
              </View>
              <View>
                {openPrice === 0 ? (
                  <DotIndicator color={colors.white} size={actuatedNormalize(5)} />
                ) : (
                  <Text style={styles.amount2}>{openPrice}</Text>
                )}
              </View>
            </View>
            <HorizontalRule style={{ width: '80%' }} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  safeAreaView: {
    backgroundColor: colors.darkBackground,
    paddingBottom: heightPercentageToDP(3),
    flex: 1,
  },
  topBar: { flexDirection: 'row' },
  topBarBackChevron: {
    flex: 1,
    flexDirection: 'row',
  },
  topBatTitle: { flex: 4, justifyContent: 'center', alignItems: 'center' },
  positionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: heightPercentageToDP(15),
    width: widthPercentageToDP(90),
    borderRadius: heightPercentageToDP(1),
    borderWidth: widthPercentageToDP(0.15),
    borderColor: 'black',
    backgroundColor: '#1F1C1B',
    marginBottom: heightPercentageToDP(2),
  },
  columnsView: {
    flexDirection: 'column',
    width: '50%',
    justifyContent: 'flex-start',
    paddingHorizontal: '5%',
  },
  rowView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: heightPercentageToDP(2),
    marginBottom: heightPercentageToDP(1),
    paddingHorizontal: 5,
  },

  category: [
    textStyles.hugeSemiBold,
    {
      color: colors.white,
      fontSize: actuatedNormalize(11),
    },
  ],
  amount: [
    textStyles.hugeRegular,
    {
      color: colors.white,
      fontSize: actuatedNormalize(11),
    },
  ],
  category2: [
    textStyles.hugeSemiBold,
    {
      color: colors.white,
      fontSize: actuatedNormalize(16),
    },
  ],
  amount2: [
    textStyles.hugeRegular,
    {
      color: colors.white,
      fontSize: actuatedNormalize(16),
    },
  ],
})

export { ExplorePosition }
