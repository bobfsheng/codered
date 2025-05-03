import React, { useState, useEffect, useCallback, useMemo } from 'react'
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Share,
  RefreshControl,
  Linking,
  Platform,
  Pressable,
} from 'react-native'
import dynamicLinks from '@react-native-firebase/dynamic-links'
import {
  actuatedNormalize,
  colors,
  heightPercentageToDP,
  textStyles,
  widthPercentageToDP,
  capitalize,
} from '@utils'
import {
  BackChevron,
  CustomButton,
  HorizontalRule,
  HorizontalRuleDouble,
  Icon,
  CustomNewsFeed,
  CustomExploreChart,
  CustomExploreChartBar,
  StockPrices,
  TickerInfo,
  ExploreAbout,
  ExploreTopBar,
  ExploreListButtons,
  ExploreStockInfo,
} from '@components'
import {
  getNews,
  getBarsD,
  getBarsH,
  getBarsM,
  getBarsY,
  getBarsA,
  getBar,
  getCrypto,
  getCryptoA,
  getLastQuote,
  getLastQuoteCrypto,
} from '@services'
import moment from 'moment'
import { NavigationService } from '@navigation'
import { useWatchlistHook } from '@hooks'

const ExploreScreen = ({ route }) => {
  const cryptos = require('@constants/cryptos.json')

  // const foundStock = stockInfo.find(stock => stock.symbol === stockTicker);

  const [selectedButton, setSelectedButton] = useState(1)
  const handleButtonPress = button => {
    setSelectedButton(button)
  }

  const [newsAuthor, setNewsAuthor] = useState('')
  const [newsHeadline, setNewsHeadline] = useState('')
  const [newsSymbols, setNewsSymbols] = useState('')
  const [newsURL, setNewsURL] = useState('')
  const [newsDate, setNewsDate] = useState('')
  const [newsImages, setNewsImages] = useState('')
  const [newsSummary, setNewsSummary] = useState('')
  const [newsSource, setNewsSource] = useState('')
  const [newsContent, setNewsContent] = useState('')
  const [newsImageURL, setNewsImageURL] = useState(false)
  const [feedBoxModal, setFeedBoxModal] = useState(false)

  const { stockTicker, selectedFinalStock, stockName } = route?.params

  const [refreshing, setRefreshing] = useState(false)
  const [refreshingColor, setRefreshingColor] = useState(false)
  const [lastQuote, setLastQuote] = useState(0)
  const [selectedGraphList, setSelectedGraphList] = useState('1M')
  const [barDataLabels, setbarDataLabels] = useState(['', '', ''])

  const [barDataSet, setbarDataSet] = useState([0, 0, 0])
  const [volume, setVolume] = useState(0)
  const [closePrice, setClosePrice] = useState(0)
  const [closePriceYesterday, setClosePriceYesterday] = useState(0)
  const [lowPrice, setLowPrice] = useState(0)
  const [highPrice, setHighPrice] = useState(0)
  const [openPrice, setOpenPrice] = useState(0)

  const { handleAddToWatchList, handleRemoveFromWatchList, addWatchlistBool } =
    useWatchlistHook()

  // if (foundStock) {
  //   console.log(foundStock.info.longBusinessSummary);
  // } else {
  //   console.log('No stock found with this ticker');
  // }

  const handleShare = async () => {
    try {
      const linkUrl = `https://redvest.app?stockticker=${stockTicker}&apn=app.redvest&isi=1609301338&ibi=com.redko.redvest`
      const link = await dynamicLinks().buildShortLink(
        {
          link: linkUrl,
          domainUriPrefix: 'https://redvest.page.link',
          android: { packageName: 'com.redko.redvest' },
        },
        dynamicLinks.ShortLinkType.SHORT,
      )
      await Share.share({
        message: `Check out ${stockTicker} stock, last price was $ ${lastQuote} per share! ${link}`,
      })
    } catch (error) {
      console.error('Share error:', error)
    }
  }

  const handleBuy = () => {
    NavigationService.navigate('Invest', {
      screen: 'InvestTab',
      params: {
        stockTicker: stockTicker,
      },
    })
  }

  const handleBuyCrypto = () => {
    NavigationService.navigate('Invest', {
      screen: 'EasyCryptoInvestScreen',
      params: {
        isCrypto: selectedFinalStock?.class,
      },
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
    const response = await getCrypto(stockTicker)
    const symbolString =
      cryptos.includes(stockTicker) === true
        ? stockTicker
        : selectedFinalStock.symbol.toString()
    const data = response?.bars[symbolString]
    if (response?.bars) {
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
    const response = await getCryptoA(stockTicker)
    if (response?.bars) {
      handleDataAndLabel(
        response?.bars?.[
          cryptos.includes(stockTicker) === true
            ? stockTicker
            : selectedFinalStock?.symbol
        ],
        'ALL',
      )
    } else {
      setbarDataSet([0, 0, 0, 0, 0])
      setbarDataLabels(['', '', '', '', ''])
    }
  }, [])

  const getCryptoMHandle = React.useCallback(async () => {
    const response = await getCryptoA(stockTicker)
    if (response?.bars) {
      handleDataAndLabel(
        response?.bars?.[
          cryptos.includes(stockTicker) === true
            ? stockTicker
            : selectedFinalStock?.symbol
        ],
        '1M',
      )
    } else {
      setbarDataSet([0, 0, 0, 0, 0])
      setbarDataLabels(['', '', '', '', ''])
    }
  }, [])

  const getCryptoYHandle = React.useCallback(async () => {
    const response = await getCryptoA(stockTicker)
    if (response?.bars) {
      handleDataAndLabel(
        response?.bars?.[
          cryptos.includes(stockTicker) === true
            ? stockTicker
            : selectedFinalStock?.symbol
        ],
        '1Y',
      )
    } else {
      setbarDataSet([0, 0, 0, 0, 0])
      setbarDataLabels(['', '', '', '', ''])
    }
  }, [])

  const getCryptoDHandle = React.useCallback(async () => {
    const response = await getCryptoA(stockTicker)
    if (response?.bars) {
      handleDataAndLabel(
        response?.bars?.[
          cryptos.includes(stockTicker) === true
            ? stockTicker
            : selectedFinalStock?.symbol
        ],
        '1W',
      )
    } else {
      setbarDataSet([0, 0, 0, 0, 0])
      setbarDataLabels(['', '', '', '', ''])
    }
  }, [])

  const getCryptoHHandle = React.useCallback(async () => {
    const response = await getCryptoA(stockTicker)
    if (response?.bars) {
      handleDataAndLabel(
        response?.bars?.[
          cryptos.includes(stockTicker) === true
            ? stockTicker
            : selectedFinalStock?.symbol
        ],
        '1H',
      )
    } else {
      setbarDataSet([0, 0, 0, 0, 0])
      setbarDataLabels(['', '', '', '', ''])
    }
  }, [])

  const data = {
    datasets: [
      {
        data: barDataSet,
        // strokeWidth: 2, // optional
      },
    ],
    // legend: [stockTicker], // optional
  }

  selectedFinalStock?.class == 'crypto' || cryptos.includes(stockTicker) === true
    ? useEffect(() => {
        getCryptoHandle()
        switch (selectedGraphList) {
          case '1H':
            getCryptoHHandle()
            break
          case '1W':
            getCryptoDHandle()
            break
          case '1M':
            getCryptoMHandle()

            break
          case '1Y':
            getCryptoYHandle()

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

  const getNewsHandle = React.useCallback(async () => {
    const response = await getNews(stockTicker)

    let findByKey = (arr, key) => {
      if (!Array.isArray(arr)) {
        return undefined // or throw an error if appropriate
      }

      return (arr?.find(ele => key in ele) || {})[key]
    }

    if (response) {
      setNewsAuthor(findByKey(response.news, 'author'))
      setNewsHeadline(findByKey(response.news, 'headline'))
      setNewsImages(findByKey(response.news, 'images'))
      setNewsDate(findByKey(response.news, 'created_at'))
      setNewsURL(findByKey(response.news, 'url'))
      setNewsDate(findByKey(response.news, 'updated_at'))
      setNewsSource(findByKey(response.news, 'source'))
      setNewsContent(findByKey(response.news, 'content'))
      setNewsSummary(findByKey(response.news, 'summary'))
      setNewsSymbols(findByKey(response.news, 'symbols'))
      setNewsImageURL(findByKey(newsImages, 'url'))
    }
  }, [])

  const handleRefresh = async () => {
    setRefreshingColor(true)
    setRefreshing(true)
    getNewsHandle()
    // ;(async () => {
    if (stockTicker) {
      try {
        const response =
          selectedFinalStock?.class === 'crypto' || cryptos.includes(stockTicker) === true
            ? await getLastQuoteCrypto(stockTicker.toString())
            : await getLastQuote(stockTicker)
        if (response) {
          if (
            selectedFinalStock?.class === 'crypto' ||
            cryptos.includes(stockTicker) === true
          ) {
            setLastQuote(response?.quotes?.[stockTicker?.toString().toString()].ap)
          } else {
            setLastQuote(response?.trade?.p)
          }
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
      <ExploreTopBar
        stockTicker={stockTicker}
        addWatchlistBool={addWatchlistBool}
        handleShare={handleShare}
        handleRemoveFromWatchList={handleRemoveFromWatchList}
        handleAddToWatchList={handleAddToWatchList}
      />
      <ExploreListButtons
        selectedButton={selectedButton}
        handleButtonPress={handleButtonPress}
        stockTicker={stockTicker}
      />
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
        <ExploreStockInfo
          stockTicker={stockTicker}
          stockName={stockName}
          lastQuote={lastQuote}
          closePriceYesterday={closePriceYesterday}
          selectedFinalStock={selectedFinalStock}
          refreshingColor={refreshingColor}
        />
        {
          <View>
            <View>
              {volume === 0 ? (
                <View
                  style={{
                    height: heightPercentageToDP(20),
                    marginTop: heightPercentageToDP(10),
                    alignSelf: 'center',
                  }}>
                  <Text
                    style={[
                      textStyles.normalSemiBold,
                      {
                        textAlign: 'center',
                        fontSize: actuatedNormalize(12),
                        width: widthPercentageToDP(70),
                        color: 'white',
                      },
                    ]}>
                    Data will load soon 💵 please check later
                  </Text>
                </View>
              ) : (
                <>
                  <CustomExploreChart
                    lastQuote={lastQuote}
                    data={data}
                    closePrice={closePrice}
                    barDataLabels={barDataLabels}
                    selectedGraphList={selectedGraphList}
                    setSelectedGraphList={setSelectedGraphList}
                  />
                </>
              )}
            </View>
            {cryptos.includes(stockTicker) !== true && (
              <CustomExploreChartBar
                barDataLabels={barDataLabels}
                selectedGraphList={selectedGraphList}
                setSelectedGraphList={setSelectedGraphList}
              />
            )}

            <View style={{}}>
              {/* <Text style={styles.header}>News</Text> */}

              {selectedButton === 1 && (
                <ExploreAbout
                  stockTicker={
                    selectedFinalStock == undefined ? stockTicker : selectedFinalStock
                  }
                  lastQuote={lastQuote}
                />
              )}

              {(selectedButton === 3 || cryptos.includes(stockTicker) === true) && (
                <>
                  <View style={{ alignItems: 'center', marginTop: 10 }}>
                    <HorizontalRule />
                  </View>
                  <View
                    style={[
                      styles.rowView,
                      {
                        flexDirection: 'column',
                        marginLeft: widthPercentageToDP(6),
                        width: '80%',
                      },
                    ]}>
                    <TouchableOpacity onPress={() => setFeedBoxModal(prev => !prev)}>
                      <Text
                        style={[
                          styles.category3,
                          { fontWeight: '900', fontSize: actuatedNormalize(15) },
                        ]}>
                        {capitalize(newsSource)} - {newsAuthor}
                      </Text>
                      <Text style={styles.category3}>{newsHeadline}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => Linking.openURL(newsURL)}>
                      <Text style={[styles.category3, { color: 'gray' }]}>Source</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
              <View style={{ alignItems: 'center', marginTop: 10 }}>
                {selectedFinalStock?.class == 'crypto' ||
                cryptos.includes(stockTicker) === true ? null : (
                  <TickerInfo
                    volume={volume}
                    closePrice={closePrice}
                    lowPrice={lowPrice}
                    highPrice={highPrice}
                    openPrice={openPrice}
                  />
                )}
                {!(stockName == undefined) && (
                  <StockPrices selectedFinalStock={selectedFinalStock} />
                )}
              </View>
            </View>
          </View>
        }
      </ScrollView>
      {feedBoxModal === true && (
        <CustomNewsFeed
          newsHeadline={newsHeadline}
          newsContent={newsContent}
          setFeedBoxModal={setFeedBoxModal}
          newsImageURL={newsImageURL}
        />
      )}
      <View
        style={{
          position: 'absolute',
          borderColor: 'white',
          borderTopWidth: heightPercentageToDP(0.1),
          alignSelf: 'center',
          justifyContent: 'center',
          marginTop: heightPercentageToDP(
            Platform.isPad === true ? 68 : Platform.OS === 'android' ? 75 : 78,
          ),
          width: widthPercentageToDP(100),
          height: heightPercentageToDP(10),
          backgroundColor: colors.darkBackground,
        }}>
        <CustomButton
          primary
          style={{ alignSelf: 'center' }}
          text={
            selectedFinalStock?.tradable == true || stockName == undefined
              ? 'Buy'
              : 'Explore Categories'
          }
          onPress={
            selectedFinalStock?.class == 'crypto'
              ? handleBuyCrypto
              : selectedFinalStock?.tradable == true || stockName == undefined
              ? handleBuy
              : () => {
                  NavigationService.navigate('Explore', { screen: 'ExploreStocks' })
                }
          }
        />
      </View>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  safeAreaView: {
    backgroundColor: colors.darkBackground,
    marginBottom: heightPercentageToDP(10),
    paddingBottom: heightPercentageToDP(3),
    flex: 1,
  },
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
      fontSize: actuatedNormalize(12),
    },
  ],
  amount: [
    textStyles.hugeRegular,
    {
      color: colors.white,
      fontSize: actuatedNormalize(12),
    },
  ],
  category2: [
    textStyles.hugeSemiBold,
    {
      color: colors.white,
      fontSize: actuatedNormalize(14),
    },
  ],
  category3: [
    textStyles.hugeSemiBold,
    {
      color: colors.white,
      width: widthPercentageToDP(90),
      fontSize: actuatedNormalize(14),
      marginBottom: heightPercentageToDP(1.5),
    },
  ],
  amount2: [
    textStyles.hugeRegular,
    {
      color: colors.white,
      fontSize: actuatedNormalize(16),
    },
  ],
  feedModal: {
    width: widthPercentageToDP(100),
    height: heightPercentageToDP(50),
    backgroundColor: 'white',
    alignSelf: 'center',
    marginHorizontal: widthPercentageToDP(1),
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
    position: 'absolute',
    paddingHorizontal: widthPercentageToDP(4),
    paddingVertical: heightPercentageToDP(1),
  },
  feedBoxText: [
    textStyles.bigBold,
    {
      color: 'white',
      width: widthPercentageToDP(65),
      fontSize: actuatedNormalize(12),
      marginBottom: heightPercentageToDP(1),
      marginTop: heightPercentageToDP(1),
    },
  ],
  feedBoxTextBody: [
    textStyles.bigRegular,
    {
      color: 'white',
      width: widthPercentageToDP(72),
      fontSize: actuatedNormalize(12),
      marginBottom: heightPercentageToDP(2),
    },
  ],
})

export { ExploreScreen }
