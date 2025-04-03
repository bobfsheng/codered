import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { BackChevron, ScreenTitle } from '@components'
import { headerOptions } from '@utils'
import {
  InvestScreenPosition,
  SelectTicker,
  OrderConfirmation,
  InfoScreen,
  EasyCryptoInvestScreen,
} from '@screens'

const CryptoStack = createStackNavigator()

const CryptoStackNavigator = ({ route }) => {
  return (
    <CryptoStack.Navigator screenOptions={headerOptions}>
      <CryptoStack.Screen
        name="EasyCryptoInvestScreen"
        component={EasyCryptoInvestScreen}
        options={{ headerShown: false }}
      />
      {/* <CryptoStack.Screen
        name="InvestCryptoTab"
        component={InvestCryptoTab}
        options={{ headerShown: false }}
      /> */}
      <CryptoStack.Screen
        name="InvestScreenPosition"
        component={InvestScreenPosition}
        options={{ headerShown: false }}
      />

      <CryptoStack.Screen
        name="SelectTicker"
        component={SelectTicker}
        options={{
          headerLeft: () => <BackChevron />,
          headerRight: () => <ScreenTitle title="Select Assets" />,
          headerShown: true,
        }}
      />

      <CryptoStack.Screen
        name="OrderConfirmation"
        component={OrderConfirmation}
        options={{
          headerLeft: () => <BackChevron />,
          headerShown: true,
        }}
      />
      <CryptoStack.Screen
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
      {/**  <CryptoStack.Screen
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
      <CryptoStack.Screen
        name="InvestScreenEasy"
        component={InvestScreenEasy}
        options={{ headerShown: false }}
      />
       <CryptoStack.Screen
        name="InvestScreenPosition"
        component={InvestScreenPosition}
        options={{ headerShown: false }}
      />
       <CryptoStack.Screen
        name="ExploreInvest"
        component={ExploreInvest}
        options={{
          headerLeft: () => <BackChevron onPress={() => {
            navigation.navigate('InvestScreen')
            }}/>,
        }}
      />
      <CryptoStack.Screen
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
       <CryptoStack.Screen
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
 <CryptoStack.Screen
        name="SearchScreen"
        component={SearchScreen}
        options={{ headerShown: false }}
      />
      <CryptoStack.Screen
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
       <CryptoStack.Screen
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
      <CryptoStack.Screen
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
      <CryptoStack.Screen
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
      <CryptoStack.Screen
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
      <CryptoStack.Screen
        name="LimitInfoScreen"
        component={LimitInfoScreen}
        options={{
          headerLeft: () => <BackChevron onPress={() => {
            navigation.navigate('InvestScreen')
            }}/>,
          title: "Limit info",
        }}
      />
      <CryptoStack.Screen
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
      <CryptoStack.Screen
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
      <CryptoStack.Screen
        name="StopLossInfo"
        component={StopLossInfoScreen}
        options={{
          headerLeft: () => <BackChevron onPress={() => {
            navigation.navigate('InvestScreen')
            }}/>,
          title: "Stop loss info",
        }}
      />
      <CryptoStack.Screen
        name="OrderConfirm"
        component={OrderConfirm}
        options={{
          headerLeft: () => <BackChevron onPress={() => {
            navigation.navigate('InvestScreen')
            }}/>,
          title: "Order Confirmation",
      }}
      />
      <CryptoStack.Screen
        name="OrderConfirmE"
        component={OrderConfirmE}
        options={{
          headerLeft: () => <BackChevron onPress={() => {
            navigation.navigate('InvestScreen')
            }}/>,
          title: "Order ConfirmationE",
        }}
      />
      <CryptoStack.Screen
        name="CryptoStack"
        component={CryptoStackNavigator}
        options={{ headerShown: false }}
      />
    */}
    </CryptoStack.Navigator>
  )
}

export { CryptoStackNavigator }
