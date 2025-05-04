import React, { useState } from 'react'
import { NavigationService } from '@navigation'
import { Icon } from '@components'
import { Modal, View, StyleSheet, Text, ActivityIndicator, Platform, TouchableWithoutFeedback } from 'react-native'
import {
  colors,
  widthPercentageToDP,
  heightPercentageToDP,
  textStyles,
  actuatedNormalize,
} from '@utils'
import { useFriendOption, useRooms } from '@hooks'
import { TouchableOpacity } from 'react-native-gesture-handler'

const OptionsComponent = ({
  visible,
  userId,
  handleClose,
  challengeType,
  chat,
  userInfo,
}) => {
  const handlePressOption = callBackFunc => {
    handleClose()
    callBackFunc()
  }
  const [messageLoad, setMessageLoad] = useState(false)
  const { handleShareUserProfile } = useFriendOption()
  const { getRoomId } = useRooms(userId)
  const handleNavigateToChat = async () => {
    setMessageLoad(true)
    const roomId = await getRoomId(userInfo.uid)
    handleClose()
    setMessageLoad(false)
    NavigationService.navigate('Chat', { userInfo, roomId })
  }
  return (
    <Modal
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
      style={{ flex: 1 }}>
      {/* <TouchableWithoutFeedback onPress={handleClose}> */}
        <View
          style={{
            backgroundColor: 'rgba(0, 0, 0,0.5)',
            height: heightPercentageToDP(100),
            width: widthPercentageToDP(100),
            alignSelf: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}>
          <View
            style={[
              styles.mainContainer,
              {
                alignSelf:
                  challengeType == 'past' || challengeType == 'active'
                    ? 'center'
                    : 'flex-end',
                marginRight: widthPercentageToDP(
                  challengeType == 'past' || challengeType == 'active' ? 0 : 6,
                ),
                marginTop: heightPercentageToDP(
                  challengeType == 'past' ? 0 : chat == true ? 0 : 25,
                ),
                marginBottom: heightPercentageToDP(chat == true ? 67 : 0),
              },
            ]}>
            <TouchableOpacity
              onPress={handleClose}
              style={[styles.subContainer, { marginBottom: heightPercentageToDP(2) }]}>
              <Text style={styles.optionText}></Text>
              <Icon
                type="Ionicons"
                name="close"
                style={{}}
                size={widthPercentageToDP(4.3)}
                color="black"
              />
            </TouchableOpacity>
            {/* <TouchableOpacity style={[styles.subContainer]}>
            <Text style={styles.optionText}>Challenge</Text>
            <Icon
              type="Entypo"
              name="game-controller"
              style={{}}
              size={widthPercentageToDP(4.3)}
              color="black"
            />
          </TouchableOpacity> */}

            {chat == false ||
              (Platform.OS !== 'android' && (
                <>
                  <TouchableOpacity
                    style={[styles.subContainer]}
                    disabled={messageLoad}
                    onPress={() => handleNavigateToChat()}>
                    <Text style={styles.optionText}>Message</Text>
                    {messageLoad ? (
                      <ActivityIndicator color="black" />
                    ) : (
                      <Icon
                        type="Feather"
                        name="message-circle"
                        style={{}}
                        size={widthPercentageToDP(4.3)}
                        color="black"
                      />
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.subContainer]}
                    onPress={() => handleShareUserProfile(userId)}>
                    <Text style={styles.optionText}>Share</Text>
                    <Icon
                      type="Feather"
                      name="share"
                      style={{}}
                      size={widthPercentageToDP(4.3)}
                      color="black"
                    />
                  </TouchableOpacity>
                </>
              ))}

            <TouchableOpacity
              onPress={() =>
                handlePressOption(() =>
                  NavigationService.navigate('ReportScreen', { reportedUserId: userId }),
                )
              }
              style={[styles.subContainer]}>
              <Text style={styles.optionText}>Report</Text>
              <Icon
                type="AntDesign"
                name="exclamationcircle"
                style={{}}
                size={widthPercentageToDP(4)}
                color="black"
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.subContainer]}
              onPress={() =>
                handlePressOption(() =>
                  NavigationService.navigate('BlockScreen', { reportedUserId: userId }),
                )
              }>
              <Text style={styles.optionText}>Block</Text>
              <Icon
                type="Entypo"
                name="block"
                style={{}}
                size={widthPercentageToDP(4)}
                color="black"
              />
            </TouchableOpacity>
          </View>
        </View>
      {/* </TouchableWithoutFeedback> */}
    </Modal>
  )
}
const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: colors.offWhite,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: heightPercentageToDP(1),
    paddingVertical: heightPercentageToDP(1),
    paddingHorizontal: widthPercentageToDP(4),

    // position:'absolute'
  },
  subContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: widthPercentageToDP(26),
    marginVertical: heightPercentageToDP(0.3),
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  optionText: [
    textStyles.bigRegular,
    {
      fontSize: actuatedNormalize(12),
      color: 'black',
    },
  ],
})

export { OptionsComponent }
