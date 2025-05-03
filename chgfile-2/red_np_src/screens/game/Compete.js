import React, { useState, useEffect } from 'react'
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
import { NavigationService } from '@navigation'
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
  BackChevron
} from '@components'
import { usePlaceBetting } from '../../hooks/profile/Betting/usePlaceBetting'
import { useSearchFriends } from '@hooks'

const Compete = ({route}) => {

  
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
    setErrorMessage('Please search and select a user to challenge');
    return null;
  }
  // console.log({betAmount},typeof betAmount )
  const parsedBetAmount = parseFloat(betAmount);
  if (isNaN(parsedBetAmount) || parsedBetAmount <= 0 || !/^\d+(\.\d+)?$/.test(betAmount)) {
    setErrorMessage('Challenge amount must be a valid number greater than 0');
    return null;
  }

  
  // All the previous conditions have passed, proceed to handle the challenge
  if (Platform.isPad === true || iphonePassed === true) {
    handlePlaceBet(
      betAmount,
      timeline,
      challengeType,
      selectedUser?.uid,
    );
    if (iphonePassed === true) {
      setShowChallengeConfirmation(false);
      setIphonePassed(false);
    }
  } else {
    setShowChallengeConfirmation(true);
  }
};

useEffect(() => {
  // Check if the route has selectedUser in params
  if (route.params?.selectedUser) {
    setSelectedUser(route.params.selectedUser);
  }
}, [route.params?.selectedUser]);


  return (
    <>
      <View style={styles.safeAreaContainer}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <AnimatedLinearGradient customColors={styles.redvestColors} speed={1000}>
       
            <View style={{ marginTop: heightPercentageToDP(6) }}>
            <BackChevron    onPress={() => NavigationService.navigate( 'Game')} />
              <AccountBalanceBar challenge={true} />
            </View>

            <View style={styles.safeAreaContainer}>
              <View style={styles.mainContainer}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: heightPercentageToDP(2),
                    marginTop: heightPercentageToDP(3),
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
                      {`${selectedUser?.userEmoji ?? ''}  ${capitalize(
                        selectedUser?.userName ?? '',
                      )} vs You`}
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
                    maxHeight: heightPercentageToDP(showChallengeConfirmation ? 28 : 32),
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
                  <ChallengeAmount setBetAmount={setBetAmount} betAmount={betAmount} />
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
                          onPress={() =>
                            dispatch(userActions.setInformation({ infoId: 5 }))
                          }>
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
                                Platform.isPad !== true ? 1.5 : 0.5,
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
                          onPress={() =>
                            dispatch(userActions.setInformation({ infoId: 6 }))
                          }>
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
                                Platform.isPad !== true ? 1.5 : 0.5,
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
                </VirtualizedView>
              </View>
              <View>
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
                        onPress={
                          () => handleChallenge(betAmount, timeline, challengeType, selectedUser)
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
                            handleChallenge(betAmount, timeline, challengeType, selectedUser)
                            setIphonePassed(true)}
                          }
                        >
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
                              style={[
                                textStyles.normalSemiBold,
                                { color: colors.offWhite },
                              ]}>
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
                        marginBottom: heightPercentageToDP(6),
                      },
                    ]}>
                    In {timeline} hour{timeline == 1 ? '' : 's'} whoever makes the highest
                    profit {challengeType == '%' ? 'percentage' : 'in $ amount'} wins! 🏆
                    Winner gets ${betAmount !== undefined && (betAmount * 1.9).toFixed(2)}{' '}
                    back total.
                  </Text>
                </View>
              </View>
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
          </AnimatedLinearGradient>
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
  safeAreaContainer: { flex: 1, height: '100%' },
  mainContainer: {
    backgroundColor: '#161616',
    marginTop: heightPercentageToDP( Platform.isPad !== true ? 4: 3),
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
export { Compete }
