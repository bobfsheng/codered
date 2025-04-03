import React, { memo, useRef, useState, useEffect, useCallback, useMemo } from 'react'
import { debounce } from 'lodash'

import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  ActivityIndicator,
} from 'react-native'
import { NavigationService } from '@navigation'
import { useUserSelector } from '@store'
import {
  actuatedNormalize,
  colors,
  heightPercentageToDP,
  textStyles,
  useDebounce,
  widthPercentageToDP,
} from '@utils'
import { sortingArr } from '@constants/sortingArr'
import { HorizontalRule } from './HorizontalRule'
import { Icon } from '@components'
import { TouchableOpacity } from 'react-native-gesture-handler'

const CustomStockTicker = ({ setFinalSelectedStock, tab }) => {
  const { stockTickers } = useUserSelector(state => state)
  const textInputRef = useRef(null)
  const [searchStockString, setSearchStockString] = useState('')
  const [searchStock, setSearchStock] = useState([])
  const [showDropDown, setShowDropDown] = useState(false)
  const [selectedStock, setSelectedStock] = useState(null)

  const newStockTickers = useMemo(() => {
    return stockTickers
      .filter(item => JSON.stringify(item?.tradable) == 'true')
      .sort((a, b) => {
        const indexA = sortingArr.indexOf(a?.symbol)
        const indexB = sortingArr.indexOf(b?.symbol)

        if (indexA === -1) {
          return 1
        } else if (indexB === -1) {
          return -1
        }

        return indexA - indexB
      })
  }, [stockTickers])

  const truncateString = (str, num) => {
    if (str?.length > num) {
      return str?.slice(0, num) + ' ....'
    } else {
      return str
    }
  }
  const handleSearchStock = useCallback(
    debounce(() => {
      setSelectedStock(null)
      setSearchStock([])

      if (!searchStockString) {
        return
      }

      // Convert the search string to lowercase for case-insensitive comparison.
      const searchStringLower = searchStockString.toLowerCase()

      // Filter and sort stocks based on the search string.
      const filteredAndSortedStocks = newStockTickers
        .filter(
          item =>
            item.name.toLowerCase().includes(searchStringLower) ||
            item.symbol.toLowerCase().includes(searchStringLower),
        )
        .map(item => {
          // Determine the rank based on type of match
          let rank = 0
          const nameLower = item.name.toLowerCase()
          const symbolLower = item.symbol.toLowerCase()

          // Exact match on symbol or name gets the highest rank
          if (symbolLower === searchStringLower || nameLower === searchStringLower) {
            rank = 3
            // Match at the start of symbol or name gets the second highest rank
          } else if (
            symbolLower.startsWith(searchStringLower) ||
            nameLower.startsWith(searchStringLower)
          ) {
            rank = 2
            // Containing the search string gets the lowest rank
          } else {
            rank = 1
          }

          return { ...item, rank }
        })
        .sort((a, b) => b.rank - a.rank || a.symbol.localeCompare(b.symbol)) // Sort by rank first, then alphabetically by symbol

      setSearchStock(filteredAndSortedStocks)
    }, 500),
    [searchStockString, newStockTickers],
  )

  useDebounce(handleSearchStock, [searchStockString], 500) // Adjust the debounce time as necessary

  const handleSelectStock = item => {
    setSelectedStock(item)
    setSearchStockString(item.name)
    setShowDropDown(false)
    textInputRef.current.blur()
  }
  const handlePressDropDownIcon = () => {
    setShowDropDown(prev => !prev)
    if (textInputRef.current.isFocused()) {
      textInputRef.current.blur()
    } else {
      textInputRef.current.focus()
    }
  }

  useEffect(() => {
    if (selectedStock?.id) {
      setFinalSelectedStock(selectedStock)
      if (tab !== 'Invest') {
        NavigationService.navigate('ExploreScreen', {
          stockTicker: selectedStock?.symbol,
          selectedFinalStock: selectedStock,
          stockName: selectedStock?.name,
        })
      }
    }
  }, [selectedStock])

  const CustomStockTickerField = memo(({ item }) => {
    //UI BUG FIX  .filter(word => word.length > 6)
    return (
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => {
          handleSelectStock(item)
        }}>
        <View
          style={{
            height: heightPercentageToDP(9),
            justifyContent: 'center',
            marginHorizontal: 40,
          }}>
          <Text
            style={[
              textStyles.smallMedium,
              { color: 'white', marginVertical: 1, fontSize: actuatedNormalize(13) },
            ]}>
            {truncateString(
              item?.name
                ?.replace('Common Shacires', '')
                ?.replace('Common Share', '')
                ?.replace('CLASS A', '')
                ?.replace('Class A', '')
                ?.replace('Ordinary Stock', '')
                ?.replace('Ordinary Stocks', '')
                ?.replace('Ordinary Share', '')
                ?.replace('ORDINARY STOCK', '')
                ?.replace('Common Stock', '')
                ?.replace('COMMON STOCK', '')
                ?.replace('COMMON SHARE', '')
                ?.replace(', Inc.', '')
                ?.replace('Inc.', '')
                ?.replace('  s', '')
                ?.replace('Corporation', '')
                ?.replace('CORPORATION', '')
                ?.replace('Corp.', '')
                ?.replace('Corp', '')
                ?.replace('Inc', '')
                ?.replace('Inc s', '')
                ?.replace('INC', '')
                ?.replace('INC.', '')
                ?.replace('Ltd s', '')
                ?.replace('Ltd', '')
                ?.replace('Ordinary Shares', ''),
              60,
            )}
          </Text>
          <Text
            style={[
              textStyles.smallRegular,
              { color: 'gray', marginVertical: 1, fontSize: actuatedNormalize(12) },
            ]}>
            {item.symbol}
          </Text>
        </View>
      </TouchableOpacity>
    )
    // }
  })

  const renderItem = useCallback(({ item }) => {
    return <CustomStockTickerField item={item} />
  }, [])

  return (
    <View style={{ width: '100%' }}>
      <View style={styles.textInputContainer}>
        <Icon
          type="FontAwesome"
          name="search"
          color={colors.offWhite}
          size={widthPercentageToDP(5)}
          style={{ marginHorizontal: widthPercentageToDP(5) }}
        />
        <TextInput
          ref={textInputRef}
          placeholder={'Search company or stock symbol'}
          placeholderTextColor={colors.offWhite}
          value={searchStockString}
          onChangeText={setSearchStockString}
          style={styles.textInput}
          onFocus={() => {
            setShowDropDown(true)
          }}
          onBlur={() => {
            setShowDropDown(false)
          }}
        />
        <Icon
          type="FontAwesome5"
          name={showDropDown ? 'caret-up' : 'caret-right'}
          color={showDropDown ? colors.offWhite : '#474747'}
          size={widthPercentageToDP(5)}
          style={{ marginHorizontal: widthPercentageToDP(5) }}
          onPress={handlePressDropDownIcon}
        />
      </View>
      {showDropDown && (
        <View
          style={{
            maxHeight: heightPercentageToDP(35),
            marginLeft: heightPercentageToDP(-3),
            marginTop: heightPercentageToDP(2),
          }}>
          {searchStockString?.length > 0 && newStockTickers?.length < 1 ? (
            <View
              style={{
                backgroundColor: colors.darkBackground,
                height: heightPercentageToDP(30),
                justifyContent: 'center',
              }}>
              <ActivityIndicator />
            </View>
          ) : (
            <FlatList
              data={searchStockString?.length > 0 ? searchStock : newStockTickers}
              renderItem={renderItem}
              style={{
                backgroundColor: colors.darkBackground,
                width: widthPercentageToDP(103),
              }}
              ItemSeparatorComponent={() => (
                <HorizontalRule style={{ marginVertical: 0 }} />
              )}
              initialNumToRender={10}
              extraData={newStockTickers}
            />
          )}
        </View>
      )}
    </View>
  )
}
const styles = StyleSheet.create({
  textInputContainer: {
    width: '100%',
    height: heightPercentageToDP(6),
    backgroundColor: '#3A3A3A',
    marginTop: heightPercentageToDP(0.5),
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
  },
  textInput: [
    textStyles.normalRegular,
    {
      width: '70%',
      height: '100%',
      color: colors.white,
      fontSize: actuatedNormalize(11),
    },
  ],
})
export { CustomStockTicker }
