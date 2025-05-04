import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { headerOptions } from '@utils'
import { BackChevron } from '@components'
import {
  Compete,
  CompeteOne,
  ChallengesGame,
  QuizCategory,
  Game,
  WhatIf,
  SwipeScreen,
  ExploreScreen,
  CustomScreen,
  BullorBear,
  BuyorSell,
  QuizMap,
  QuizOptions,
  Guess,
  GameLeaderboard
} from '@screens'
import { NavigationService } from '@navigation'

const GameStack = createStackNavigator()

const GameStackNavigator = ({ route }) => {
  return (
    <GameStack.Navigator
      screenOptions={headerOptions}
      // initialRouteName="BuyorSell">
      // initialRouteName="WhatIf">
      initialRouteName="Game">
      <GameStack.Screen
        name="Guess"
        component={Guess}
        options={{
          headerLeft: () => <BackChevron />,
          headerShown: false,
        }}
      />
      <GameStack.Screen
        name="QuizOptions"
        component={QuizOptions}
        options={{
          headerLeft: () => <BackChevron />,
          headerShown: true,
        }}
      />
      <GameStack.Screen
        name="GameLeaderboard"
        component={GameLeaderboard}
        options={{
          headerLeft: () => <BackChevron />,
          headerShown: true,
        }}
      />
      <GameStack.Screen
        name="QuizMap"
        component={QuizMap}
        options={{
          headerLeft: () => <BackChevron />,
          headerShown: true,
        }}
      />
      <GameStack.Screen
        name="WhatIf"
        component={WhatIf}
        options={{
          headerLeft: () => <BackChevron />,
          headerShown: true,
        }}
      />
      <GameStack.Screen
        name="BuyorSell"
        component={BuyorSell}
        options={{
          headerLeft: () => (
            <BackChevron onPress={() => NavigationService.navigate('Game')} />
          ),
          headerShown: true,
        }}
      />
      <GameStack.Screen
        name="BullorBear"
        component={BullorBear}
        options={{
          headerLeft: () => (
            <BackChevron onPress={() => NavigationService.navigate('Game')} />
          ),
          headerShown: true,
        }}
      />
      <GameStack.Screen
        name="Game"
        component={Game}
        options={{
          headerShown: false,
        }}
      />
      <GameStack.Screen
        name="SwipeScreen"
        component={SwipeScreen}
        options={{
          headerShown: false,
        }}
      />
      <GameStack.Screen
        name="QuizCategory"
        component={QuizCategory}
        options={{
          headerShown: false,
        }}
      />
      <GameStack.Screen
        name="Compete"
        component={Compete}
        options={{
          headerShown: false,
        }}
      />
      <GameStack.Screen
        name="CustomScreen"
        component={CustomScreen}
        options={{
          headerLeft: () => <BackChevron />,
          headerShown: true,
        }}
      />
      <GameStack.Screen
        name="CompeteOne"
        component={CompeteOne}
        options={{
          headerShown: true,
        }}
      />
      <GameStack.Screen
        name="ExploreScreen"
        component={ExploreScreen}
        options={{ headerShown: false }}
      />
      {/* <GameStack.Screen
        name="CrashGame"
        component={CrashGame}
        options={{
          headerShown: true,
        }}
      /> */}
    </GameStack.Navigator>
  )
}

export { GameStackNavigator }
