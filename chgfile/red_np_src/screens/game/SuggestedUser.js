import React, { useState } from 'react'
import {
  StyleSheet,
  Keyboard,
  Pressable,
  View,
  Text,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker'
import {
  actuatedNormalize,
  colors,
  heightPercentageToDP,
  textStyles,
  widthPercentageToDP,
  capitalize,
} from '@utils'
import { userActions, useReduxDispatch, useAuthSelector } from '@store'
import AnimatedLinearGradient from 'react-native-animated-linear-gradient'
import {
  CustomButton,
  CustomInputLabel,
  Icon,
  CustomSearchBar,
  HorizontalRule,
  AccountBalanceBar,
  VirtualizedView,
  BetUserComponent,
  ChallengeAmount,
  OrderConfirmModal,
  ChallengeSentBottomSheet,
  InvestErrorModal,
  BackChevron,
} from '@components'
import { usePlaceBetting } from '../../hooks/profile/Betting/usePlaceBetting'
import { useSearchFriends } from '@hooks'

const SuggestedUser = () => {
  return (
    <View
      style={{
        marginTop: heightPercentageToDP(2),
        backgroundColor: 'black',
        borderColor: colors.primary,
        borderWidth: heightPercentageToDP(0.3),
        borderRadius: heightPercentageToDP(1),
        width: widthPercentageToDP(40),
        justifyContent: 'center',
        height: heightPercentageToDP(23),
      }}>
      <View
        style={{
          backgroundColor: 'white',
          borderRadius: heightPercentageToDP(30),
          width: widthPercentageToDP(13),
          height: widthPercentageToDP(13),
          alignSelf: 'center',
          justifyContent: 'center',
        }}>
        <Text
          style={[
            textStyles.hugeMedium,
            {
              // marginHorizontal:widthPercentageToDP(10),
              fontSize: actuatedNormalize(11),
              textAlign: 'center',
              color: 'black',
              // marginTop:heightPercentageToDP(2)
            },
          ]}>
          🏆
        </Text>
      </View>
      <Text
        numberOfLines={1}
        style={[
          textStyles.hugeMedium,
          {
            marginVertical: widthPercentageToDP(3),
            // width:widthPercentageToDP(30),
            fontSize: actuatedNormalize(13),
            textAlign: 'center',
            color: 'white',
            // marginTop:heightPercentageToDP(2)
          },
        ]}>
        Anya
      </Text>
      <View
        style={{
          backgroundColor: 'white',
          paddingHorizontal: widthPercentageToDP(4),
          paddingVertical: heightPercentageToDP(1),
          borderRadius: heightPercentageToDP(10),
          width: widthPercentageToDP(30),
          alignSelf: 'center',
        }}>
        <Text
          style={[
            textStyles.hugeMedium,
            {
              // marginHorizontal:widthPercentageToDP(10),
              fontSize: actuatedNormalize(11),
              textAlign: 'center',
              color: 'black',
              // marginTop:heightPercentageToDP(2)
            },
          ]}>
          Challenge
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({})
export { SuggestedUser }
