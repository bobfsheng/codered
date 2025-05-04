import { CommonActions } from '@react-navigation/native'

let _navigator

function setTopLevelNavigator(navigatorRef: any) {
  _navigator = navigatorRef
}

function navigate(routeName: any, params: any) {
  _navigator.dispatch(
    CommonActions.navigate({
      name: routeName,
      params,
    }),
  )
}
function reset(routes: any) {
  _navigator.dispatch(
    CommonActions.reset({
      index: 1,
      routes,
    }),
  )
}

// [
//   {
//     name: 'AuthStackNavigator',
//     params: {
//       screen: 'SignInScreen',
//     },
//   },
//   {
//     name: 'BottomTabNavigator',
//     params: {
//       screen: 'Home',
//     },
//   }, //BottomTabNavigator
// ]
function goBack() {
  _navigator.dispatch(CommonActions.goBack())
}
function setParams(params) {
  _navigator.dispatch(CommonActions.setParams(params))
}

export default {
  navigate,
  setTopLevelNavigator,
  reset,
  goBack,
  setParams,
}
