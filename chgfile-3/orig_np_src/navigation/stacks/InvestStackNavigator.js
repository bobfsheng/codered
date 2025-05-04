import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { BackChevron, ScreenTitle } from '@components'
import { headerOptions } from '@utils'
import {
  InvestTab,
  InvestScreenPosition,
  SelectTicker,
  OrderConfirmation,
  InfoScreen,
  EasyCryptoInvestScreen,
  ExplorePosition,
} from '@screens'

const InvestStack = createStackNavigator()

const InvestStackNavigator = ({ route }) => {
  return (
    <InvestStack.Navigator screenOptions={headerOptions}>
      <InvestStack.Screen
        name="InvestTab"
        component={InvestTab}
        options={{ headerShown: false }}
      />
      <InvestStack.Screen
        name="InvestScreenPosition"
        component={InvestScreenPosition}
        options={{ headerLeft: () => <BackChevron />, headerShown: true }}
      />
      <InvestStack.Screen
        name="ExplorePosition"
        component={ExplorePosition}
        options={{ headerLeft: () => <BackChevron />, headerShown: true }}
      />
      <InvestStack.Screen
        name="EasyCryptoInvestScreen"
        component={EasyCryptoInvestScreen}
        options={{
          headerShown: false,
        }}
      />

      <InvestStack.Screen
        name="SelectTicker"
        component={SelectTicker}
        options={{
          headerLeft: () => <BackChevron />,
          headerRight: () => <ScreenTitle title="Select Assets" />,
          headerShown: true,
        }}
      />

      <InvestStack.Screen
        name="OrderConfirmation"
        component={OrderConfirmation}
        options={{
          headerLeft: () => <BackChevron />,
          headerShown: true,
        }}
      />
      <InvestStack.Screen
        name="InfoScreen"
        component={InfoScreen}
        options={({ route }) => ({
          headerLeft: () => <BackChevron />,
          headerRight: () => (
            <ScreenTitle title={route?.params?.screenS || 'Info Screen'} />
          ),
          headerShown: true,
        })}
      />
      {/**  <InvestStack.Screen
        name="Invest"
        component={() => (
          <InvestScreen
            investStock={route?.params?.stocks}
            lastQuote={route?.params?.lastQuote}
            stocks={route?.params?.params?.stocks}
            
          />
          
        )}
        options={{ headerShown: false }}
      />
      <InvestStack.Screen
        name="InvestScreenEasy"
        component={InvestScreenEasy}
        options={{ headerShown: false }}
      />
       <InvestStack.Screen
        name="InvestScreenPosition"
        component={InvestScreenPosition}
        options={{ headerShown: false }}
      />
       <InvestStack.Screen
        name="ExploreInvest"
        component={ExploreInvest}
        options={{
          headerLeft: () => <BackChevron onPress={() => {
            navigation.navigate('InvestScreen')
            }}/>,
        }}
      />
      <InvestStack.Screen
        name="StockTickerInvest"
        component={StockTickerInvest}
        options={{
          headerLeft: () => <BackChevron onPress={() => {
            navigation.navigate('InvestScreen')
            }}/>,
          title: "Pick a Stock Ticker",
          headerRight: () => <ScreenTitle title="Pick a Stock" />,
        }}
      />
       <InvestStack.Screen
        name="StockTickerInvestEasy"
        component={StockTickerInvestEasy}
        options={{
          headerLeft: () => <BackChevron onPress={() => {
            navigation.navigate('InvestScreen')
            }}/>,
          title: "Pick a Stock Ticker",
          headerRight: () => <ScreenTitle title="Stock Ticker Finder" />,
        }}
      />
 <InvestStack.Screen
        name="SearchScreen"
        component={SearchScreen}
        options={{ headerShown: false }}
      />
      <InvestStack.Screen
        name="StockTickerInfo"
        component={StockTickerInfoScreen}
        options={{
          headerLeft: () => <BackChevron onPress={() => {
            navigation.navigate('InvestScreen')
            }}/>,
          title: "Stock ticker info",
          headerRight: () => <ScreenTitle title="Stock Ticker " />,
        }}
      />
       <InvestStack.Screen
        name="BuyingPower"
        component={BuyingPower}
        options={{
          headerLeft: () => <BackChevron onPress={() => {
            navigation.navigate('InvestScreen')
            }}/>,
          title: "BuyingPower",
          headerRight: () => <ScreenTitle title="Buying Power" />,
        }}
      />
      <InvestStack.Screen
        name="CashInfoScreen"
        component={CashInfoScreen}
        options={{
          headerLeft: () => <BackChevron onPress={() => {
            navigation.navigate('InvestScreen')
            }}/>,
          title: "Cash Available",
          headerRight: () => <ScreenTitle title="Cash Balance" />,
        }}
      />
      <InvestStack.Screen
        name="PriceInfo"
        component={PriceInfoScreen}
        options={{
          headerLeft: () => <BackChevron onPress={() => {
            navigation.navigate('InvestScreen')
            }}/>,
          title: "Price info",
          headerRight: () => <ScreenTitle title="Share Price" />,
        }}
      />
      <InvestStack.Screen
        name="QuantityInfo"
        component={QuantityInfoScreen}
        options={{
          headerLeft: () => <BackChevron onPress={() => {
            navigation.navigate('InvestScreen')
            }}/>,
          title: "Quantity info",
          headerRight: () => <ScreenTitle title="Share Quantity " />,
        }}
      />
      <InvestStack.Screen
        name="LimitInfoScreen"
        component={LimitInfoScreen}
        options={{
          headerLeft: () => <BackChevron onPress={() => {
            navigation.navigate('InvestScreen')
            }}/>,
          title: "Limit info",
        }}
      />
      <InvestStack.Screen
        name="OrderTypeInfo"
        component={OrderTypeInfoScreen}
        options={{
          headerLeft: () => <BackChevron onPress={() => {
            navigation.navigate('InvestScreen')
            }}/>,
          title: "Order type info",
          headerRight: () => <ScreenTitle title="Order Type" />,
        }}
      />
      <InvestStack.Screen
        name="TimeInForceInfo"
        component={TimeInForceInfoScreen}
        options={{
          headerLeft: () => <BackChevron onPress={() => {
            navigation.navigate('InvestScreen')
            }}/>,
          title: "Time in force info",
          headerRight: () => <ScreenTitle title="Time Info Screen" />,
        }}
      />
      <InvestStack.Screen
        name="StopLossInfo"
        component={StopLossInfoScreen}
        options={{
          headerLeft: () => <BackChevron onPress={() => {
            navigation.navigate('InvestScreen')
            }}/>,
          title: "Stop loss info",
        }}
      />
      <InvestStack.Screen
        name="OrderConfirm"
        component={OrderConfirm}
        options={{
          headerLeft: () => <BackChevron onPress={() => {
            navigation.navigate('InvestScreen')
            }}/>,
          title: "Order Confirmation",
      }}
      />
      <InvestStack.Screen
        name="OrderConfirmE"
        component={OrderConfirmE}
        options={{
          headerLeft: () => <BackChevron onPress={() => {
            navigation.navigate('InvestScreen')
            }}/>,
          title: "Order ConfirmationE",
        }}
      />
      <InvestStack.Screen
        name="InvestStack"
        component={InvestStackNavigator}
        options={{ headerShown: false }}
      />
    */}
    </InvestStack.Navigator>
  )
}

export { InvestStackNavigator }
