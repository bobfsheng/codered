import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { headerOptions, widthPercentageToDP, actuatedNormalize, colors } from '@utils'
import { Icon, ScreenTitle } from '@components'
import {
  ExploreScreen,
  ExploreSelectTicker,
  ExplorePosition,
  ExploreStocks,
  ExploreCategory,
} from '@screens'
import { Share } from 'react-native'
import { NavigationService } from '@navigation'
import dynamicLinks from '@react-native-firebase/dynamic-links'

const ExploreStack = createStackNavigator()

const ExploreStackNavigator = () => {
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
    <ExploreStack.Navigator screenOptions={headerOptions}>
      <ExploreStack.Screen
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
      <ExploreStack.Screen
        name="ExploreScreen"
        component={ExploreScreen}
        options={{ headerShown: false }}
      />
      <ExploreStack.Screen
        name="ExploreStocks"
        component={ExploreStocks}
        options={{
          headerShown: true,
          headerLeft: () => (
            <Icon
              type="Ionicons"
              name="ios-chevron-back"
              size={actuatedNormalize(19)}
              color={colors.offWhite}
              style={{ marginLeft: widthPercentageToDP(5) }}
              onPress={() => {
                 NavigationService.navigate('ExploreSelectTicker')
              }}
            />
          ),
          headerRight: () => (
            <ScreenTitle title="Categories" style={{ right: widthPercentageToDP(5) }} />
          ),
        }}
      />
      <ExploreStack.Screen name="ExploreCategory" component={ExploreCategory} />
      <ExploreStack.Screen name="ExplorePosition" component={ExplorePosition} />

      {/** 
    <ExploreStack.Screen
        name="StockTickerExplore"
        component={StockTickerExplore}
        options={{ headerLeft: () => <BackChevron />,
          headerShown: false }}
      />
      <ExploreStack.Screen
        name="Explore"
        component={Explore}
        options={{ headerLeft: () => <BackChevron />, headerShown: true }}
      />
        <ExploreStack.Screen
        name="ExploreStocks"
        component={ExploreStocks}
        options={{ headerLeft: () => <BackChevron />, headerShown: true }}
      />
      <ExploreStack.Screen
        name="InvestScreenExplore"
        component={InvestScreenExplore}
        options={{ headerLeft: () => <BackChevron />, headerShown: true, headerStyle: {
          backgroundColor:"#3E3E3E",
        },
         }}
      />
      */}
    </ExploreStack.Navigator>
  )
}

export { ExploreStackNavigator }
