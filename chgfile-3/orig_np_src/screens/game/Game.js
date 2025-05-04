import React, { useState } from 'react'
import {
  StyleSheet,
  Keyboard,
  Pressable,
  View,
  Text,
  FlatList,
  Platform,
  RefreshControl,
  ScrollView,
  Image,
  SafeAreaView,
  Linking,
  TouchableWithoutFeedback,
} from 'react-native'
import { useInviteFriend } from '@hooks'
import { NavigationService } from '@navigation'
import {
  actuatedNormalize,
  colors,
  heightPercentageToDP,
  textStyles,
  widthPercentageToDP,
  capitalize,
} from '@utils'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useReduxDispatch, useAuthSelector, useUserSelector } from '@store'
import {
  AccountBalanceBar,
  CircleUserComponent,
  OrderConfirmModal,
  CustomGameCategory,
  ChallengeFriends,
  CustomPromo,
  InputModal,
  ProgressBar,
} from '@components'
import { useGetFriends, useSearchFriends } from '@hooks'
import { gameCategories } from '@constants'
import { categoriesWithEmojis, questions } from '@constants'

const Game = () => {
  const { isLoggedIn, userLevel } = useAuthSelector(state => state)

  const dispatch = useReduxDispatch()
  const [showOrderconfirmationModal, setShowOrderconfirmationModal] = useState(false)
  const openOrderConfirmationModal = React.useCallback(() => {
    setShowOrderconfirmationModal(true)
  }, [])
  const handleCloseModal = React.useCallback(() => {
    setShowOrderconfirmationModal(false)
  }, [])
  const { searchLoading, searchedUsers, handleSearch } =
    useSearchFriends(searchFriendString)
  const handleSelectUser = user => {
    setSelectedUser(user)
    setSearchFriendString('')
  }

  const { friendsListLoading, getFriendsList } = useGetFriends()
  const { friendsList, searchFriendString } = useUserSelector(state => state)

  const [step, setStep] = useState(4)

  const getProgressPercentageForCategory = React.useCallback(
    (category, userLevel) => {
      // Filter questions for the specified category
      let questionsForCategory = questions.filter(q => q.category === category)

      // If no questions are found for the category, default to all questions
      if (questionsForCategory.length === 0) {
        questionsForCategory = questions
      }

      // Get the number of questions for the category
      const totalQuestions = questionsForCategory.length

      // Get the user's level for the category
      const levelForCategory =
        (userLevel &&
          (typeof userLevel === 'number' ? userLevel : userLevel[category])) ||
        0

      // Calculate and return the progress percentage
      return levelForCategory / totalQuestions
    },
    [questions, userLevel],
  )
  const { userId } = useAuthSelector(state => state)
  const { onShare } = useInviteFriend(userId)

  const [isVisible, setIsVisible] = useState(false)

  return (
    <>
      <SafeAreaView style={styles.safeAreaContainer}>
        <InputModal isVisible={isVisible} setIsVisible={setIsVisible} />
        {/* <View style={styles.mainContainer}> */}
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <>
            <AccountBalanceBar challenge={true} />
            <ScrollView showsVerticalScrollIndicator={false}>
              <ScrollView
                style={{ marginLeft: widthPercentageToDP(5) }}
                showsHorizontalScrollIndicator={false}
                horizontal={true}>
                {/* <TouchableOpacity
                  style={styles.container}
                  onPress={() =>
                    isLoggedIn
                      ? setIsVisible(true) //NavigationService.navigate('QuizOptions', { userLevel }) -- TODO: Video 
                      : // NavigationService.navigate('QuizOptions', { userLevel })
                        setShowOrderconfirmationModal(true)
                  }>
                  <Image
                    source={require('../../assets/images/games/stockUniverse.png')}
                    style={styles.image}
                  />
                </TouchableOpacity> */}
                <CustomPromo
                  promoMessage={'Join A Game 😎 with secret code'}
                  buttonText={'Play'}
                  onPress={() =>
                    isLoggedIn
                      ? setIsVisible(true)
                      : // NavigationService.navigate('QuizOptions', { userLevel })
                        setShowOrderconfirmationModal(true)
                  }
                  gradientColors={['#518EF8', '#518EF8', '#518EF8', '#9ECB8E', 'pink']}
                  textColor={'white'}
                />
                <CustomPromo
                  promoMessage={'Invite Friends to get a $1000 Redvest coins! 😎'}
                  buttonText={'Share Now'}
                  onPress={() => {
                    onShare()
                  }}
                  gradientColors={['#8AC42D', '#73BCFF']}
                  textColor={'white'}
                />
                <CustomPromo
                  promoMessage={'Add your organization competition'}
                  buttonText={'Start Now'}
                  onPress={() =>
                    Linking.openURL(
                      'mailto:partnerships@redvest.app?subject=Hosting Our Competition On Redvest&body=Hello Redvest Team, I would like to get intouch about hosting our stock pitch competitions on Redvest. Please send me the details.',
                    )
                  }
                  gradientColors={['white', 'white']}
                  textColor={'black'}
                />
              </ScrollView>
              <View
                style={{
                  paddingRight: widthPercentageToDP(8),
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={[
                    textStyles.smallSemiBold,
                    {
                      paddingHorizontal: widthPercentageToDP(6),
                      fontSize: actuatedNormalize(14),
                      textAlign: 'left',
                      color: 'white',
                    },
                  ]}>
                  Your Journey
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    isLoggedIn
                      ? NavigationService.navigate('QuizOptions', { userLevel })
                      : setShowOrderconfirmationModal(true)
                  }>
                  <Text
                    style={[
                      textStyles.smallRegular,
                      {
                        // marginLeft:widthPercentageToDP(5),
                        fontSize: actuatedNormalize(13),
                        textAlign: 'left',
                        color: 'gray',
                      },
                    ]}>
                    See All
                  </Text>
                </TouchableOpacity>
              </View>
              <FlatList
                horizontal
                data={categoriesWithEmojis}
                style={{ marginLeft: widthPercentageToDP(4) }}
                keyExtractor={item => item.category}
                renderItem={({ item }) => (
                  <ProgressBar
                    category={item.category}
                    emoji={item.emoji}
                    explanation={item.explanation}
                    quiz={true}
                    setShowOrderconfirmationModal={setShowOrderconfirmationModal}
                    isLoggedIn={isLoggedIn}
                    progress={
                      typeof userLevel === 'number' || !isLoggedIn
                        ? 0
                        : getProgressPercentageForCategory(item.category, userLevel)
                    }
                    gradientColors={item.gradientColors}
                  />
                )}
                showsHorizontalScrollIndicator={false}
              />
              <Text
                style={[
                  textStyles.smallSemiBold,
                  {
                    marginTop: heightPercentageToDP(1),
                    paddingHorizontal: widthPercentageToDP(6),
                    // marginLeft:widthPercentageToDP(5),
                    fontSize: actuatedNormalize(14),
                    textAlign: 'left',
                    color: 'white',
                  },
                ]}>
                Game Hub
              </Text>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                style={{ marginLeft: widthPercentageToDP(4) }}>
                {gameCategories?.map((categoryItem, index) => (
                  <CustomGameCategory
                    key={index}
                    category={categoryItem?.category}
                    emoji={categoryItem?.emoji}
                    gradientColors={categoryItem?.gradientColors}
                    screen={categoryItem?.screen}
                    index={index}
                    userLevel={userLevel}
                    setShowOrderconfirmationModal={setShowOrderconfirmationModal}
                    isLoggedIn={isLoggedIn}
                    progress={
                      typeof userLevel === 'number' || !isLoggedIn
                        ? 0
                        : getProgressPercentageForCategory(
                            categoryItem?.category,
                            userLevel,
                          )
                    }
                  />
                ))}
              </ScrollView>
              {/* {friendsList?.length >= 1 && (
                <View
                  style={{
                    flexDirection: 'row',
                    paddingHorizontal: widthPercentageToDP(8),
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={[
                      textStyles.smallBold,
                      {
                        // marginLeft:widthPercentageToDP(5),
                        fontSize: actuatedNormalize(13),
                        textAlign: 'left',
                        color: 'white',
                        marginTop: heightPercentageToDP(1),
                        marginBottom: heightPercentageToDP(2),
                      },
                    ]}>
                    Top Friends
                  </Text>
                  <Pressable onPress={() => NavigationService.navigate('CustomScreen')}>
                  <Text
                    style={[
                      textStyles.smallRegular,
                      {
                        // marginLeft:widthPercentageToDP(5),
                        fontSize: actuatedNormalize(13),
                        textAlign: 'left',
                        color: colors.darkBackground,
                        marginTop: heightPercentageToDP(0),
                        marginBottom: heightPercentageToDP(3),
                      },
                    ]}>
                    See All
                  </Text>
                </Pressable>
                </View>
              )} */}
              {/* <FlatList
                data={friendsList}
                horizontal={true}
                showsVerticalScrollIndicator={false}
                style={{
                  width: widthPercentageToDP(100),
                  marginHorizontal: widthPercentageToDP(2),
                  marginBottom: heightPercentageToDP(2),
                  // marginLeft: widthPercentageToDP(4),
                }}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item, index }) => (
                  <CircleUserComponent key={index} data={item} leaderboard={false} index={index} />
                )} // Use the UserComponent here
                extraData={friendsList}
                refreshControl={
                  <RefreshControl
                    colors={[colors.offWhite]}
                    tintColor={colors.offWhite}
                    refreshing={friendsListLoading}
                    onRefresh={getFriendsList}
                  />
                }
              /> */}
            </ScrollView>
          </>

          {/* </AnimatedLinearGradient> */}
        </TouchableWithoutFeedback>
        {/* </View> */}
      </SafeAreaView>
      {showOrderconfirmationModal && (
        <OrderConfirmModal
          visible={showOrderconfirmationModal}
          handleCloseModal={() => {
            setShowOrderconfirmationModal(false)
          }}
        />
      )}
    </>
  )
}

const styles = StyleSheet.create({
  safeAreaContainer: { flex: 1, backgroundColor: colors.darkBackground },
  mainContainer: {
    paddingBottom: heightPercentageToDP(13),
    marginTop: heightPercentageToDP(8),
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
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  image: {
    height: heightPercentageToDP(20),
    width: widthPercentageToDP(55),
    resizeMode: 'contain',
  },
})
export { Game }
