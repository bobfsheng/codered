import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { OrderScreen, PositionScreen } from '@screens'
import { actuatedNormalize, colors } from '@utils'

const TopTab = createMaterialTopTabNavigator()

const OrderAndPositionTopTabNavigator = () => {
  return (
    <TopTab.Navigator
      screenOptions={{
        tabBarLabelStyle: {
          fontFamily: 'DMSans-Medium',
          fontWeight: '500',
          fontSize: actuatedNormalize(13),
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.white,
        tabBarIndicatorStyle: {
          backgroundColor: colors.primary,
          height: 3,
        },
        tabBarStyle: { backgroundColor: colors.mediumDarkBackground },
      }}>
      <TopTab.Screen
        name="PositionScreen"
        options={{ tabBarLabel: 'Positions' }}
        component={PositionScreen}
      />
      <TopTab.Screen
        name="OrderScreen"
        component={OrderScreen}
        options={{ tabBarLabel: 'Orders' }}
      />
    </TopTab.Navigator>
  )
}

export { OrderAndPositionTopTabNavigator }
