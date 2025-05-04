import React from 'react'
import { View, Text, Platform, Pressable } from 'react-native'
import { textStyles, widthPercentageToDP, actuatedNormalize, colors } from '@utils'
import { NavigationService } from '@navigation'

const CustomStockBubbles = ({ activities, positions, selectedBubbleButton }) => {
  const cryptos = require('@constants/cryptos.json')

  const filteredData = activities?.filter(item => item.side === 'buy')

  const aggregatedData = filteredData.reduce((acc, item) => {
    const existingIndex = acc.findIndex(e => e.symbol === item.symbol)

    if (existingIndex !== -1) {
      acc[existingIndex].size += parseFloat(item.price) * parseFloat(item.qty)
    } else {
      acc.push({
        symbol: item.symbol,
        label: item.symbol,
        size: parseFloat(item.price) * parseFloat(item.qty),
        money: parseFloat(item.price) * parseFloat(item.qty),
        total: parseFloat(item.price) * parseFloat(item.qty),
      })
    }

    return acc
  }, [])

  const aggregatedDataPositions = positions.reduce((acc, item) => {
    const existingIndex = acc.findIndex(e => e.symbol === item.symbol)

    if (existingIndex !== -1) {
      acc[existingIndex].size += parseFloat(item.unrealized_plpc)
    } else {
      acc.push({
        symbol: item.symbol,
        label: item.symbol,
        money: parseFloat(item.unrealized_plpc),
        size: parseFloat(item.unrealized_pl),
        total: parseFloat(item.unrealized_pl),
      })
    }
    return acc
  }, [])

  const bubbleColors = [
    '#47A980',
    '#47A980',
    '#839100',
    '#ADD55E',
    '#80A471',
    '#AFC07E',
    '#79A471',
    colors.primary,
    '#9ED49F',
    '#729A67',
  ]

  const getRandomColor = usedColors => {
    const availableColors = bubbleColors?.filter(color => !usedColors?.includes(color))
    if (availableColors.length === 0) {
      return bubbleColors[Math.floor(Math.random() * bubbleColors?.length)]
    }
    return availableColors[Math.floor(Math.random() * availableColors?.length)]
  }

  const colorMap = aggregatedData.reduce((acc, entry) => {
    if (!acc[entry.label]) {
      acc[entry.label] = getRandomColor()
    }
    return acc
  }, {})

  const colorMapPositions = aggregatedDataPositions.reduce((acc, entry) => {
    if (!acc[entry.label]) {
      acc[entry.label] = getRandomColor()
    }
    return acc
  }, {})

  const getRandomPosition = (size, max) => {
    const padding = size / 2
    return Math.floor(Math.random() * (max - size - 2 * padding)) + padding
  }

  const maxValue = Math.max(...aggregatedData.map(d => d.size))

  const minSize = Math.min(...aggregatedData.map(entry => entry.size))
  const maxSize = Math.max(...aggregatedData.map(entry => entry.size))

  const normalizeSize = size => {
    if (maxSize === minSize) {
      // If there is only one bubble, return a default size
      return widthPercentageToDP(30)
    }

    const normalizedSize =
      ((size - minSize) / (maxSize - minSize)) * widthPercentageToDP(10) +
      widthPercentageToDP(20)
    return normalizedSize
  }
  const chartData = aggregatedData.map((entry, index) => ({
    size: normalizeSize(entry.size),
    label: entry.label,
    total: entry.size,
    x: getRandomPosition(normalizeSize(entry.size), widthPercentageToDP(90)),
    y: getRandomPosition(normalizeSize(entry.size), widthPercentageToDP(50)),
    color: colorMap[entry.label],
    money: entry.money,
  }))

  const chartDataPositions = aggregatedDataPositions.map((entry, index) => ({
    size: normalizeSize(entry.size),
    total: entry.size,
    label: entry.label,
    x: getRandomPosition(normalizeSize(entry.size), widthPercentageToDP(90)),
    y: getRandomPosition(normalizeSize(entry.size), widthPercentageToDP(50)),
    color: colorMapPositions[entry.label],
    money: entry.money,
  }))

  const Bubble = ({ x, y, size, label, total, color, money, selectedBubbleButton }) => {
    const bubbleStyle = {
      // position: 'absolute',
      // left: x,
      // top: y,
      width: size + widthPercentageToDP(3),
      height: size + widthPercentageToDP(3),
      borderRadius: (size + widthPercentageToDP(3)) / 2,
      marginVertical: widthPercentageToDP(1),
      marginHorizontal: widthPercentageToDP(2),

      justifyContent: 'center',
      alignItems: 'center',
    }

    const formatValuePR = value => {
      if (!value) return
      return value
        ?.toFixed(2)
        ?.toString()
        ?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
    const formatValue = value => {
      if (!value) return
      return value
        ?.toFixed(0)
        ?.toString()
        ?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }

    return (
      <Pressable
        onPress={() => {
          cryptos.includes(label) === false
            ? NavigationService.navigate('Invest', {
                screen: 'InvestTab',
                params: {
                  stockTicker: label,
                },
              })
            : NavigationService.navigate('Invest', {
                screen: 'EasyCryptoInvestScreen',
                params: {
                  isCrypto: 'crypto',
                },
              })
        }}>
        <View
          style={[bubbleStyle, { backgroundColor: money < 0 ? colors.redError : color }]}>
          <Text
            style={[
              textStyles.bigBold,
              {
                color: 'white',
                fontSize: actuatedNormalize(
                  Platform.isPad !== true ? size / 6 : size / 10,
                ),
              },
            ]}>
            {label}
          </Text>
          <Text
            style={[
              textStyles.bigBold,
              {
                color: 'white',
                fontSize: actuatedNormalize(
                  Platform.isPad !== true ? size / 10 : size / 12,
                ),
              },
            ]}>
            {selectedBubbleButton == 2 &&
              `% ${formatValuePR(money) == undefined ? '' : formatValuePR(money)}   `}
            <Text style={[textStyles.bigBold, { color: 'white' }]}>
              ${formatValue(total)}
            </Text>
          </Text>
        </View>
      </Pressable>
    )
  }

  const bubblesPositions = chartDataPositions.map((entry, index) => (
    <Bubble
      key={index}
      x={entry.x}
      y={entry.y}
      size={entry.size}
      label={entry.label}
      color={entry.color}
      money={entry.money}
      total={entry.total}
      selectedBubbleButton={selectedBubbleButton}
    />
  ))

  const bubbles = chartData.map((entry, index) => (
    <Bubble
      key={index}
      x={entry.x}
      y={entry.y}
      size={entry.size}
      label={entry.label}
      color={entry.color}
      total={entry.total}
      money={entry.money}
      selectedBubbleButton={selectedBubbleButton}
    />
  ))

  return (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Pressable
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() =>
          NavigationService.navigate('Invest', {
            screen: 'InvestTab',
            params: {
              stockTicker: label,
            },
          })
        }>
        {selectedBubbleButton === 1 ? bubbles : bubblesPositions}
      </Pressable>
    </View>
  )
}

export { CustomStockBubbles }
