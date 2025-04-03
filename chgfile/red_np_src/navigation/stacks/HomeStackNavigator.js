import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { headerOptions } from '@utils'
import { NavigationService } from '@navigation'
import { BackChevron, ScreenTitle } from '@components'
import {
  HomeScreen,
  Notifications,
  ExplorePosition,
  ExploreScreen,
  Leaderboard,
  LeaderboardOrg,
  Messages,
  Chat,
  ReportScreen,
  BlockScreen,
  InvestScreenPosition,
  ProfileUser,
  OrderConfirmation,
  Loading,
  OrgSubmission,
  IntroEvent
  // ChatBot,
} from '@screens'
import {
  SignInScreen,
  SignUpScreen,
  ResetPasswordScreen,
  FreeMoney,
  Oauth,
} from '@screens'

const HomeStack = createStackNavigator()

const HomeStackNavigator = props => {
  return (
    <HomeStack.Navigator screenOptions={headerOptions} initialRouteName="HomeScreen">
      {/* <HomeStack.Screen
        name="LeaderboardOrg"
        component={LeaderboardOrg}
        options={{
          headerLeft: () => (
            <BackChevron onPress={() => NavigationService.navigate('HomeScreen')} />
          ),
          headerRight: () => <ScreenTitle title="Org" info={true} />,
          headerShown: true,
        }}
      /> */}
      {/* <HomeStack.Screen
        name="OrgSubmission"
        component={OrgSubmission}
        // options={{
        //   headerLeft: () => (
        //     <BackChevron onPress={() => NavigationService.navigate('HomeScreen')} />
        //   ),
        //   headerRight: () => <ScreenTitle title="Org" info={true} />,
        //   headerShown: true,
        // }}
      /> */}
      {/* initialRouteName="Loading"> */}
      {/* <HomeStack.Screen name="ChatBot" component={ChatBot} /> */}
      {/* <HomeStack.Screen name="Oauth" component={Oauth} /> */}
      <HomeStack.Screen name="SignInScreen" component={SignInScreen} />
      <HomeStack.Screen name="SignUpScreen" component={SignUpScreen} />
      <HomeStack.Screen
        name="ResetPasswordScreen"
        component={ResetPasswordScreen}
        options={{
          headerLeft: () => <BackChevron />,
          headerRight: () => <ScreenTitle title="" />,
          headerShown: true,
        }}
      />
      <HomeStack.Screen name="HomeScreen" component={HomeScreen} />
      <HomeStack.Screen
        name="Leaderboard"
        component={Leaderboard}
        options={{
          headerLeft: () => (
            <BackChevron onPress={() => NavigationService.navigate('HomeScreen')} />
          ),
          headerRight: () => <ScreenTitle title="Leaderboard" info={true} />,
          headerShown: true,
        }}
      />
      <HomeStack.Screen name="Messages" component={Messages} />
      <HomeStack.Screen name="Chat" component={Chat} />
      <HomeStack.Screen
        name="ProfileUser"
        component={ProfileUser}
        options={{
          headerLeft: () => <BackChevron />,
          headerRight: () => <ScreenTitle title="" />,
          headerShown: true,
        }}
      />
      <HomeStack.Screen
        name="InvestScreenPosition"
        component={InvestScreenPosition}
        options={{ headerLeft: () => <BackChevron />, headerShown: true }}
      />
      <HomeStack.Screen
        name="OrderConfirmation"
        component={OrderConfirmation}
        options={{
          headerLeft: () => <BackChevron />,
          headerShown: true,
        }}
      />
      <HomeStack.Screen name="FreeMoney" component={FreeMoney} />
      <HomeStack.Screen
        name="Notifications"
        component={Notifications}
        options={{
          headerLeft: () => <BackChevron />,
          headerRight: () => <ScreenTitle title="Notifications" />,
          headerShown: true,
        }}
      />
      <HomeStack.Screen name="ReportScreen" component={ReportScreen} />
      <HomeStack.Screen name="BlockScreen" component={BlockScreen} />
      <HomeStack.Screen
        name="ExplorePosition"
        component={ExplorePosition}
        options={{ headerLeft: () => <BackChevron />, headerShown: true }}
      />
      <HomeStack.Screen
        name="ExploreScreen"
        component={ExploreScreen}
        options={{ headerShown: false }}
      />
    </HomeStack.Navigator>
  )
}

export { HomeStackNavigator }
