import React, { useEffect } from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import {
  SignInScreen,
  SignUpScreen,
  ResetPasswordScreen,
  AlpacaAutoRegister,
} from '@screens'

const Stack = createStackNavigator()

const AuthStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="SignInScreen">
      <Stack.Screen name="SignInScreen" component={SignInScreen} />
      <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
      <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} />
      {/* <Stack.Screen name="AlpacaAutoRegister" component={AlpacaAutoRegister} /> */}
    </Stack.Navigator>
  )
}
export { AuthStackNavigator }
