import React, { useEffect, useState } from 'react'
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Modal,
  Text,
  ActivityIndicator,
  Alert,
  Pressable,
  Platform,
  FlatList,
  RefreshControl,
} from 'react-native'
import firestore from '@react-native-firebase/firestore'
import database from '@react-native-firebase/database'
import {
  GameLeaderComponent,
  Icon,
  GameLeaderboardBar,
  CustomButton,
  UserNameInput,
  CircleUserComponent,
} from '@components'
import {
  actuatedNormalize,
  checkIfUserNameAvailable,
  colors,
  heightPercentageToDP,
  textStyles,
  updateUserWithUserName,
  widthPercentageToDP,
} from '@utils'
import { NavigationService } from '@navigation'
import { authActions, useAuthSelector, useReduxDispatch, useUserSelector } from '@store'
import ContentLoader from 'react-native-easy-content-loader'
import { useForm } from 'react-hook-form'

const GameLeaderboard = ({ route }) => {
  const { secretCode } = route.params ?? {}
  const dispatch = useReduxDispatch()
  const { userName } = useAuthSelector(state => state)
  const [leadTab, setLeadTab] = useState(1)
  // const handleAddToWatchList = () => {
  const views = new Array(4).fill(null)

  const [isLoading, setIsLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(!userName)
  const [userNameLoading, setUserNameLoading] = useState(false)

  const [leadBoard, setLeadBoard] = useState([])
  const [userRank, setUserRank] = useState(null)
  const [userScore, setUserScore] = useState(null)
  const [isRefreshing, setIsRefreshing] = useState(false)


  // Refactored fetching logic into a separate function
  const fetchData = async () => {
    setIsLoading(true)
    try {
      const snapshot = await firestore()
        .collection('Games')
        .doc(secretCode.toUpperCase())
        .collection('Leaderboard')
        .orderBy('score', 'desc')
        .get()

      const rankWise = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => b.score - a.score)

      setLeadBoard(rankWise)
      const userIndex = rankWise.findIndex(user => user.userName === userName)
      if (userIndex !== -1) {
        setUserRank(userIndex + 1)
        setUserScore(rankWise[userIndex].score)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [secretCode])

  // Use effect to re-fetch data until userRank is not null
  useEffect(() => {
    let intervalId
    if (userRank === null && !isLoading) {
      // Retry fetching after a delay if userRank is still null
      intervalId = setTimeout(fetchData, 5000) // Retry every 5 seconds
    }
    return () => clearTimeout(intervalId) // Cleanup on unmount or if userRank becomes non-null
  }, [userRank, isLoading])

  const medalEmojis = ['🥇', '🥈', '🥉']

    const onRefresh = () => {
      setIsRefreshing(true)
      fetchData().then(() => setIsRefreshing(false))
    }

  return (
    <SafeAreaView style={styles.mainView}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }} // Ensures the ScrollView fills the available space
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }>
        <GameLeaderboardBar showInPercentage={false} rank={userRank} score={userScore} />
        <View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              marginTop: heightPercentageToDP(2),
            }}>
            {leadBoard?.slice(0, 3).map((user, index) => (
              <View key={index}>
                <CircleUserComponent
                  data={user}
                  leaderboard={true}
                  game={true}
                  id={user?.id}
                  userName={user?.userName}
                />
                <View
                  style={{
                    alignItems: 'center',
                    //  width: widthPercentageToDP(20), height: heightPercentageToDP(index == 1 ? 13 :10 ), backgroundColor: '#484848', marginTop: heightPercentageToDP(0)
                  }}>
                  <Text style={{ fontSize: actuatedNormalize(35) }}>
                    {medalEmojis[index]}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View
          style={{
            backgroundColor: colors.darkBackground,
            marginTop: heightPercentageToDP(2),
            paddingTop: heightPercentageToDP(5),
            borderTopLeftRadius: widthPercentageToDP(8),
            borderTopRightRadius: widthPercentageToDP(8),
            // marginBottom: heightPercentageToDP(10),
            paddingBottom: heightPercentageToDP(Platform.isPad !== true ? 20 : 24),
            height: heightPercentageToDP(62),
          }}>
          {leadBoard.length === 0 ? (
            <View
              style={{
                height: heightPercentageToDP(20),
                width: widthPercentageToDP(95),
                marginHorizontal: widthPercentageToDP(1.5),
              }}>
              {views.map((_, index) => (
                <View key={index}>
                  <ContentLoader
                    pRows={0}
                    secondaryColor={'rgba(18, 18, 18, 0.2)'}
                    primaryColor={'rgba(18, 18, 18, 0.2)'}
                  />
                  <ContentLoader
                    pRows={3}
                    animationDuration={500}
                    pWidth={[100, 0, 0]}
                    pHeight={[0, 20, 0]}
                    active
                    primaryColor={'rgba(65, 65, 65, 0.2)'}
                    secondaryColor={'rgba(65, 65, 65, 0.9)'}
                  />
                </View>
              ))}
            </View>
          ) : (
            <FlatList
              data={leadBoard}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item, index }) => (
                <GameLeaderComponent
                  userName={item.userName}
                  score={item.score}
                  id={item.id}
                  rank={index + 1}
                />
              )}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  mainView: { paddingTop: 25, flex: 1, backgroundColor: colors.lightBrown },
  tickerContainer: {
    justifyContent: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    paddingHorizontal: widthPercentageToDP(4),
    paddingVertical: heightPercentageToDP(0.5),
    borderColor: colors.primary,
    borderRadius: widthPercentageToDP(2),
    borderWidth: widthPercentageToDP(0.3),
  },
  userNameText: [
    textStyles.bigSemiBold,
    {
      color: 'white',
      fontSize: actuatedNormalize(13),
      marginBottom: heightPercentageToDP(2),
    },
  ],
  balanceText: [
    textStyles.bigBold,
    {
      color: colors.primary2,
      fontSize: actuatedNormalize(18),
      marginBottom: heightPercentageToDP(2),
    },
  ],
  freeBox: {
    width: widthPercentageToDP(90),
    height: widthPercentageToDP(12),
    backgroundColor: 'white',
    alignSelf: 'center',
    marginTop: heightPercentageToDP(2),
    marginHorizontal: widthPercentageToDP(1),
    borderRadius: 10,
    paddingHorizontal: widthPercentageToDP(1),
    paddingVertical: heightPercentageToDP(1),
  },
  userNameText: [
    textStyles.bigSemiBold,
    {
      color: 'black',
      fontSize: actuatedNormalize(13),
      marginBottom: heightPercentageToDP(2),
      marginTop: heightPercentageToDP(2),
      textAlign: 'center',
    },
  ],
  tabsMainContainer: {
    marginHorizontal: heightPercentageToDP(1),
    marginTop: heightPercentageToDP(3),
    flexDirection: 'row',
  },
  tabContainer: {
    paddingVertical: widthPercentageToDP(3),
    borderRadius: widthPercentageToDP(12),
    minWidth: widthPercentageToDP(28),
    alignItems: 'center',
    marginHorizontal: heightPercentageToDP(1),
  },
  tabText: [
    textStyles.smallBold,
    {
      color: 'black',
    },
  ],
})
export { GameLeaderboard }
