import React, { useState } from 'react'
import {
  StyleSheet,
  Pressable,
  View,
  Text,
  RefreshControl,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native'
import {
  actuatedNormalize,
  colors,
  heightPercentageToDP,
  textStyles,
  widthPercentageToDP,
} from '@utils'
import { NavigationService } from '@navigation'
import { Challenges } from './Challenges'
import { useRefreshHookProfile, useFriend, useBlock, useRooms } from '@hooks'
import { CustomUserStatusBar, HorizontalRule, VirtualizedView } from '@components'
import { ProfileCompete } from './ProfileCompete'
import { UserPortfolio } from './UserPortfolio'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useAuthSelector } from '@store'

const ProfileUser = ({ route }) => {
  const { userId } = useAuthSelector(state => state)
  const { userInfo } = route.params
  const {
    userInfo: friendInfo,
    followLoading,
    isBlockLoading,
    isFollowing,
    handleFollow,
    handleGetUserInfo,
  } = useFriend(userInfo ?? {})
  const { handleUnblock } = useBlock()
  const { handleRefreshProfile, refreshing } = useRefreshHookProfile()

  const [selectedButton, setSelectedButton] = useState(1)
  const [messageLoad, setMessageLoad] = useState(false)

  const handleButtonPress = button => {
    setSelectedButton(button)
  }
  const { getRoomId } = useRooms(userId)
  const handleNavigateToChat = async () => {
    setMessageLoad(true)
    const roomId = await getRoomId(userInfo.uid)
    setMessageLoad(false)

    NavigationService.navigate('Chat', { userInfo, roomId })
  }
  return (
    <SafeAreaView style={styles.mainContainer}>
      <CustomUserStatusBar userInfo={userInfo} />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
        }}>
        <TouchableOpacity
          style={styles.buttonNew}
          onPress={handleNavigateToChat}
          disabled={messageLoad}>
          {messageLoad ? (
            <ActivityIndicator />
          ) : (
            <Text style={styles.textButton}>Message</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          disabled={isBlockLoading || followLoading}
          style={styles.buttonNew}
          onPress={() =>
            friendInfo?.isBlocked
              ? (handleUnblock(userInfo.uid), handleGetUserInfo())
              : handleFollow(userInfo.uid)
          }>
          <View>
            {isBlockLoading || followLoading ? (
              <ActivityIndicator />
            ) : (
              <Text style={styles.textButton}>
                {friendInfo?.isBlocked
                  ? 'Unblock'
                  : isFollowing == false
                  ? 'Follow'
                  : 'Unfollow'}
              </Text>
            )}
          </View>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginVertical: heightPercentageToDP(2),
          marginHorizontal: heightPercentageToDP(2),
        }}>
        <Pressable onPress={() => handleButtonPress(1)}>
          <Text
            style={selectedButton === 1 ? styles.selectedText : styles.unSelectedText}>
            {'Profile'}
          </Text>
        </Pressable>
        <Pressable onPress={() => handleButtonPress(2)}>
          <Text
            style={selectedButton === 2 ? styles.selectedText : styles.unSelectedText}>
            {'Compete'}
          </Text>
        </Pressable>
        <Pressable onPress={() => handleButtonPress(3)}>
          <Text
            style={selectedButton === 3 ? styles.selectedText : styles.unSelectedText}>
            {'Challenges'}
          </Text>
        </Pressable>
        {/* <Pressable onPress={() => handleButtonPress(3)}> */}
        <Text
          // style={selectedButton === 3 ? styles.selectedText : styles.unSelectedText}>
          style={{ color: colors.darkBackground }}>
          {'Messages'}
        </Text>
        {/* </Pressable> */}
      </View>
      <HorizontalRule />
      {(selectedButton == 1 || selectedButton == 3) && (
        <VirtualizedView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
          contentContainerStyle={{
            paddingHorizontal: widthPercentageToDP(2),
            paddingBottom: heightPercentageToDP(4),
          }}
          refreshControl={
            <RefreshControl
              colors={[colors.offWhite]}
              tintColor={colors.offWhite}
              refreshing={refreshing}
              onRefresh={handleRefreshProfile}
            />
          }>
          {selectedButton == 1 && (
            <>
              <UserPortfolio userInfo={userInfo} />
              <Challenges
                friend={userInfo}
                profile={false}
                handleButtonPress={handleButtonPress}
              />
            </>
          )}

          {selectedButton == 3 && <Challenges friend={userInfo} profile={false} />}
        </VirtualizedView>
      )}
      {selectedButton == 2 && <ProfileCompete friend={userInfo} />}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: colors.darkBackground },
  scrollView: {
    backgroundColor: colors.darkBackground,
    // marginBottom: heightPercentageToDP(4),
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
  selectedText: [
    textStyles.bigBold,
    {
      fontSize: actuatedNormalize(14),
      color: 'white',
    },
  ],
  unSelectedText: [
    textStyles.bigRegular,
    {
      fontSize: actuatedNormalize(14),
      color: 'gray',
    },
  ],
  seeAllText: [
    textStyles.bigRegular,
    {
      fontSize: actuatedNormalize(12),
      color: 'gray',
    },
  ],
  buttonNew: {
    paddingVertical: widthPercentageToDP(2),
    borderRadius: actuatedNormalize(5),
    borderColor: 'white',
    borderWidth: widthPercentageToDP(0.3),
    alignSelf: 'center',
    width: widthPercentageToDP(40),
    alignItems: 'center',
  },
  textButton: [
    textStyles.bigMedium,
    {
      fontSize: actuatedNormalize(13),
      color: 'white',
    },
  ],
})
export { ProfileUser }
