import React, { useEffect, useState } from 'react'
import {
  StyleSheet,
  Keyboard,
  Pressable,
  View,
  Text,
  Platform,
  TextInput,
} from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker'
import {
  actuatedNormalize,
  colors,
  heightPercentageToDP,
  textStyles,
  widthPercentageToDP,
  screenTitle,
  capitalize,
} from '@utils'
import { userActions, useReduxDispatch, useAuthSelector } from '@store'
import {
  CustomButton,
  CustomInputLabel,
  Icon,
  VirtualizedView,
  HorizontalRule,
  ChallengeAmount,
  InvestErrorModal,
} from '@components'
import { usePlaceBetting } from '../../hooks/profile/Betting/usePlaceBetting'

const ProfileCompete = ({ friend }) => {
  const { betLoading, handlePlaceBet } = usePlaceBetting()
  const [errorMessage, setErrorMessage] = useState('')
  const [openTimeline, setOpenTimeline] = useState(false)
  const [openChallenge, setOpenChallenge] = useState(false)
  const [advanced, setAdvanced] = useState(false)
  const [showChallengeConfirmation, setShowChallengeConfirmation] = useState(false)
  const [timeline, setTimeline] = useState('1')
  const [times, setTime] = useState([
    { label: '1 hour', value: '1' },
    { label: '24 Hours', value: '24' },
    { label: '1 Week', value: '168' },
  ])
  const dispatch = useReduxDispatch()
  const [challengeType, setChallengeType] = useState('$')
  const [challenges, setChallenges] = useState([
    { label: 'Highest Profit In Dollar Amount Wins', value: '$' },
    { label: 'Highest Profit In Percentage Wins', value: '%' },
  ])
  const { isLoggedIn } = useAuthSelector(state => state)
  const [selectedBox, setSelectedBox] = useState(4)
  const [betAmount, setBetAmount] = useState('25')
  const [iphonePassed, setIphonePassed] = useState(false)

  const handleBoxPress = (button, bettingAmount) => {
    setSelectedBox(button)
    setBetAmount(bettingAmount)
  }

  const handleChallenge = (betAmount, timeline, challengeType, selectedUser) => {
    if (typeof selectedUser === 'undefined' || Object.keys(selectedUser)?.length === 0) {
      setErrorMessage('Please search and select a user to challenge')
      return null
    }
    // console.log({betAmount},typeof betAmount )
    const parsedBetAmount = parseFloat(betAmount)
    if (
      isNaN(parsedBetAmount) ||
      parsedBetAmount <= 0 ||
      !/^\d+(\.\d+)?$/.test(betAmount)
    ) {
      setErrorMessage('Challenge amount must be a valid number greater than 0')
      return null
    }

    // All the previous conditions have passed, proceed to handle the challenge
    if (Platform.isPad === true || iphonePassed === true) {
      handlePlaceBet(betAmount, timeline, challengeType, selectedUser?.uid)
      if (iphonePassed === true) {
        setShowChallengeConfirmation(false)
        setIphonePassed(false)
      }
    } else {
      setShowChallengeConfirmation(true)
    }
  }

  return (
    <Pressable
      style={styles.safeAreaContainer}
      onPress={Keyboard.dismiss}
      accessible={false}>
      <View style={styles.safeAreaContainer}>
        <VirtualizedView
          showsVerticalScrollIndicator={false}
          style={styles.mainContainer}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: heightPercentageToDP(2),
              marginTop: heightPercentageToDP(0),
            }}>
            <Text
              style={[
                textStyles.bigSemiBold,
                {
                  fontSize: actuatedNormalize(14),
                  color: 'white',
                },
              ]}>
              Profit Challenge
            </Text>

            <Pressable
              onPress={() => dispatch(userActions.setInformation({ infoId: 1 }))}>
              <CustomInputLabel
                text={`${capitalize(friend?.userName)} vs You`}
                big
                info
              />
            </Pressable>
          </View>

          <ChallengeAmount setBetAmount={setBetAmount} betAmount={betAmount} />
          <Pressable onPress={() => setAdvanced(prev => !prev)}>
            <Text
              style={[
                textStyles.bigRegular,
                {
                  fontSize: actuatedNormalize(14),
                  // marginTop:heightPercentageToDP(2),
                  color: 'white',
                },
              ]}>
              Advanced Settings{'  '}
              <Icon
                type="Entypo"
                name={advanced ? 'chevron-down' : 'chevron-up'}
                size={widthPercentageToDP(Platform.isPad === true ? 3 : 5)}
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
                      borderRadius: heightPercentageToDP(
                        Platform.isPad === true ? 0.5 : 1.5,
                      ),
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
                      borderRadius: heightPercentageToDP(
                        Platform.isPad === true ? 0.5 : 1.5,
                      ),
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

          {/* </ScrollView> */}
        </VirtualizedView>

        <View>
          {/* <ScrollView  showsVerticalScrollIndicator={false} style={{ marginHorizontal: widthPercentageToDP(2
    ) }}> */}

          <HorizontalRule style={{ marginVertical: 0, width: '100%' }} />
          <View style={styles.bottomContainer}>
            <View style={{ paddingBottom: heightPercentageToDP(1) }}>
              {isLoggedIn ? (
                <CustomButton
                  primary
                  text={`Challenge $${betAmount ?? '0'}`}
                  loading={betLoading}
                  style={{
                    width: widthPercentageToDP(90),
                    marginTop: heightPercentageToDP(1),
                  }}
                  onPress={() =>
                    handleChallenge(betAmount, timeline, challengeType, friend)
                  }
                />
              ) : (
                <CustomButton
                  primary
                  text={`Challenge $${betAmount ?? '0'}`}
                  loading={betLoading}
                  style={{
                    width: widthPercentageToDP(90),
                    marginTop: heightPercentageToDP(1),
                  }}
                  onPress={() => setShowOrderconfirmationModal(true)}
                />
              )}
              {showChallengeConfirmation && (
                <View style={styles.investMainContainer}>
                  <Text style={styles.investInfoText}>
                    Ready to challenge user for ${' '}
                    {parseFloat(betAmount * 2 * 0.9)
                      ?.toFixed(2)
                      ?.toString()
                      ?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
                    ?
                  </Text>
                  <View style={styles.orderCardOptions}>
                    <Pressable
                      disabled={betLoading}
                      style={[styles.orderOption, { backgroundColor: 'white' }]}
                      onPress={() => {
                        handleChallenge(betAmount, timeline, challengeType, friend)
                        setIphonePassed(true)
                      }}>
                      <Text style={[textStyles.normalSemiBold, { color: 'black' }]}>
                        {'Challenge'}
                      </Text>
                    </Pressable>
                    <Pressable
                      style={[
                        styles.orderOption,
                        {
                          backgroundColor: 'black',
                          borderColor: 'white',
                          borderWidth: heightPercentageToDP(0.2),
                        },
                      ]}
                      onPress={() => setShowChallengeConfirmation(false)}>
                      <Text
                        style={[textStyles.normalSemiBold, { color: colors.offWhite }]}>
                        Cancel
                      </Text>
                    </Pressable>
                  </View>
                </View>
              )}
            </View>
            <Text
              style={[
                textStyles.bigSemiBold,
                {
                  textAlign: 'center',
                  fontSize: actuatedNormalize(10),
                  color: 'white',
                  marginBottom: heightPercentageToDP(2),
                },
              ]}>
              In {timeline} hour{timeline == 1 ? '' : 's'} whoever makes the highest
              profit {challengeType == '%' ? 'percentage' : 'in dollar amount'} wins! 🏆
              Winner gets ${betAmount !== undefined && (betAmount * 1.9).toFixed(2)} back
              total
            </Text>
          </View>
          {errorMessage && (
            <InvestErrorModal
              errorMessage={errorMessage}
              visible={!!errorMessage}
              handleCloseModal={() => {
                setErrorMessage('')
              }}
            />
          )}
        </View>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  safeAreaContainer: { flex: 1 },
  mainContainer: {
    // marginTop:heightPercentageToDP(8) ,
    paddingHorizontal: widthPercentageToDP(5),
    paddingTop: heightPercentageToDP(1),
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
export { ProfileCompete }
