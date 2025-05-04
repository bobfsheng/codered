import React from 'react'
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  Linking
} from 'react-native'
import { userActions, useReduxDispatch } from '@store'
import {  Icon, CustomButton } from '@components'
import { colors, heightPercentageToDP, textStyles, widthPercentageToDP } from '@utils'
import InAppBrowser from 'react-native-inappbrowser-reborn'
import { NavigationService } from '@navigation'
import store, { signOutAsync } from '@store'


const cashBalance = require('@assets/images/profile/infor.png')
const lmv = require('@assets/images/profile/about.png')
const Settings = () => {
  const handleSignOut = () => {
    dispatch(signOutAsync(store))
  }
  const dispatch = useReduxDispatch()

  return (
    <SafeAreaView style={styles.safeAreaView}>
      {/* Top Bar */}

      {/* Main Content */}
      <View style={{ flex: 1 }}>
        <ScrollView
         showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
          contentContainerStyle={{
            alignItems: 'center',
          }}>
          {/* ------------- Information -----------*/}
          <Image source={cashBalance} style={styles.headingImage} />
          <Pressable
            style={styles.pressable}
            onPress={() => NavigationService.navigate('Account', { screen: 'EmojiSelectorScreen'})} >
            <Text style={styles.optionText}>Change Profile Image</Text>
            <Icon
              type="Ionicons"
              name="ios-chevron-forward"
              size={widthPercentageToDP(5)}
              color={colors.offWhite}
            />
          </Pressable>
          <Pressable
            style={styles.pressable}
            onPress={() => NavigationService.navigate('Account', { screen: 'BioEditorScreen'})} >
            <Text style={styles.optionText}>Update Your Bio</Text>
            <Icon
              type="Ionicons"
              name="ios-chevron-forward"
              size={widthPercentageToDP(5)}
              color={colors.offWhite}
            />
          </Pressable>
          <Pressable
            style={styles.pressable}
            onPress={() => Linking.openURL('mailto:redvestsupport@theredko.com?subject=Redvest Support&body=Hello Redvest Team, I need help with...') }>
            <Text style={styles.optionText}>Get Support</Text>
            <Icon
              type="Ionicons"
              name="ios-chevron-forward"
              size={widthPercentageToDP(5)}
              color={colors.offWhite}
            />
          </Pressable>
          <Pressable
            style={styles.pressable}
            onPress={() =>
                NavigationService.navigate('ReportScreen',
                   { reportedUserId: 'issue' },
                )}
            >
           <Text style={styles.optionText}>Report Issue</Text>
            <Icon
              type="Ionicons"
              name="ios-chevron-forward"
              size={widthPercentageToDP(5)}
              color={colors.offWhite}
            />
          </Pressable>
          <Pressable
            style={styles.pressable}
            onPress={() => Linking.openURL('mailto:redvestsupport@theredko.com?subject=Redvest Payment Support&body=Hello Redvest Team, I need help with my payment...') }>
            <Text style={styles.optionText}>Payment Support</Text>
            <Icon
              type="Ionicons"
              name="ios-chevron-forward"
              size={widthPercentageToDP(5)}
              color={colors.offWhite}
            />
          </Pressable>
          {/* Redvest Trading Rules */}
          {/* <Pressable
            style={styles.pressable}
            onPress={() =>
              InAppBrowser.open(
                'https://alpaca.markets/docs/trading-on-alpaca/paper-trading/',
              )
            }>
            <Text style={styles.optionText}>Redvest Trading Rules</Text>
            <Icon
              type="Ionicons"
              name="ios-chevron-forward"
              size={widthPercentageToDP(5)}
              color={colors.offWhite}
            />
          </Pressable> */}
          {/* About Alpaca Brokerage */}
          {/* <Pressable
            style={styles.pressable}
            onPress={() => InAppBrowser.open('https://alpaca.markets/docs/about-us/')}>
            <Text style={styles.optionText}>About Alpaca Brokerage</Text>
            <Icon
              type="Ionicons"
              name="ios-chevron-forward"
              size={widthPercentageToDP(5)}
              color={colors.offWhite}
            />
          </Pressable> */}
          {/* Order Types */}
          <Pressable
            style={styles.pressable}
            onPress={() =>
              dispatch(userActions.setInformation({ infoId: 12 }))
            }>
            <Text style={styles.optionText}>Order Types</Text>
            <Icon
              type="Ionicons"
              name="ios-chevron-forward"
              size={widthPercentageToDP(5)}
              color={colors.offWhite}
            />
          </Pressable>
          {/* Manual vs Automated */}
          <Pressable
            style={styles.pressable}
            onPress={() =>
              dispatch(userActions.setInformation({ infoId: 18 }))
            }>
            <Text style={styles.optionText}>Price Information</Text>
            <Icon
              type="Ionicons"
              name="ios-chevron-forward"
              size={widthPercentageToDP(5)}
              color={colors.offWhite}
            />
          </Pressable>
          <Pressable
            style={styles.pressable}
            onPress={() =>
              dispatch(userActions.setInformation({ infoId: 20 }))
            }>
            <Text style={styles.optionText}>Stock Ticker</Text>
            <Icon
              type="Ionicons"
              name="ios-chevron-forward"
              size={widthPercentageToDP(5)}
              color={colors.offWhite}
            />
          </Pressable>
            <Pressable
            style={styles.pressable}
              onPress={() =>
                dispatch(userActions.setInformation({ infoId: 17 }))
              }>
            <Text style={styles.optionText}>Portfolio Value</Text>
            <Icon
              type="Ionicons"
              name="ios-chevron-forward"
              size={widthPercentageToDP(5)}
              color={colors.offWhite}
            />
          </Pressable>
          <Pressable
            style={styles.pressable}
            onPress={() =>
              dispatch(userActions.setInformation({ infoId: 9 }))
            }>
            <Text style={styles.optionText}>Cash Balance</Text>
            <Icon
              type="Ionicons"
              name="ios-chevron-forward"
              size={widthPercentageToDP(5)}
              color={colors.offWhite}
            />
          </Pressable>
          {/* Time In Force*/}
          <Pressable
            style={styles.pressable}
            onPress={() =>
              dispatch(userActions.setInformation({ infoId: 30 }))
            }>
            <Text style={styles.optionText}>Time In Force</Text>
            <Icon
              type="Ionicons"
              name="ios-chevron-forward"
              size={widthPercentageToDP(5)}
              color={colors.offWhite}
            />
          </Pressable>
          {/* Delete Account and Data*/}
          <Pressable
            style={styles.pressable}
            onPress={() => NavigationService.navigate('DeleteAccount', {})}>
            <Text style={styles.optionText}>Delete Account and Data</Text>
            <Icon
              type="Ionicons"
              name="ios-chevron-forward"
              size={widthPercentageToDP(5)}
              color={colors.offWhite}
            />
          </Pressable>
          {/* AUTHORIZE REDVEST TO TRADE*/}
          {/* <Pressable
            style={styles.pressable}
            onPress={() =>
              // alpacaAuthStart
              {}
            }>
            <Text style={styles.optionText}>AUTHORIZE REDVEST TO TRADE</Text>
            <Icon
              type="Ionicons"
              name="ios-chevron-forward"
              size={widthPercentageToDP(5)}
              color={colors.offWhite}
            />
          </Pressable> */}
          {/* ------------- About Redvest -----------*/}
          <Image source={lmv} style={styles.headingImage} />
          {/* Visit Redvest Website*/}
          <Pressable
            style={styles.pressable}
            onPress={() => InAppBrowser.open('https://redvest.app')}>
            <Text style={styles.optionText}>Visit Redvest Website</Text>
            <Icon
              type="Ionicons"
              name="ios-chevron-forward"
              size={widthPercentageToDP(5)}
              color={colors.offWhite}
            />
          </Pressable>
          {/* Terms and Conditions*/}
          <Pressable
            style={styles.pressable}
            onPress={() => InAppBrowser.open('https://redvest.app/terms')}>
            <Text style={styles.optionText}>Terms and Conditions</Text>
            <Icon
              type="Ionicons"
              name="ios-chevron-forward"
              size={widthPercentageToDP(5)}
              color={colors.offWhite}
            />
          </Pressable>
          {/* Privacy Policy*/}
          <Pressable
            style={styles.pressable}
            onPress={() => InAppBrowser.open('https://redvest.app/privacy-policy')}>
            <Text style={styles.optionText}>Privacy Policy</Text>
            <Icon
              type="Ionicons"
              name="ios-chevron-forward"
              size={widthPercentageToDP(5)}
              color={colors.offWhite}
            />
          </Pressable>
          <View
            style={{
              alignItems: 'center',
              marginBottom: heightPercentageToDP(2),
              marginTop: heightPercentageToDP(4),
            }}>
            <CustomButton primary onPress={handleSignOut} text="Sign Out" />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  safeAreaView: {
    paddingTop: 25,
    backgroundColor: colors.darkBackground,
    paddingBottom: heightPercentageToDP(3),
    flex: 1,
  },
  topBar: { flexDirection: 'row' },
  topBarBackChevron: {
    flex: 1,
  },
  topBatTitle: { flex: 4, justifyContent: 'center', alignItems: 'center' },
  headingImage: {
    resizeMode: 'contain',
    width: widthPercentageToDP(90),
    height: heightPercentageToDP(7),
  },
  pressable: {
    flexDirection: 'row',
    marginVertical: heightPercentageToDP(1),
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
  },
  optionText: [
    textStyles.normalRegular,
    {
      color: colors.offWhite,
    },
  ],
})
export { Settings }