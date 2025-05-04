import React, { memo, useState, useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native'
import {
  heightPercentageToDP,
  textStyles,
  widthPercentageToDP,
  actuatedNormalize,
} from '@utils'
import { Icon } from '@components'
import { getNewsGame } from '@services'

const CustomNewsHeadline = memo(({ stockTicker }) => {

const [newsArray, setNewsArray] = useState('')

const getNewsHandleGame = React.useCallback(async () => {
  try {
   const response = await getNewsGame(stockTicker)
    // console.log( 'sjsj', response.news.length)

      let findByKey = (arr, key) => {
        if (!Array.isArray(arr)) {
          return undefined // or throw an error if appropriate
        }

        return (arr?.find(ele => key in ele) || {})[key]
      }
      Object.keys(response).forEach(function (key, index) {
        // console.log('kkkk', response[key])
      })

      // console.log(response.news,"zzauthor")
      if (response) {
        setNewsArray(response.news)
        // console.log((findByKey(newsImages,"url")), 'yellow')

      }
  } catch (error) {
    console.error('Error fetching news:', error)
  }
}, [stockTicker])
  


  useEffect(() => {
    getNewsHandleGame()
  }, [stockTicker])



  return (
    <View>
      <ScrollView>
        {newsArray && newsArray?.map((newsItem, index) => (
          <Text
            key={index}
            numberOfLines={3}
            style={[
              styles.feedBoxText,
              {
                color: 'black',
              },
            ]}>
           - {newsItem.headline}
          </Text>
        ))}
      </ScrollView>
    </View>
  )
})
const styles = StyleSheet.create({
  feedBoxText: [
    textStyles.bigBold,
    {
      color: 'white',
      // width: widthPercentageToDP(65),
      // height:heightPercentageToDP(10),
      fontSize: actuatedNormalize(10),
      marginBottom: heightPercentageToDP(1),
      marginTop: heightPercentageToDP(1),
    },
  ],
})
export { CustomNewsHeadline }
