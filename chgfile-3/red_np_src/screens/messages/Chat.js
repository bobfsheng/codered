import React, { useEffect, useMemo, useState } from 'react'
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native'
import { OptionsComponent, BackChevron, Icon } from '@components'
import {
  actuatedNormalize,
  colors,
  heightPercentageToDP,
  textStyles,
  widthPercentageToDP,
} from '@utils'
import { useAuthSelector } from '@store'
import { GiftedChat, Bubble } from 'react-native-gifted-chat'

import { useFriendOption, useMessages } from '@hooks'

const Chat = ({ route }) => {
  const { userId, userName, userEmoji } = useAuthSelector(state => state)
  const { userInfo: friendInfo, roomId = '' } = route.params
  const { showFriendOptionId, setShowFriendOptionId } = useFriendOption()
  const [messages, setMessages] = useState([])
  const {
    messages: messagesData,
    sendMessage,
    loadMore,
    isEndOfList,
    loading,
  } = useMessages(roomId)
  useEffect(() => {
    setMessages(messagesData)
  }, [messagesData])

  const items = useMemo(() => {
    return (
      messagesData.map(message => {
        const sender =
          message?.senderId === userId ? { uid: userId, userName, userEmoji } : friendInfo
        return {
          _id: message?.id,
          text: message?.message,
          createdAt: new Date(message?.date),
          user: {
            _id: sender.uid,
            name: `${sender?.userName}`,
          },
        }
      }) || []
    )
  }, [messages])
  return (
    <>
      <SafeAreaView style={styles.mainContainer}>
        {/* <View style={styles.topBar}> */}
        {/* <View style={styles.topBar}> */}

        <View style={styles.topBar}>
          <BackChevron />
          <View
            style={{
              alignContent: 'center',
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
              marginHorizontal: widthPercentageToDP(1),
              backgroundColor: colors.offWhite,
              width: widthPercentageToDP(10),
              height: widthPercentageToDP(10),
              borderRadius: widthPercentageToDP(30),
            }}>
            <Text
              style={{
                fontSize: actuatedNormalize(13),
                color: 'white',
                margin: widthPercentageToDP(0.5),
                alignSelf: 'center',
              }}>
              {friendInfo?.userEmoji == undefined || friendInfo?.userEmoji == ''
                ? '😊'
                : friendInfo?.userEmoji}
            </Text>
          </View>
          <Text
            style={[
              textStyles.normalBold,
              {
                marginTop: widthPercentageToDP(3),
                marginHorizontal: widthPercentageToDP(3),
                color: 'white',
              },
            ]}>
            {friendInfo?.userName ?? ''}
          </Text>
        </View>
        <Icon
          type="Entypo"
          name={'dots-three-vertical'}
          size={actuatedNormalize(18)}
          color="white"
          style={{
            marginRight: widthPercentageToDP(5),
            marginTop: heightPercentageToDP(1.5),
          }}
          onPress={() => setShowFriendOptionId(friendInfo?.uid)}
          // props={{ disabled: isLoading }}
        />
        {/* </View> */}
        {/* </View> */}
      </SafeAreaView>
      <GiftedChat
        infiniteScroll={!isEndOfList}
        loadEarlier={!isEndOfList}
        isLoadingEarlier={loading}
        onLoadEarlier={() => loadMore()}
        renderLoadEarlier={() => (
          <TouchableOpacity onPress={() => loadMore()} style={styles.loadMoreBtn}>
            <Text style={styles.loadMoreText}>Load More</Text>
          </TouchableOpacity>
        )}
        messages={items}
        onSend={val => sendMessage(val[0].text, friendInfo)}
        user={{
          _id: userId,
          name: `${userName}`,
        }}
        renderBubble={props => (
          <Bubble
            {...props}
            wrapperStyle={{
              left: { backgroundColor: 'white' },
              right: { backgroundColor: colors.primary },
            }}
          />
        )}
      />
      {!!showFriendOptionId && (
        <OptionsComponent
          chat={true}
          visible={!!showFriendOptionId}
          handleClose={() => setShowFriendOptionId('')}
          userId={showFriendOptionId}
        />
      )}
    </>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    paddingTop: Platform.OS === 'android' ? 40 : 0,
    flex: 0.1,
    // backgroundColor: "#f4efff",
    backgroundColor: colors.darkBackground,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 999,
    //  flex: 1, paddingTop: 25,
    backgroundColor: colors.darkBackground,
  },
  headingText: [
    textStyles.bigBold,
    {
      fontSize: actuatedNormalize(13.5),
      color: 'white',
      marginLeft: widthPercentageToDP(8),
      marginVertical: heightPercentageToDP(2),
    },
  ],
  containerStyle: {
    borderRadius: 10,
  },
  input: [
    textStyles.normalRegular,
    {
      height: 50,
      margin: 12,
      borderWidth: 1,
      borderRadius: 5,
      borderColor: 'white',
      backgroundColor: 'white',
      textAlign: 'left',
      marginHorizontal: 2,
      paddingLeft: widthPercentageToDP(2),
    },
  ],
  isHighlighted: [
    textStyles.normalRegular,
    {
      borderColor: colors.primary2,
    },
  ],
  top: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 160,
    height: 100,
    marginRight: 25,
    zIndex: 99,
    flexDirection: 'row',
  },
  loadMoreText: [
    textStyles.normalRegular,
    {
      fontSize: actuatedNormalize(12),
      color: 'white',
      textAlign: 'center',
    },
  ],
  loadMoreBtn: {
    padding: widthPercentageToDP(2),
    marginTop: 50,
    backgroundColor: colors.primary,
    alignSelf: 'center',
    borderRadius: 99,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBar: {
    flexDirection: 'row',
    paddingBottom: heightPercentageToDP(2),
    justifyContent: 'space-between',
  },
})
export { Chat }
