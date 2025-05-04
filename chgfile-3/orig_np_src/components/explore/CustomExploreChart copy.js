import React, { memo, useState, useEffect, useRef } from 'react'
import { StyleSheet, View, Dimensions, Text, Animated, Platform,  } from 'react-native'
import {
  colors,
  heightPercentageToDP,
  widthPercentageToDP,
  textStyles,
  actuatedNormalize,
} from '@utils'
import { LineChart } from 'react-native-chart-kit'


const CustomExploreChart = memo(
  ({
    lastQuote,
    data,
    closePrice,
    barDataLabels,
  }) => {
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
              // console.log('shsj',barDataLabels[index])
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
              backgroundColor: 'white',
              padding: widthPercentageToDP(2),
              borderRadius: widthPercentageToDP(1),
              justifyContent: 'center',
              alignItems: 'center',
              top: chartClickCoords.y - 20,
              left:
                chartClickCoords.x -
                (chartClickCoords.x > screenWidth - 120 ? widthPercentageToDP(34) : 0),
              alignSelf: 'flex-end',
            }}>
            <Text
              style={[
                textStyles.normalSemiBold,
                {
                  color: 'black',
                },
              ]}>
              {`Price: $ ${chartClick} / `}
              {chartClickTime}
            </Text>
          </View>
        )}
      </>
    )
  },
)
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



// import React, { memo, useState, useEffect, useRef } from 'react'
// import { StyleSheet, View, Dimensions, Text, Animated, Platform } from 'react-native'
// import {
//   colors,
//   heightPercentageToDP,
//   widthPercentageToDP,
//   textStyles,
//   actuatedNormalize,
// } from '@utils'
// import { LineChart } from 'react-native-gifted-charts'

// const CustomExploreChart = memo(({ lastQuote, data, closePrice, barDataLabels }) => {
//   const screenWidth = Dimensions.get('window').width

//   // Extracting the data array from the dataset
//   const priceData = data.datasets[0].data

//   // Mapping the data to the format required by react-native-gifted-charts
//   const formattedData = priceData.map((price, index) => ({
//     value: parseFloat(price),
//     date: barDataLabels[index],
//     // just using index as date, you can replace it with actual dates if available
//   }))

//   const [selectedData, setSelectedData] = useState(null)
//   const minPrice = Math.min(...priceData)
//   const maxPrice = Math.max(...priceData)

//   console.log(minPrice, maxPrice, formattedData)

//   return (
//     <View
//       style={{
//         // paddingVertical: 100,

//         marginTop: heightPercentageToDP(3),
//         marginLeft: widthPercentageToDP(2),
//         backgroundColor: 'rgba(20,85,81,0.0)',
//       }}>
//       <LineChart
//         areaChart
//         data={formattedData}
//         rotateLabel
//         minValue={-10}
//         maxValue={maxPrice}
//         softMin={-100}
//         width={screenWidth}
//         hideDataPoints
//         spacing={widthPercentageToDP(5)}
//         color="white"
//         thickness={actuatedNormalize(3)}
//         startFillColor="rgba(20,105,81,0)"
//         endFillColor="rgba(20,85,81,0.0)"
//         startOpacity={0}
//         endOpacity={0}
//         // initialSpacing={0}
//         noOfSections={6}
//         yAxisColor="white"
//         yAxisThickness={0}
//         rulesType="solid"
//         rulesColor="rgba(20,85,81,0.0)"
//         yAxisTextStyle={{ color: 'gray' }}
//         yAxisSide="right"
//         xAxisColor="rgba(20,85,81,0.0)"
//         pointerConfig={{
//           pointerStripHeight: 160,
//           pointerStripColor: 'rgba(20,85,81,0.0)',
//           pointerStripWidth: 2,
//           pointerColor: 'rgba(20,85,81,0.0)',
//           radius: 6,
//           pointerLabelWidth: 100,
//           pointerLabelHeight: 90,
//           activatePointersOnLongPress: true,
//           autoAdjustPointerLabelPosition: false,
//           pointerLabelComponent: items => {
//             setSelectedData(items[0])
//             return (
//               <View
//                 style={{
//                   // height: heightPercentageToDP(5),
//                   // width: widthPercentageToDP(10),
//                   padding: widthPercentageToDP(1),
//                   justifyContent: 'center',
//                   marginTop: -30,
//                   marginLeft: -40,
//                 }}>
//                 <Text
//                   style={[
//                     textStyles.normalSemiBold,
//                     {
//                       color: 'white',
//                       textAlign: 'center',
//                       marginBottom: 6,
//                     },
//                   ]}>
//                   {items[0].date}
//                 </Text>
//                 <View
//                   style={{
//                     paddingHorizontal: 14,
//                     paddingVertical: 6,
//                     borderRadius: 16,
//                     backgroundColor: 'white',
//                   }}>
//                   <Text
//                     style={[
//                       textStyles.normalSemiBold,
//                       {
//                         color: 'black',
//                         textAlign: 'center',
//                       },
//                     ]}>
//                     {'$' + items[0].value.toFixed(2)}
//                   </Text>
//                 </View>
//               </View>
//             )
//           },
//         }}
//       />
//       {selectedData && (
//         <View>
//           {/* Display additional information about the selected data here */}
//           <Text>Selected Price: {selectedData.value.toFixed(2)}</Text>
//         </View>
//       )}
//     </View>
//   )
// })
// const styles = StyleSheet.create({
//   positionCard: {
//     flexDirection: 'column',
//     alignItems: 'center',
//     alignContent: 'center',
//     alignSelf: 'center',
//     justifyContent: 'center',
//     paddingVertical: heightPercentageToDP(1),
//     width: widthPercentageToDP(35),
//     borderRadius: heightPercentageToDP(1),
//     borderWidth: widthPercentageToDP(0.7),
//     borderColor: colors.primary,
//     marginHorizontal: widthPercentageToDP(1.5),
//   },
//   symbol: [
//     textStyles.normalSemiBold,
//     {
//       color: 'white',
//       fontSize: actuatedNormalize(16),
//       paddingHorizontal: widthPercentageToDP(3),
//       alignContent: 'center',
//       alignItems: 'center',
//       alignSelf: 'center',
//       justifyContent: 'center',
//     },
//   ],
// })
// export { CustomExploreChart }
