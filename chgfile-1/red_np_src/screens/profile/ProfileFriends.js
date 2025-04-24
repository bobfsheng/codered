import React, { useEffect, useState } from 'react'
import {
  StyleSheet,
  Pressable,
  View,
  ScrollView,
  Text,
  RefreshControl,
  SafeAreaView,
  Platform,
  TextInput,
} from 'react-native'
import { userActions } from '@store'
import DropDownPicker from 'react-native-dropdown-picker'
import database from '@react-native-firebase/database'
import {
  actuatedNormalize,
  colors,
  heightPercentageToDP,
  textStyles,
  widthPercentageToDP,
  screenTitle,
  StorageKeys,
  localSaveItem,
} from '@utils'
import { useRefreshHookProfile, useRefreshHookExplore } from '@hooks'
import { CustomButton, CustomInputLabel, ChallengeAmount } from '@components'
import store, {
  useAuthSelector,
  useUserSelector,
  useReduxDispatch,
  getAccountOrders,
  getAccountHistory,
  getAccountActivities,
} from '@store'
import { NavigationService } from '@navigation'

const ProfileFriends = () => {
  const dispatch = useReduxDispatch()
  const { positions, activities, accountHistory, cash } = useUserSelector(state => state)
  const { userId } = useAuthSelector(state => state)

  const [openTimeline, setOpenTimeline] = useState(false)
  const [openChallenge, setOpenChallenge] = useState(false)
  const [timeline, setTimeline] = useState('24hours')
  const [times, setTime] = useState([
    { label: '1 hour', value: '1hour' },
    { label: '24 Hours', value: '24hours' },
    { label: '1 Week', value: '1week' },
  ])
  const [challenge, setChallenge] = useState('24hours')
  const [chanllengeType, setChanllengeType] = useState([
    { label: 'Highest Profit In Dollar Amount Wins', value: '1hour' },
    { label: 'Highest Profit In Percentage Wins', value: '24hours' },
  ])

  const [selectedBox, setSelectedBox] = useState(4)
  const [betAmount, setBetAmount] = useState('100')

  const handleBoxPress = button => {
    setSelectedBox(button)
  }
  // console.log('user, ', userBio)

  const { handleRefreshExplore } = useRefreshHookExplore()

  useEffect(() => {
    handleRefreshExplore()
  }, [])

  const { handleRefreshProfile, refreshing } = useRefreshHookProfile()

  useEffect(() => {
    handleRefreshProfile()
    dispatch(getAccountOrders())
    dispatch(getAccountHistory())
    dispatch(getAccountActivities()).catch(error => console.log(error))
  }, [])

  return (
    <View style={{ marginHorizontal: widthPercentageToDP(6) }}>
      <Pressable onPress={() => dispatch(userActions.setInformation({ infoId: 1 }))}>
        <CustomInputLabel text={`Mark vs You`} big />
      </Pressable>
      <View>
        <Pressable
          style={{ marginTop: heightPercentageToDP(2) }}
          onPress={() => dispatch(userActions.setInformation({ infoId: 5 }))}>
          <CustomInputLabel text="Timeline" big info />
        </Pressable>
        <View
          style={{
            width: widthPercentageToDP(40),
            marginTop: heightPercentageToDP(1),
            zIndex: 99,
          }}>
          <DropDownPicker
            dropDownContainerStyle={{
              backgroundColor: colors.lightBrown,
              color: colors.white,
            }}
            style={{
              backgroundColor: '#474747',
              borderRadius: heightPercentageToDP(Platform.isPad === true ? 0.5 : 1.5),
              borderWidth: 0,
            }}
            dropDownDirection="TOP"
            labelStyle={{
              color: '#9ECB8E',
              fontSize: actuatedNormalize(11),
              textAlign: 'center',
              fontFamily: 'DMSans-Medium',
            }}
            listItemLabelStyle={{ color: 'white' }}
            open={openTimeline}
            value={timeline}
            items={times}
            setOpen={setOpenTimeline}
            setValue={setTimeline}
            setItems={setTime}
          />
        </View>
      </View>
      <View>
        <Pressable
          style={{ marginTop: heightPercentageToDP(2) }}
          onPress={() => dispatch(userActions.setInformation({ infoId: 6 }))}>
          <CustomInputLabel text="Challenge Type" big info />
        </Pressable>
        <View
          style={{
            width: widthPercentageToDP(85),
            marginTop: heightPercentageToDP(1),
            zIndex: 99,
          }}>
          <DropDownPicker
            dropDownContainerStyle={{
              backgroundColor: colors.lightBrown,
              color: colors.white,
            }}
            style={{
              backgroundColor: '#474747',
              borderRadius: heightPercentageToDP(Platform.isPad === true ? 0.5 : 1.5),
              borderWidth: 0,
            }}
            dropDownDirection="TOP"
            labelStyle={{
              color: '#9ECB8E',
              fontSize: actuatedNormalize(11),
              textAlign: 'center',
              fontFamily: 'DMSans-Medium',
            }}
            listItemLabelStyle={{ color: 'white' }}
            open={openChallenge}
            value={challenge}
            items={chanllengeType}
            setOpen={setOpenChallenge}
            setValue={setChallenge}
            setItems={setTime}
          />
        </View>
      </View>
      <ChallengeAmount setBetAmount={setBetAmount} betAmount={betAmount} />
      <CustomButton
        primary
        text={`Challenge $${betAmount}`}
        style={{ width: widthPercentageToDP(90), marginTop: heightPercentageToDP(2) }}
      />
      <Text
        style={[
          textStyles.bigBold,
          {
            fontSize: actuatedNormalize(13),
            color: 'white',
          },
        ]}>
        You will win ${betAmount * 1.9} back total.
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, paddingTop: 25, backgroundColor: colors.darkBackground },
  scrollView: {
    backgroundColor: colors.darkBackground,
    marginBottom: heightPercentageToDP(0),
  },
  topSection: {
    justifyContent: 'space-between',
    marginBottom: heightPercentageToDP(2),
  },
  topIconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: widthPercentageToDP(3),
  },
  positionMainContainer: {
    width: '100%',
    justifyContent: 'space-between',
    padding: widthPercentageToDP(3),
  },
  overViewSubContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  overViewType: [
    screenTitle,
    textStyles.hugeRegular,
    {
      marginTop: heightPercentageToDP(1),
      fontSize: actuatedNormalize(14),
      color: 'white',
    },
  ],
  overViewType: [
    screenTitle,
    textStyles.hugeRegular,
    {
      marginTop: heightPercentageToDP(1),
      fontSize: actuatedNormalize(14),
      color: 'white',
    },
  ],
  profileBio: [
    screenTitle,
    textStyles.hugeRegular,
    {
      marginTop: heightPercentageToDP(1),
      fontSize: actuatedNormalize(15.3),
      color: 'white',
    },
  ],
  profileInfo: [
    screenTitle,
    textStyles.hugeBold,
    {
      marginTop: heightPercentageToDP(1),
      fontSize: actuatedNormalize(15),
      color: 'white',
    },
  ],
  buttonText: [
    textStyles.bigMedium,
    {
      fontSize: actuatedNormalize(15),
      color: 'black',
      marginTop: heightPercentageToDP(0.3),
    },
  ],
  selectedText: [
    textStyles.bigBold,
    {
      fontSize: actuatedNormalize(15),
      color: 'white',
    },
  ],
  unSelectedText: [
    textStyles.bigRegular,
    {
      fontSize: actuatedNormalize(15),
      color: 'gray',
    },
  ],
  selectedBox: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: heightPercentageToDP(1),
    width: widthPercentageToDP(20),
    borderRadius: heightPercentageToDP(0.5),
    borderWidth: heightPercentageToDP(0.2),
    borderColor: 'white',
    marginHorizontal: widthPercentageToDP(1),
  },
  unSelectedBox: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: heightPercentageToDP(1),
    backgroundColor: 'black',
    width: widthPercentageToDP(20),
    borderRadius: heightPercentageToDP(0.5),
    borderColor: colors.primary,
    borderWidth: heightPercentageToDP(0.2),
    marginHorizontal: widthPercentageToDP(1),
  },
  selectedInputBox: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: heightPercentageToDP(1),
    backgroundColor: 'black',
    width: widthPercentageToDP(42),
    borderRadius: heightPercentageToDP(0.5),
    borderColor: colors.primary,
    borderWidth: heightPercentageToDP(0.2),
    marginHorizontal: widthPercentageToDP(1),
  },
  unSelectedInputBox: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: heightPercentageToDP(1),
    backgroundColor: 'white',
    width: widthPercentageToDP(42),
    borderRadius: heightPercentageToDP(0.5),
    borderColor: 'white',
    borderWidth: heightPercentageToDP(0.2),
    marginHorizontal: widthPercentageToDP(1),
  },
  selectedBoxText: [
    textStyles.bigBold,
    {
      fontSize: actuatedNormalize(15),
      color: 'black',
    },
  ],
  unSelectedBoxText: [
    textStyles.bigRegular,
    {
      fontSize: actuatedNormalize(15),
      color: 'white',
    },
  ],
  textinputSyles: {
    fontSize: actuatedNormalize(15),
    fontFamily: 'DMSans-Medium',
  },
})
export { ProfileFriends }
