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
} from 'react-native'
import firestore from '@react-native-firebase/firestore'
import database from '@react-native-firebase/database'
import {
  LeaderComponent,
  Icon,
  AccountLeaderboardBar,
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


const LeaderboardOrg = () => {
  const dispatch = useReduxDispatch()
  const { userId, userName, isLoggedIn, userEmoji } = useAuthSelector(state => state)
  const [leadTab, setLeadTab] = useState(1)
  // const handleAddToWatchList = () => {
  const views = new Array(4).fill(null)

  const [isLoading, setIsLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(!userName)
  const [userNameLoading, setUserNameLoading] = useState(false)
  const onSubmit = async data => {
    const { username } = data
    try {
      setUserNameLoading(true)
      await checkIfUserNameAvailable(username)
      await updateUserWithUserName(userId, username)
      dispatch(authActions.setUserName({ userName: username }))
      setModalVisible(false)
      setUserNameLoading(false)
    } catch (error) {
      setUserNameLoading(false)
      // console.log('error', error)
      if (error?.message === 'User name already exists') {
        Alert.alert('User Name', 'User name already exists')
      } else {
      }
    }
  }
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({})
  const [leadBoard, setLeadBoard] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const snapshot = await firestore().collection('Leadboard').get()
        const rankWise = snapshot.docs
          .map(doc => doc.data())
          .sort((a, b) => b.portfolioValue - a.portfolioValue)
        setLeadBoard(rankWise)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const medalEmojis = ['🥇', '🥈', '🥉']

  return (
    <SafeAreaView style={styles.mainView}>
      {/** Username Modal  **/}

      <Modal
        animationType={'fade'} // fade, none, slide
        transparent={true}
        visible={modalVisible && isLoggedIn}
        onRequestClose={() => setModalVisible(false)}>
        <View
          style={{
            backgroundColor: 'rgba(0, 0, 0,0.87)',
            height: heightPercentageToDP(100),
            width: widthPercentageToDP(100),
            alignSelf: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}>
          <View
            style={{
              backgroundColor: 'white',
              width: widthPercentageToDP(70),
              alignSelf: 'center',
              borderRadius: widthPercentageToDP(2),
            }}>
            <View style={{ padding: widthPercentageToDP(5) }}>
              <Icon
                type="Ionicons"
                name={'close'}
                onPress={() => setModalVisible(false)}
                size={widthPercentageToDP(5)}
                color="black"
                style={{
                  alignSelf: 'flex-end',
                }}
              />
              <Text style={[styles.userNameText]}>
                Choose a username to enter the Leaderboard{' '}
              </Text>
              <UserNameInput
                control={control}
                errors={errors}
                style={{
                  width: widthPercentageToDP(58),
                  height: heightPercentageToDP(4.5),
                  backgroundColor: 'rgba(0,0,0,.2)',
                  borderRadius: 10,
                  paddingHorizontal: '3%',
                }}
                textStyle={{ color: 'black' }}
                loading={true}
              />
              <CustomButton
                primary
                text="Choose"
                onPress={handleSubmit(onSubmit)}
                style={{
                  width: widthPercentageToDP(58),
                  height: heightPercentageToDP(4.5),
                }}
              />
            </View>
            {userNameLoading && (
              <View
                style={{
                  backgroundColor: 'rgba(0, 0, 0,0.3)',
                  height: '100%',
                  position: 'absolute',
                  width: '100%',
                  zIndex: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <ActivityIndicator color={'#B9D094'} />
              </View>
            )}
          </View>
        </View>
      </Modal>

      <AccountLeaderboardBar showInPercentage={false} />
      <View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            marginTop: heightPercentageToDP(2),
          }}>
          {leadBoard.slice(0, 3).map((user, index) => (
            <View key={index}>
              <CircleUserComponent data={user} leaderboard={true} />
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
          // <ScrollView showsVerticalScrollIndicator={false}>

          <FlatList
            data={leadBoard}
            keyExtractor={item => item.uid.toString()}
            renderItem={({ item }) => (
              <LeaderComponent
                positions={item.positions}
                activities={item.activities}
                portfolioValue={item.portfolioValue}
                weeklyRank={item.weeklyRank}
                uid={item.uid}
              />
            )}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
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
export { LeaderboardOrg }
