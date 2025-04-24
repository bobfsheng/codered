import React, { useEffect, useState, useCallback } from 'react'
import { View, Text, StyleSheet, Dimensions, Platform, TouchableOpacity } from 'react-native'
import {
  actuatedNormalize,
  colors,
  textStyles,
  widthPercentageToDP,
  heightPercentageToDP,
} from '@utils'
import moment from 'moment'
import { LineChart } from 'react-native-chart-kit'
import {
  // getPortfolioHistory,
  getPortfolioHistoryD,
  getPortfolioHistoryM,
  getPortfolioHistoryW,
  // getPortfolioHistoryY,
} from '@services'

function ProfileChart({}) {
  const [barDataSet, setBarDataSet] = useState([0, 0, 0])
  const [chartClick, setChartClick] = useState(null)
  const [chartClickTime, setChartClickTime] = useState(null)
  const [chartClickCoords, setChartClickCoords] = useState({ x: 0, y: 0 })
  const [selectedGraphList, setSelectedGraphList] = useState('1M')
  const [barDataLabels, setBarDataLabels] = useState(['', '', ''])


  const screenWidth = Dimensions.get('window').width
  const graphsList = ['1D', '1W', '1M']

  const fetchPortfolioData = async historyFunction => {
    const labelArr = []
    const labelFormat = getLabelFormat(selectedGraphList)

    const response = await historyFunction()
    if (response?.data?.timestamp) {
      response.data.timestamp.forEach(timestamp => {
        labelArr.push(moment.unix(timestamp).format(labelFormat))
      })
      setBarDataLabels(labelArr)
      setBarDataSet(response.data.equity)
    } else {
      resetChartData()
    }
  }

  const getLabelFormat = graphList => {
    switch (graphList) {
      case '1W':
        return 'DD MMM' // Define label format for '1W'
      case '1M':
        return 'DD MMM'
      case '1D':
        return 'MMM DD hh:mmA'
      default:
        return 'DD MMM' // Default format
    }
  }

  const resetChartData = () => {
    setBarDataSet([0, 0, 0, 0, 0])
    setBarDataLabels(['', '', '', '', ''])
  }

  useEffect(() => {
    switch (selectedGraphList) {
      case '1W':
        fetchPortfolioData(getPortfolioHistoryW)
        break
      case '1M':
        fetchPortfolioData(getPortfolioHistoryM)
        break
      case '1D':
        fetchPortfolioData(getPortfolioHistoryD)
        break
      default:
        fetchPortfolioData(getPortfolioHistoryM)
    }
  }, [selectedGraphList])

  const data = {
    datasets: [
      {
        data: barDataSet,
        // strokeWidth: 2, // optional
      },
    ],
    // legend: [stockTicker], // optional
  }

  
  // const chartConfig = {
  //   touchSensitivity: 40,
  //   backgroundColor: colors.darkBackground,
  //   backgroundGradientFrom: colors.darkBackground,
  //   backgroundGradientTo: colors.darkBackground,
  //   fontSize: actuatedNormalize(12),
  //   decimalPlaces: 0, // optional, defaults to 2dp
  //   fillShadowGradientOpacity: 0.5,
  //   fillShadowGradientFromOffset: 1,
  //   color: (opacity = 1) => `white`,
  //   fillShadowGradient: colors.darkBackground,
  //   labelColor: (opacity = 0) => colors.darkBackground,
  //   style: {
  //     borderRadius: 16,
  //   },
  //   strokeWidth: '3',
  //   propsForDots: {
  //     r: '30',
  //     strokeWidth: '10',
  //     stroke: `rgba(255, 255, 255, 0)`,
  //     fill: `rgba(255, 255, 255, 0)`,
  //   },
  // }
  const chartConfig = {
    touchSensitivity: 40,
    backgroundColor: colors.darkBackground,
    backgroundGradientFrom: colors.darkBackground,
    backgroundGradientTo: colors.darkBackground,
    fontSize: actuatedNormalize(12),
    decimalPlaces:0,
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

  const formatValue = value => {
    if (!value) return
    return value?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  return (
    <View>
      <LineChart
        bezier
        data={data}
        withInnerLines={false}
        withOuterLines={false}
        width={screenWidth}
        height={heightPercentageToDP(23)}
        segments={2}
        yAxisLabel="$"
        yAxisInterval={2}
        chartConfig={chartConfig}
        touchEnabled
        onDataPointClick={({ value, x, y, index }) => {
          setChartClick(value)
          setChartClickTime(barDataLabels[index])
          setChartClickCoords({ x, y })
        }}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        style={{
          marginTop: heightPercentageToDP(2),
          marginLeft: widthPercentageToDP(2),
          borderRadius: 20,
        }}
      />
      {chartClick !== null && (
        <View
          style={{
            position: 'absolute',
            marginTop: heightPercentageToDP(1.2),
            top: chartClickCoords.y, // Y coordinate of the clicked point
            left: chartClickCoords.x, // X coordinate of the clicked point
            width: heightPercentageToDP(1.5), // Width of the circle
            height: heightPercentageToDP(1.5), // Height of the circle
            borderRadius: 25, // Make it round
            backgroundColor: colors.primary2, // Color of the circle// Make it round
          }}
        />
      )}
      {chartClick !== null && (
        <>
          <View
            style={{
              position: 'absolute',
              justifyContent: 'center',
              alignItems: 'center',
              top: chartClickCoords.y - 20,
              left:
                chartClickCoords.x -
                (chartClickCoords.x > screenWidth - 120 ? widthPercentageToDP(36) : -15),
            }}>
            <Text
              style={[
                textStyles.normalSemiBold,
                {
                  color: 'white',
                  marginBottom: heightPercentageToDP(1),
                },
              ]}>
              {chartClickTime}
            </Text>
            <View
              style={{
                backgroundColor: 'white',
                padding: widthPercentageToDP(2),
                paddingHorizontal: widthPercentageToDP(10),
                borderRadius: widthPercentageToDP(1),
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: actuatedNormalize(40),
                alignSelf: 'flex-end',
              }}>
              <Text
                style={[
                  textStyles.normalSemiBold,
                  {
                    color: 'black',
                  },
                ]}>
                {chartClick < 1000 ? `$ ${chartClick} ` : `$ ${formatValue(chartClick)} `}
              </Text>
            </View>
          </View>
        </>
      )}
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'space-evenly',
          marginBottom: heightPercentageToDP(2),
        }}>
        {graphsList.map((item, index) => {
          return (
            <TouchableOpacity
              style={{
                backgroundColor: item === selectedGraphList ? '#9ECB90' : 'transparent',
                width: widthPercentageToDP(17),
                height: heightPercentageToDP(4),
                borderRadius: widthPercentageToDP(1),
                alignItems: 'center',
                alignContent: 'center',
                justifyContent: 'center',
              }}
              key={index}
              onPress={() => {
                setSelectedGraphList(item)
              }}>
              <Text
                style={[
                  textStyles.normalBold,
                  {
                    color: item === selectedGraphList ? 'white' : 'gray',
                  },
                ]}>
                {item}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginVertical: heightPercentageToDP(1),
    marginHorizontal: widthPercentageToDP(3),
  },
  icon: {
    resizeMode: 'contain',
    width: widthPercentageToDP(5),
    marginRight: widthPercentageToDP(4),
  },
})

export { ProfileChart }
