import React, { memo, useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native'
import {
  CustomSearchBar,
  UserComponent,
  FriendChatComponent,
  BackChevron,
  Icon,
  BetUserComponent,
} from '@components'
import {
  actuatedNormalize,
  colors,
  heightPercentageToDP,
  textStyles,
  widthPercentageToDP,
} from '@utils'
import { NavigationService } from '@navigation'
import { useAuthSelector, useReduxDispatch, useUserSelector, userActions } from '@store'
import { useRooms, useSearchFriends } from '@hooks'

const Messages = () => {
  const dispatch = useReduxDispatch()
  const { userId } = useAuthSelector(state => state)
  const { searchLoading, searchedUsers, handleSearch } = useSearchFriends()
  const { searchFriendString } = useUserSelector(state => state)
  const [messageLoad, setMessageLoad] = useState(false)
  const { rooms, getRoomId } = useRooms(userId)
  const handleNavigateToChat = async otherUser => {
    setMessageLoad(true)
    const roomId = await getRoomId(otherUser.uid)
    dispatch(userActions.setSearchFriendString({ searchString: '' }))
    setMessageLoad(false)
    NavigationService.navigate('Chat', { userInfo: otherUser, roomId })
  }
  useEffect(() => {
    dispatch(userActions.setHaveNewMessage({ check: false }))
  }, [])
  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.topBarBackChevron}>
        <BackChevron onPress={() => NavigationService.navigate('HomeScreen')} />
        {/* <Icon
                      style={{ marginRight: widthPercentageToDP(5) }}
                      type="MaterialCommunityIcons"
                      name={'chat-plus'}
                      size={actuatedNormalize(22)}
                      color="white"
                      onPress={() => handleFollow(userInfo.uid)}
                    /> */}
      </View>
      <CustomSearchBar
        messages={false}
        searchString={searchFriendString}
        setSearchString={val =>
          dispatch(userActions.setSearchFriendString({ searchString: val }))
        }
        loading={searchLoading}
        onPress={handleSearch}
      />
      <Text style={styles.headingText}>
        {searchFriendString?.length > 0 ? 'Search' : 'Chats'}
      </Text>
      <View style={{ height: '76%' }}>
        {searchFriendString?.length > 0 ? (
          <FlatList
            data={searchedUsers}
            renderItem={({ item, index }) => (
              <BetUserComponent
                key={index}
                userInfo={item}
                handleNavigateToChat={handleNavigateToChat}
                handleSelectUser={false}
              />
            )}
          />
        ) : (
          <FlatList
            data={rooms}
            renderItem={({ item, index }) => (
              <FriendChatComponent key={index} data={item} />
            )}
            extraData={rooms}
          />
        )}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: colors.darkBackground },
  headingText: [
    textStyles.bigBold,
    {
      fontSize: actuatedNormalize(13.5),
      color: 'white',
      marginLeft: widthPercentageToDP(8),
      marginVertical: heightPercentageToDP(2),
    },
  ],
  topBar: { flexDirection: 'row', paddingBottom: heightPercentageToDP(2) },
  topBarBackChevron: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})
export { Messages }
