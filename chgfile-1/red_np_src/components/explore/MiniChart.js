import React, { memo, useState, useEffect,useRef } from 'react'
import { StyleSheet, View, Platform,Animated } from 'react-native'
import {
  colors,
  heightPercentageToDP,
  widthPercentageToDP,
  textStyles,
  actuatedNormalize,
} from '@utils'
import { getBarsMini, getCryptoMini } from '@services'
import moment from 'moment'
import { NavigationService } from '@navigation'
import { LineChart } from 'react-native-chart-kit'
import { TouchableOpacity } from 'react-native-gesture-handler'

const MiniChart = memo(({ stockTicker, selectedFinalStock, explore }) => {
  const cryptos = require('@constants/cryptos.json')

  const [lastQuote, setLastQuote] = useState(0)
  const [selectedGraphList, setSelectedGraphList] = useState('1W')
  const [barDataLabels, setbarDataLabels] = useState(['', '', ''])

  const [barDataSet, setbarDataSet] = useState([0, 0, 0])
  const [closePrice, setClosePrice] = useState(0)

  const handleDataAndLabel = (bars, selectedGraphList) => {
    const arr = []
    const labelArr = []
    const half = Math.floor(bars.length / 2)
    const quater = Math.floor(half / 2)
    let labelFormate = 'DD MMM'
    switch (selectedGraphList) {
      case '1H':
        break
      case '1W':
        break
      case '1M':
        labelFormate = 'DD MMM'
        break
      case '1Y':
        labelFormate = 'MMM YY'
        break
      case 'ALL':
        labelFormate = 'MMM YY'
        break
      default:
    }
    for (let i = 0; i < bars.length; i++) {
      arr.push(`${bars[i].c}`)
      if (i == 0) {
        labelArr.push(moment(bars[i].t).format(labelFormate))
      }
      if (i == quater) {
        labelArr.push(moment(bars[i].t).format(labelFormate))
      }
      if (i == half) {
        labelArr.push(moment(bars[i].t).format(labelFormate))
      }
      if (i == quater * 3) {
        labelArr.push(moment(bars[i].t).format(labelFormate))
      }
      if (i == bars.length - 1 && quater * 3 != bars.length - 1) {
        labelArr.push(moment(bars[i].t).format(labelFormate))
      }
    }
    setbarDataSet(arr)
    setbarDataLabels(labelArr)
  }

  const getBarsMHandle = React.useCallback(async () => {
    const response = await getBarsMini(stockTicker)
    if (response?.bars) {
      handleDataAndLabel(response?.bars, '1M')
    } else {
      setbarDataSet([0, 0, 0, 0, 0])
      setbarDataLabels(['', '', '', '', ''])
    }
  }, [])

  const getCryptoMHandle = React.useCallback(async () => {
    const response = await getCryptoMini(stockTicker)
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

  const data = {
    datasets: [
      {
        data: barDataSet,
        // strokeWidth: 2, // optional
      },
    ],
    // legend: [stockTicker], // optional
  }

  const firstValue = parseFloat(barDataSet[0])
  const lastValue = parseFloat(barDataSet[barDataSet?.length - 1])

  selectedFinalStock?.class == 'crypto' || cryptos.includes(stockTicker) === true
    ? useEffect(() => {
        getCryptoMHandle()
      }, [selectedGraphList])
    : useEffect(() => {
        getBarsMHandle()
      }, [selectedGraphList])

  const chartConfig = {
    backgroundColor: colors.darkBackground,
    backgroundGradientFrom: colors.darkBackground,
    backgroundGradientTo: colors.darkBackground,
    fontSize: actuatedNormalize(12),
    decimalPlaces:
      parseFloat(lastQuote)?.toFixed(0).length > 4 ||
      parseFloat(closePrice)?.toFixed(0).length > 4
        ? 0
        : 0, // optional, defaults to 2dp
    fillShadowGradientOpacity: 0.5,
    fillShadowGradientFromOffset: 1,
    //color condition here
    color: (opacity = 1) =>
      lastValue < firstValue ? colors.redError : colors.primary,
    fillShadowGradient: colors.darkBackground,
    labelColor: (opacity = 0) => `rgba(255, 255, 255, 0)`,
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

  const fadeInOpacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(fadeInOpacity, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start()
  }, [])


  return (
    <View style={{}}>
      <TouchableOpacity
        onPress={() =>
          NavigationService.navigate('ExploreScreen', {
            stockTicker: stockTicker,
          })
        }>
        <>
          {barDataSet?.length > 1 && (
            <Animated.View style={{ opacity: fadeInOpacity }}>
              <LineChart
                bezier
                data={data}
                withInnerLines={false}
                withOuterLines={false}
                width={widthPercentageToDP(Platform.isPad !== true ? 30 : 39)}
                height={heightPercentageToDP(8)}
                segments={2}
                // yAxisLabel={''}
                yAxisInterval={2}
                chartConfig={chartConfig}
                withHorizontalLabels={false}
                hitSlop={{ top: 0, bottom: 0, left: 0, right: 0 }}
                style={{
                  position: 'absolute',
                  // marginTop: heightPercentageToDP(3),
                  marginLeft: widthPercentageToDP(Platform.isPad !== true ? 35 : 25),
                  borderRadius: 20,
                }}
              />
            </Animated.View>
          )}
        </>
      </TouchableOpacity>
    </View>
  )
})
const styles = StyleSheet.create({
  symbol: [
    textStyles.normalSemiBold,
    {
      color: `rgba(255, 255, 255, 0)`,
      fontSize: actuatedNormalize(16),
      paddingHorizontal: widthPercentageToDP(3),
      alignContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      justifyContent: 'center',
    },
  ],
})
export { MiniChart }
