import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { colors, headerOptions, widthPercentageToDP } from '@utils'
import {
  History,
  Profile,
  Settings,
  DeleteAccount,
  BioEditorScreen,
  ProfileUser,
  BlockScreen,
  Purchases,
  InfoScreenSettings,
  EmojiSelectorScreen,
  ReportScreen,
  InvestScreenPosition,
  ExplorePosition,
  Chat,
  OrderConfirmation
} from '@screens'
import {
  SignInScreen,
  SignUpScreen,
  ResetPasswordScreen,
} from '@screens'
import { useAuthSelector } from '@store'
import { OrderAndPositionTopTabNavigator } from '../toptabs'
import { SafeAreaView } from 'react-native'
import { BackChevron, ScreenTitle } from '@components'
import { NavigationService } from '@navigation'

const AccountStack = createStackNavigator()

const AccountStackNavigator = ({ navigation, route }) => {
  const { isLoggedIn } = useAuthSelector(state => state)

  return (
    <AccountStack.Navigator screenOptions={headerOptions}>
      {isLoggedIn ? (
        <AccountStack.Group>
          <AccountStack.Screen name="Profile" component={Profile} />
          <AccountStack.Screen
            name="ProfileUser"
            component={ProfileUser}
            options={{
              headerLeft: () => <BackChevron />,
              headerRight: () => <ScreenTitle title="" />,
              headerShown: true,
            }}
          />
            <AccountStack.Screen
        name="InvestScreenPosition"
        component={InvestScreenPosition}
        options={{  headerLeft: () => <BackChevron />, headerShown: true,}}
            />
             <AccountStack.Screen
        name="OrderConfirmation"
        component={OrderConfirmation}
        options={{
          headerLeft: () => <BackChevron />,
          headerShown: true,
        }}
      />
         <AccountStack.Screen
        name="ExplorePosition"
        component={ExplorePosition}
        options={{  headerLeft: () => <BackChevron />, headerShown: true,}}
            />
          <AccountStack.Screen
            name="BioEditorScreen"
            component={BioEditorScreen}
            options={{
              headerLeft: () => <BackChevron />,
              headerRight: () => <ScreenTitle title="Edit Your Bio" />,
              headerShown: true,
            }}
          />
          <AccountStack.Screen
            name="Settings"
            component={Settings}
            options={{
              headerLeft: () => <BackChevron />,
              headerRight: () => <ScreenTitle title="Settings " />,
              headerShown: true,
            }}
          />
          <AccountStack.Screen
            name="History"
            component={History}
            options={{
              headerLeft: () => <BackChevron />,
              headerRight: () => <ScreenTitle title="History" />,
              headerShown: true,
            }}
          />
          <AccountStack.Screen
            name="Purchases"
            component={Purchases}
            options={{
              headerLeft: () => <BackChevron />,
              headerRight: () => (
                <ScreenTitle
                  style={{ width: widthPercentageToDP(40) }}
                  title="Ads Free"
                />
              ),
              //   headerLeft: () => <BackChevron/> ,
              // headerRight: () => <TouchableOpacity onPress={() => { valueToAdd == 1000 ?
              //   setErrorModal(true)  : rewarded.show();
              // }}><ScreenTitle title='Free Money'/></TouchableOpacity>,
              headerShown: true,
            }}
          />
          <AccountStack.Screen name="Chat" component={Chat} />
          <AccountStack.Screen
            name="EmojiSelectorScreen"
            component={EmojiSelectorScreen}
            options={{
              headerLeft: () => <BackChevron />,
              headerRight: () => <ScreenTitle title="Emoji Selector" />,
              headerShown: true,
            }}
          />
          <AccountStack.Screen
            name="DeleteAccount"
            component={DeleteAccount}
            options={{
              headerLeft: () => <BackChevron />,
              headerRight: () => <ScreenTitle title="Delete Account" />,
              headerShown: true,
            }}
          />
          <AccountStack.Screen
            name="OrderAndPositionTopTab"
            component={OrderAndPositionTopTabNavigator}
            options={{
              ...headerOptions,
              headerShown: true,
              header: ({ navigation, route, options, layout }) => {
                return (
                  <SafeAreaView
                    style={{
                      height: 100,
                      width: widthPercentageToDP(100),
                      backgroundColor: colors.darkBackground,
                    }}>
                    <BackChevron
                      onPress={() => {
                        NavigationService.navigate('Profile', {})
                      }}
                    />
                  </SafeAreaView>
                )
              },
            }}
          />
          <AccountStack.Screen name="ReportScreen" component={ReportScreen} />
          <AccountStack.Screen name="BlockScreen" component={BlockScreen} />
          <AccountStack.Screen
            name="InfoScreen"
            component={InfoScreenSettings}
            options={({ route }) => ({
              headerLeft: () => (
                <BackChevron
                  onPress={() =>
                    NavigationService.navigate(isLoggedIn ? 'Profile' : 'SignUpScreen')
                  }
                />
              ),
              headerRight: () => (
                <ScreenTitle  style={{width:widthPercentageToDP(90), alignSelf:'flex-end', alignItems:'flex-end',alignContent:'flex-end' }} title={route?.params?.screenS || 'Info Screen'} />
              ),
              headerShown: true,
            })}
          />
        </AccountStack.Group>
      ) : (
        <AccountStack.Group>
          <AccountStack.Screen name="SignUpScreen" component={SignUpScreen} />
          <AccountStack.Screen name="SignInScreen" component={SignInScreen} />
          <AccountStack.Screen
            name="ResetPasswordScreen"
            component={ResetPasswordScreen}
            options={{
              headerLeft: () => <BackChevron />,
              headerRight: () => <ScreenTitle title="Reset Password" />,
              headerShown: true,
            }}
          />
        </AccountStack.Group>
      )}
    </AccountStack.Navigator>
  )
}

export { AccountStackNavigator }
