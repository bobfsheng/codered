import React from 'react'
import { Platform } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import { colors, heightPercentageToDP, textStyles } from '@utils'
import HomeIcon from '@assets/bottom-tabs/HomeIcon'
import InvestIcon from '@assets/bottom-tabs/InvestIcon'
import AccountIcon from '@assets/bottom-tabs/AccountIcon'
import ExploreIcon from '@assets/bottom-tabs/ExploreIcon'
import GameIcon from '@assets/bottom-tabs/GameIcon'
import CryptoIcon from '@assets/bottom-tabs/CryptoIcon'
import {
  HomeStackNavigator,
  InvestStackNavigator,
  AccountStackNavigator,
  ExploreStackNavigator,
  GameStackNavigator,
  CryptoStackNavigator,
  OnboardingStackNavigator,
} from '../stacks'
import { useUserSelector } from '@store'

HomeStackNavigator

const BottomTab = createBottomTabNavigator()
console.disableYellowBox = true

function BottomTabNavigator({ navigation, route }) {
  const { onboardingGame } = useUserSelector(state => state)

  return (
    <BottomTab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.darkBackground,
          height: heightPercentageToDP(
            Platform.isPad === false ? 12 : Platform.OS == 'android' ? 10 : 7,
          ),
          paddingBottom: heightPercentageToDP(3.2),
          paddingTop: heightPercentageToDP(1),
        },
        safeAreaInsets: { top: 100 },
        tabBarHideOnKeyboard: true,
        tabBarLabelStyle: textStyles.tinyRegular,
        tabBarActiveTintColor: colors.primary,
        tabBarButton:
          ['Onboarding'].includes(route.name) ||
          ['AlpacaAutoRegister'].includes(route.name)
            ? () => {
                return null
              }
            : undefined,
      })}>
        {/* for testing onbording change to false */}
      {onboardingGame === true ? (
        <>
          <BottomTab.Screen
            name="Home"
            component={HomeStackNavigator}
            options={{ tabBarIcon: HomeIcon }}
          />
          <BottomTab.Screen
            name="Invest"
            component={InvestStackNavigator}
            options={{ tabBarIcon: InvestIcon }}
          />

          <BottomTab.Screen
            name="Explore"
            component={ExploreStackNavigator}
            options={{ tabBarIcon: ExploreIcon }}
          />
          <BottomTab.Screen
            name="Games"
            component={GameStackNavigator}
            options={{ tabBarIcon: GameIcon }}
          />

          <BottomTab.Screen
            name="Account"
            component={AccountStackNavigator}
            options={{ tabBarIcon: AccountIcon }}
          />
        </>
      ) : (
        <>
          <BottomTab.Screen
            name="Onboarding"
            component={OnboardingStackNavigator}
            options={{
              headerLeft: () => <BackChevron />,
              title: 'Onboarding',
              headerShown: false,
              keyboardHidesTabBar: true,
              tabBarVisible: false,

              tabBarOptions: {
                visible: false,
              },
            }}
          />
        </>
      )}
    </BottomTab.Navigator>
  )
}

export { BottomTabNavigator }
