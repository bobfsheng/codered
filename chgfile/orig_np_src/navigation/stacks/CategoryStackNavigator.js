import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { headerOptions, widthPercentageToDP } from '@utils'
import { Icon, ScreenTitle } from '@components'
import {
  ExploreScreen,
  ExploreSelectTicker,
  ExplorePosition,
  ExploreStocks,
  ExploreCategory,
} from '@screens'
import { Share } from 'react-native'
import dynamicLinks from '@react-native-firebase/dynamic-links'

const CategoryStack = createStackNavigator()

const CategoryStackNavigator = () => {
  const handleShare = async position => {
    try {
      const linkUrl = `https://redvest.app?stockticker=null&apn=app.redvest&isi=1609301338&ibi=com.redko.redvest`

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
        message: `Check out Redvest! \n\n ${link}`,
      })
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
        }
      } else if (result.action === Share.dismissedAction) {
      }
    } catch (error) {
      console.log('error =>', error)
    }
  }
  return (
    <CategoryStack.Navigator screenOptions={headerOptions}>
      <CategoryStack.Screen
        name="ExploreStocks"
        component={ExploreStocks}
        options={{ headerShown: false }}
      />
      <CategoryStack.Screen name="ExploreCategory" component={ExploreCategory} />
      <CategoryStack.Screen
        name="ExploreSelectTicker"
        component={ExploreSelectTicker}
        options={{
          headerShown: true,
          headerLeft: () => (
            <ScreenTitle
              title="Explore Stocks"
              style={{ left: widthPercentageToDP(5) }}
            />
          ),
          headerRight: () => (
            <Icon
              type="Feather"
              name="share"
              size={24}
              color="white"
              onPress={handleShare}
              style={{ marginRight: widthPercentageToDP(5) }}
            />
          ),
        }}
      />
      <CategoryStack.Screen
        name="ExploreScreen"
        component={ExploreScreen}
        options={{ headerShown: false }}
      />

      <CategoryStack.Screen name="ExplorePosition" component={ExplorePosition} />

      {/** 
    <CategoryStack.Screen
        name="StockTickerExplore"
        component={StockTickerExplore}
        options={{ headerLeft: () => <BackChevron />,
          headerShown: false }}
      />
      <CategoryStack.Screen
        name="Explore"
        component={Explore}
        options={{ headerLeft: () => <BackChevron />, headerShown: true }}
      />
        <CategoryStack.Screen
        name="ExploreStocks"
        component={ExploreStocks}
        options={{ headerLeft: () => <BackChevron />, headerShown: true }}
      />
      <CategoryStack.Screen
        name="InvestScreenExplore"
        component={InvestScreenExplore}
        options={{ headerLeft: () => <BackChevron />, headerShown: true, headerStyle: {
          backgroundColor:"#3E3E3E",
        },
         }}
      />
      */}
    </CategoryStack.Navigator>
  )
}

export { CategoryStackNavigator }
