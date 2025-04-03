import React, { useState } from 'react'
import { StyleSheet, Pressable, View, Text, Platform } from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker'
import {
  actuatedNormalize,
  colors,
  heightPercentageToDP,
  textStyles,
  widthPercentageToDP,
  screenTitle,
} from '@utils'
import { userActions, useReduxDispatch } from '@store'
import { CustomInputLabel, Icon } from '@components'

const AdvancedSettings = (
  times,
  setTime,
  challenges,
  setChallenges,
  timeline,
  setTimeline,
  challengeType,
  setChallengeType,
) => {
  const [openTimeline, setOpenTimeline] = useState(false)
  const [openChallenge, setOpenChallenge] = useState(false)
  const [advanced, setAdvanced] = useState(false)
  const dispatch = useReduxDispatch()

  return (
    <>
      <Pressable
        style={{ marginBottom: heightPercentageToDP(advanced ? 0 : 6) }}
        onPress={() => setAdvanced(prev => !prev)}>
        <Text
          style={[
            textStyles.bigRegular,
            {
              fontSize: actuatedNormalize(14),
              // marginTop:heightPercentageToDP(2),
              color: 'white',
            },
          ]}>
          {'Advanced Settings  '}
          <Icon
            type="Entypo"
            name={advanced ? 'chevron-down' : 'chevron-up'}
            size={widthPercentageToDP(Platform.isPad !== true ? 5 : 3)}
            style={{
              marginTop: heightPercentageToDP(5),
            }}
            color={'white'}
            onPress={() => setAdvanced(prev => !prev)}
          />
        </Text>
      </Pressable>
      {advanced && (
        <>
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
                  borderRadius: heightPercentageToDP(Platform.isPad !== true ? 1.5 : 0.5),
                  borderWidth: 0,
                }}
                dropDownDirection="TOP"
                labelStyle={{
                  color: colors.primary,
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
                width: widthPercentageToDP(90),
                marginTop: heightPercentageToDP(1),
                zIndex: 99,
                marginBottom: heightPercentageToDP(3),
              }}>
              <DropDownPicker
                dropDownContainerStyle={{
                  backgroundColor: colors.lightBrown,
                  color: colors.white,
                }}
                style={{
                  backgroundColor: '#474747',
                  borderRadius: heightPercentageToDP(Platform.isPad !== true ? 1.5 : 0.5),
                  borderWidth: 0,
                }}
                dropDownDirection="TOP"
                labelStyle={{
                  color: colors.primary,
                  fontSize: actuatedNormalize(11),
                  textAlign: 'center',
                  fontFamily: 'DMSans-Medium',
                }}
                listItemLabelStyle={{ color: 'white' }}
                open={openChallenge}
                value={challengeType}
                items={challenges}
                setOpen={setOpenChallenge}
                setValue={setChallengeType}
                setItems={setChallenges}
              />
            </View>
          </View>
        </>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  safeAreaContainer: { flex: 1, height: '100%' },
  mainContainer: {
    backgroundColor: '#161616',
    marginTop: heightPercentageToDP(8),
    paddingHorizontal: widthPercentageToDP(5),
    paddingTop: heightPercentageToDP(1),
    borderTopRightRadius: heightPercentageToDP(4),
    borderTopLeftRadius: heightPercentageToDP(4),
    // minHeight: heightPercentageToDP(65),
  },
  bottomContainer: {
    backgroundColor: '#161616',
    paddingLeft: widthPercentageToDP(5),
    paddingRight: widthPercentageToDP(6),
  },
  bottomContainerRows: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bottomContainerPriceText: [textStyles.bigRegular, { color: colors.white }],
  orderCardOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 30,
    marginBottom: 25,
  },
  orderOption: {
    borderRadius: 30,
    width: '47%',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // mainContainer: { flex: 1, paddingTop: 25, backgroundColor: colors.darkBackground },
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
  redvestColors: ['#80A471', '#AFC07E', '#79A471', '#7198A4', '#2383C8', '#644B99'],
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
export { AdvancedSettings }
