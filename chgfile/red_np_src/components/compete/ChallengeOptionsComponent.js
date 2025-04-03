import React, { useState } from 'react'
import { NavigationService } from '@navigation'
import { Icon } from '@components'

import { View, StyleSheet, Text, ActivityIndicator } from 'react-native'
import {
  colors,
  widthPercentageToDP,
  heightPercentageToDP,
  textStyles,
  actuatedNormalize,
} from '@utils'
import { useFriendOption } from '@hooks'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { usePlaceBetting } from '../../hooks/profile/Betting/usePlaceBetting'

const ChallengeOptionsComponent = ({
  visible,
  userId,
  handleClose,
  challengeType,
  pending,
  betAmount,
  betId,
  getAllPendingUserBets,
}) => {
  const handlePressOption = callBackFunc => {
    handleClose()
    callBackFunc()
  }
  const [deletePressed, setDeletePressed] = useState(false)
  const { handleShareUserProfile } = useFriendOption()
  const { handleCancelBet } = usePlaceBetting()

  return (
    <View
      style={[
        styles.mainContainer,
        {
          alignSelf:
            challengeType == 'past' || challengeType == 'active' ? 'center' : 'flex-end',
          marginRight: widthPercentageToDP(
            challengeType == 'past' || challengeType == 'active' ? 0 : 6,
          ),
          marginTop: heightPercentageToDP(challengeType == 'past' ? 0 : 25),
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
      {pending == true && (
        <TouchableOpacity
          style={[styles.subContainer]}
          onPress={async () => {
            setDeletePressed(true)
            await handleCancelBet(betId, betAmount)
            setDeletePressed(prev => !prev)
            handleClose()
            getAllPendingUserBets()
            // Invoke the handleClose function after canceling the bet
          }}>
          <Text style={styles.optionText}>Cancel</Text>
          {deletePressed == true ? (
            <ActivityIndicator />
          ) : (
            <Icon
              type="Ionicons"
              name="trash-sharp"
              style={{}}
              size={widthPercentageToDP(4.3)}
              color="black"
            />
          )}
        </TouchableOpacity>
      )}
      {/* {pending !==true &&
          <TouchableOpacity style={[styles.subContainer]}
           onPress={() => handleNavigateToChat()}>
            <Text style={styles.optionText}>Message</Text>
            <Icon
              type="Feather"
              name="message-circle"
              style={{}}
              size={widthPercentageToDP(4.3)}
              color="black"
            />
          </TouchableOpacity>} */}
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
  },
  topContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
  },
  subContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: widthPercentageToDP(26),
    // paddingHorizontal:widthPercentageToDP(3),
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

export { ChallengeOptionsComponent }
