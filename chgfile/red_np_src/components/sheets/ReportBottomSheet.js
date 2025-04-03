import React, { memo, useEffect, useRef, useState } from 'react'
import { hasDynamicIsland, hasNotch } from 'react-native-device-info'
import { useReduxDispatch, useAuthSelector, useUserSelector, userActions } from '@store'
import { BottomSheet } from './BottomSheet'
import { View, Text, StyleSheet, Platform } from 'react-native'
import {
  colors,
  heightPercentageToDP,
  widthPercentageToDP,
  textStyles,
  actuatedNormalize,
} from '@utils'
import { Icon, BackChevron } from '@components'

const BOTTOMSHEETHEIGHT = 85
const ReportBottomSheet = memo(() => {
  const dispatch = useReduxDispatch()
  const { information } = useUserSelector(state => state)
  const ref = useRef(null)
  useEffect(() => {
    if (!information.info) {
      ref?.current?.scrollTo(0)
    } else {
      ref?.current?.scrollTo(
        hasDynamicIsland()
          ? -heightPercentageToDP(String(BOTTOMSHEETHEIGHT + 2))
          : hasNotch()
          ? -heightPercentageToDP(String(BOTTOMSHEETHEIGHT))
          : -heightPercentageToDP(String(BOTTOMSHEETHEIGHT)),
      )
    }
  }, [information.info])
  const removeInfoFromReducer = () => {
    dispatch(userActions.removeInformation())
  }
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
    onLoadMore,
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
    <BottomSheet
      ref={ref}
      height={
        hasDynamicIsland()
          ? BOTTOMSHEETHEIGHT + 2
          : hasNotch()
          ? BOTTOMSHEETHEIGHT
          : BOTTOMSHEETHEIGHT + 1.5
      }
      onClose={removeInfoFromReducer}
      closeBottomSheet={removeInfoFromReducer}>
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
          onLoadEarlier={onLoadMore}
          renderLoadEarlier={() => (
            <TouchableOpacity onPress={onLoadMore} style={styles.loadMoreBtn}>
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
    </BottomSheet>
  )
})

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

export { ReportBottomSheet }
