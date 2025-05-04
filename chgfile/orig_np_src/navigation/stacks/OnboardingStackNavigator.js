import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { headerOptions } from '@utils'
import {
Intro
} from '@screens'

const OnboardingStack = createStackNavigator()

const OnboardingStackNavigator = props => {

  return (
    <OnboardingStack.Navigator
      screenOptions={headerOptions}>
      <OnboardingStack.Screen name="Intro" component={Intro} />
    </OnboardingStack.Navigator>
  )
}

export { OnboardingStackNavigator }