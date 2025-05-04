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
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button'
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

const CompeteOne = () => {
  const { isLoggedIn } = useAuthSelector(state => state)
  const dispatch = useReduxDispatch()
  const [errorMessage, setErrorMessage] = useState('')
  const [showChallengeConfirmation, setShowChallengeConfirmation] = useState(false)
  const { betLoading, showBetConfirmModal, handlePlaceBet, setShowBetConfirmModal } =
    usePlaceBetting()
  const [openTimeline, setOpenTimeline] = useState(false)
  const [openChallenge, setOpenChallenge] = useState(false)
  const [advanced, setAdvanced] = useState(false)
  const [showOrderconfirmationModal, setShowOrderconfirmationModal] = useState(false)
  const [timeline, setTimeline] = useState('1')
  const [times, setTime] = useState([
    { label: '1 hour', value: '1' },
    { label: '24 Hours', value: '24' },
    { label: '1 Week', value: '168' },
  ])
  const [challengeType, setChallengeType] = useState('$')
  const [challenges, setChallenges] = useState([
    { label: 'Highest Profit In Dollar Amount Wins', value: '$' },
    { label: 'Highest Profit In Percentage Wins', value: '%' },
  ])
  const [selectedUser, setSelectedUser] = useState({})
  const [searchFriendString, setSearchFriendString] = useState('')
  const [selectedBox, setSelectedBox] = useState(4)
  const [betAmount, setBetAmount] = useState('25')
  const [iphonePassed, setIphonePassed] = useState(false)

  const handleBoxPress = (button, bettingAmount) => {
    setSelectedBox(button)
    setBetAmount(bettingAmount)
  }

  const { searchLoading, searchedUsers, handleSearch } =
    useSearchFriends(searchFriendString)
  const handleSelectUser = user => {
    setSelectedUser(user)
    setSearchFriendString('')
  }

  // console.log({selectedUser},typeof selectedUser)

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

  const [step, setStep] = useState(1)

  const radioButtonProps = [
    { label: '1 Hour', value: '1' },
    { label: '24 Hours', value: '24' },
    { label: '1 Week', value: '168' },
    ,
  ]
  const [radioButtonIndex, setRadioButtonIndex] = useState(1)
  const handlerRadioButton = (obj, index) => {
    setRadioButtonIndex(index)
    // setSelectedOrderSide(obj.value)
  }

  return (
    <>
      <View style={styles.safeAreaContainer}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <>
            {/* <AnimatedLinearGradient customColors={styles.redvestColors} speed={1000}> */}

            <Text
              style={[
                textStyles.hugeMedium,
                {
                  marginHorizontal: widthPercentageToDP(step == 1 ? 10 : 0),
                  fontSize: actuatedNormalize(23),
                  textAlign: 'left',
                  color: 'white',
                  marginTop: heightPercentageToDP(3),
                },
              ]}>
              {(step == 2 || step == 3 || step == 4) && (
                <View style={{ marginTop: heightPercentageToDP(0) }}>
                  <BackChevron onPress={() => setStep(step - 1)} />
                </View>
              )}
              {step == 1 && '1. Pick your strategy'}
              {step == 2 && '2. Challenge amount'}
              {step == 3 && '3. Pick the timeline'}
              {step == 4 && '4. Pick your opponent'}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginHorizontal: widthPercentageToDP(10),
                marginTop: heightPercentageToDP(2),
                marginBottom: heightPercentageToDP(2),
              }}>
              <View
                style={{
                  width: widthPercentageToDP(18),
                  height: heightPercentageToDP(0.4),
                  backgroundColor:
                    step == 1 || step == 2 || step == 3 || step == 4
                      ? colors.primary
                      : 'white',
                }}></View>
              <View
                style={{
                  width: widthPercentageToDP(18),
                  height: heightPercentageToDP(0.4),
                  backgroundColor:
                    step == 2 || step == 3 || step == 4 ? colors.primary : 'white',
                }}></View>
              <View
                style={{
                  width: widthPercentageToDP(18),
                  height: heightPercentageToDP(0.4),
                  backgroundColor: step == 3 || step == 4 ? colors.primary : 'white',
                }}></View>
              <View
                style={{
                  width: widthPercentageToDP(18),
                  height: heightPercentageToDP(0.4),
                  backgroundColor: step == 4 ? colors.primary : 'white',
                }}></View>
            </View>

            <View style={styles.mainContainer}>
              {step == 4 && (
                <>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginBottom: heightPercentageToDP(2),
                      marginTop: heightPercentageToDP(1),
                    }}>
                    <Pressable
                      onPress={() => dispatch(userActions.setInformation({ infoId: 4 }))}>
                      <Text
                        numberOfLines={1}
                        style={[
                          textStyles.bigSemiBold,
                          {
                            fontSize: actuatedNormalize(14),
                            color: 'white',
                            maxWidth: widthPercentageToDP(50),
                          },
                        ]}>
                        {`You vs ${selectedUser?.userEmoji ?? ''} ${capitalize(
                          selectedUser?.userName ?? '',
                        )}`}
                      </Text>
                    </Pressable>
                  </View>
                  <CustomSearchBar
                    mainScreen={true}
                    searchString={searchFriendString}
                    setSearchString={setSearchFriendString}
                    loading={searchLoading}
                    onPress={handleSearch}
                  />
                  <VirtualizedView
                    style={{
                      maxHeight: heightPercentageToDP(
                        showChallengeConfirmation ? 28 : 32,
                      ),
                    }}
                    showsVerticalScrollIndicator={false}>
                    <View style={{ maxHeight: heightPercentageToDP(25) }}>
                      <ScrollView showsVerticalScrollIndicator={false}>
                        {searchedUsers.map((item, index) => (
                          <BetUserComponent
                            key={index}
                            userInfo={item}
                            handleSelectUser={handleSelectUser}
                            handleNavigateToChat={false}
                          />
                        ))}
                      </ScrollView>
                    </View>
                    <Text
                      style={[
                        textStyles.smallBold,
                        {
                          // marginLeft:widthPercentageToDP(5),
                          fontSize: actuatedNormalize(13),
                          textAlign: 'left',
                          color: 'white',
                          marginTop: heightPercentageToDP(3),
                        },
                      ]}>
                      Suggested Users
                    </Text>
                    {/* <View style={{ marginTop:heightPercentageToDP(2), backgroundColor:'black', borderColor:colors.primary, borderWidth:heightPercentageToDP(0.3), borderRadius:heightPercentageToDP(1), width:widthPercentageToDP(40), justifyContent:'center', height:heightPercentageToDP(23)}}>  */}
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
                    {/* <View style={{backgroundColor:'white', paddingHorizontal:widthPercentageToDP(4), paddingVertical:heightPercentageToDP(1),borderRadius:heightPercentageToDP(10), width:widthPercentageToDP(30), alignSelf:'center'}}>
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
            </View> */}
                    {/* </View> */}
                  </VirtualizedView>
                </>
              )}
            </View>

            {step == 2 && (
              <RadioForm
                style={{
                  height: heightPercentageToDP(8),
                  marginLeft: widthPercentageToDP(8),
                }}
                formHorizontal={false}
                animation={true}>
                {radioButtonProps.map((obj, i) => (
                  <RadioButton labelHorizontal={true} key={i}>
                    <RadioButtonInput
                      obj={obj}
                      index={i}
                      isSelected={radioButtonIndex === i}
                      onPress={() => handlerRadioButton(obj, i)}
                      borderWidth={heightPercentageToDP(0.2)}
                      buttonInnerColor={'white'}
                      buttonOuterColor={
                        radioButtonIndex === i ? 'colors.primary' : 'white'
                      }
                      buttonSize={heightPercentageToDP(1.5)}
                      buttonStyle={{ marginTop: heightPercentageToDP(1) }}
                    />
                    <RadioButtonLabel
                      obj={obj}
                      index={i}
                      labelHorizontal={true}
                      onPress={() => handlerRadioButton(obj, i)}
                      labelStyle={{
                        fontFamily: 'DMSans-Medium',
                        fontSize: widthPercentageToDP(5),
                        color: 'white',
                        paddingTop: heightPercentageToDP(1.5),

                        marginLeft: widthPercentageToDP(3),
                        marginRight: widthPercentageToDP(8),
                        paddingBottom: heightPercentageToDP(0),
                        fontSize: actuatedNormalize(15),
                      }}
                      labelWrapStyle={{ marginTop: heightPercentageToDP(0), left: 0 }}
                    />
                  </RadioButton>
                ))}
              </RadioForm>
            )}

            {step == 1 && (
              <View style={{ alignSelf: 'center' }}>
                <ChallengeAmount setBetAmount={setBetAmount} betAmount={betAmount} />
              </View>
            )}

            <View
              style={{
                marginTop: heightPercentageToDP(Platform.isPad === true ? 60 : 65),
                position: 'absolute',
                width: '100%',
              }}>
              <HorizontalRule style={{ marginVertical: 0, width: '100%' }} />
              <CustomButton
                text={'Next'}
                style={{ alignSelf: 'center', marginTop: heightPercentageToDP(2) }}
                onPress={() => setStep(step == 4 ? step - 1 : step + 1)}
              />
            </View>
            {showOrderconfirmationModal && (
              <OrderConfirmModal
                visible={showOrderconfirmationModal}
                handleCloseModal={() => {
                  setShowOrderconfirmationModal(false)
                }}
              />
            )}
            {errorMessage && (
              <InvestErrorModal
                errorMessage={errorMessage}
                visible={!!errorMessage}
                handleCloseModal={() => {
                  setErrorMessage('')
                }}
              />
            )}
          </>
          {/* </AnimatedLinearGradient> */}
        </TouchableWithoutFeedback>
      </View>
      <ChallengeSentBottomSheet
        isVisible={showBetConfirmModal}
        handleCloseModal={() => setShowBetConfirmModal(false)}
        friendName={selectedUser?.userName}
        timeline={timeline}
        challengeType={challengeType}
      />
    </>
  )
}

const styles = StyleSheet.create({
  safeAreaContainer: { flex: 1, backgroundColor: colors.darkBackground },
  mainContainer: {
    paddingHorizontal: widthPercentageToDP(8),
  },
  bottomContainer: {
    backgroundColor: '#161616',
    paddingLeft: widthPercentageToDP(5),
    paddingRight: widthPercentageToDP(6),
  },
  orderCardOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 30,
    marginBottom: 55,
  },
  orderOption: {
    borderRadius: 30,
    width: '47%',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: [
    textStyles.bigMedium,
    {
      fontSize: actuatedNormalize(15),
      color: 'black',
      marginTop: heightPercentageToDP(0.3),
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
})
export { CompeteOne }
