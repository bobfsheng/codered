import React, { memo, useState, useEffect, useRef } from 'react'
import { StyleSheet, View, Dimensions, Text, Animated, Platform } from 'react-native'
import {
  colors,
  heightPercentageToDP,
  widthPercentageToDP,
  textStyles,
  actuatedNormalize,
} from '@utils'
import { LineChart } from 'react-native-chart-kit'

const CustomExploreChart = memo(({ lastQuote, data, closePrice, barDataLabels }) => {
  const screenWidth = Dimensions.get('window').width
  const [chartClick, setChartClick] = useState(null)
  const [chartClickTime, setChartClickTime] = useState(null)
  const [chartClickCoords, setChartClickCoords] = useState({ x: 0, y: 0 })

  const chartConfig = {
    touchSensitivity: 40,
    backgroundColor: colors.darkBackground,
    backgroundGradientFrom: colors.darkBackground,
    backgroundGradientTo: colors.darkBackground,
    fontSize: actuatedNormalize(12),
    decimalPlaces:
      parseFloat(lastQuote)?.toFixed(0).length > 4 ||
      parseFloat(closePrice)?.toFixed(0).length > 4
        ? 0
        : 2, // optional, defaults to 2dp
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

  const chartWidthAnimation = useRef(new Animated.Value(screenWidth * 0.16)).current
  // const chartWidthAnimation = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(chartWidthAnimation, {
      toValue: widthPercentageToDP(Platform.isPad !== true ? 100 : 39),
      duration: 1700,
      useNativeDriver: false,
    }).start()
  }, [data])

   const formatValue = value => {
     if (!value) return
     return value
       ?.toString()
       ?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
   }
  

  return (
    <>
      <Animated.View style={{ width: chartWidthAnimation, overflow: 'hidden' }}>
        <LineChart
          bezier
          data={data}
          withInnerLines={false}
          withOuterLines={false}
          width={screenWidth}
          height={heightPercentageToDP(30)}
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
            marginTop: heightPercentageToDP(3),
            marginLeft: widthPercentageToDP(2),
            borderRadius: 20,
          }}
        />
      </Animated.View>
      {chartClick !== null && (
        <View
          style={{
            position: 'absolute',
            marginTop: heightPercentageToDP(2),
            top: chartClickCoords.y, // Y coordinate of the clicked point
            left: chartClickCoords.x, // X coordinate of the clicked point
            width: heightPercentageToDP(1.5), // Width of the circle
            height: heightPercentageToDP(1.5), // Height of the circle
            borderRadius: 25, // Make it round
            backgroundColor: colors.primary2, // Color of the circle
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
    </>
  )
})
const styles = StyleSheet.create({
  positionCard: {
    flexDirection: 'column',
    alignItems: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    paddingVertical: heightPercentageToDP(1),
    width: widthPercentageToDP(35),
    borderRadius: heightPercentageToDP(1),
    borderWidth: widthPercentageToDP(0.7),
    borderColor: colors.primary,
    marginHorizontal: widthPercentageToDP(1.5),
  },
  symbol: [
    textStyles.normalSemiBold,
    {
      color: 'white',
      fontSize: actuatedNormalize(16),
      paddingHorizontal: widthPercentageToDP(3),
      alignContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      justifyContent: 'center',
    },
  ],
})
export { CustomExploreChart }
