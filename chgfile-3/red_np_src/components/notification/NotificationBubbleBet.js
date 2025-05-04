import React, { memo } from 'react'
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native'
import {
  actuatedNormalize,
  colors,
  heightPercentageToDP,
  textStyles,
  capitalize,
  widthPercentageToDP,
} from '@utils'
import { useNotifBet } from '@hooks'

const NotificationBubbleBet = memo(({ notification }) => {
  const { betAmount, timeline, challengeType, bettingId, seen, id, notficationType } =
    notification

  const {
    challengeAcceptLoading,
    challengeDenyLoading,
    challengeStatus,
    friendInfo,
    handleAcceptChallenge,
    handleDenyChallenge,
  } = useNotifBet(notification)

  const time = timeline === '1' ? '1 hour' : timeline === '24' ? '24 Hours' : '1 Week'

  const renderActionButton = () => {
    if (challengeStatus === 'pending' || challengeStatus === 'accepted') {
      return (
        <Pressable
          disabled={challengeAcceptLoading || challengeStatus === 'accepted'}
          style={styles.acceptButton}
          onPress={handleAcceptChallenge}>
          {challengeAcceptLoading ? (
            <ActivityIndicator />
          ) : (
            <Text style={styles.acceptButtonText}>
              {challengeStatus === 'accepted' ? 'Accepted' : 'Accept'}
            </Text>
          )}
        </Pressable>
      )
    } else if (challengeStatus === 'pending' || challengeStatus === 'denied') {
      return (
        <Pressable
          disabled={challengeDenyLoading || challengeStatus === 'denied'}
          style={styles.denyButton}
          onPress={handleDenyChallenge}>
          {challengeDenyLoading ? (
            <ActivityIndicator />
          ) : (
            <Text style={styles.denyButtonText}>
              {challengeStatus === 'denied' ? 'Denied' : 'Deny'}
            </Text>
          )}
        </Pressable>
      )
    } else if (challengeStatus === 'cancelled') {
      return (
        <View style={styles.cancelledButton}>
          <Text style={styles.cancelledButtonText}>
            {`Challenge cancelled by ${capitalize(friendInfo?.userName)}`}
          </Text>
        </View>
      )
    }
  }

  return (
    <>
      <View style={styles.mainContainer}>
        <View style={styles.emojiContainer}>
          <View style={styles.emojiSubContainer}>
            <Text style={styles.emojiStyle}>{friendInfo?.userEmoji ?? '😊'}</Text>
          </View>
        </View>

        <View style={{ flex: 5, paddingLeft: '2%' }}>
          <Text style={styles.userNameText}>
            <Text style={styles.userNameHighlight}>
              {capitalize(friendInfo?.userName)}
            </Text>
            {' challenged you for '}
            <Text style={styles.betAmountText}>${betAmount}.</Text>
          </Text>
          <Text style={styles.timeText}>
            {`Whomever makes more profit in ${time} wins!`}
          </Text>
        </View>
      </View>
      <View style={styles.challengeContainer}>{renderActionButton()}</View>
    </>
  )
})

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: '#F6F6F6',
    paddingVertical: '3%',
    width: '95%',
    alignSelf: 'center',
    marginVertical: heightPercentageToDP(1),
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: '2%',
  },
  emojiContainer: {
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  emojiSubContainer: {
    width: widthPercentageToDP(14),
    height: widthPercentageToDP(14),
    borderRadius: widthPercentageToDP(50),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#B2D0CE',
  },
  emojiStyle: {
    fontSize: actuatedNormalize(22),
  },
  userNameText: {
    ...textStyles.smallBold,
    color: 'black',
    width: widthPercentageToDP(75),
    fontSize: actuatedNormalize(12),
    marginBottom: heightPercentageToDP(0.7),
  },
  userNameHighlight: {
    color: colors.primary,
    fontSize: actuatedNormalize(12),
    textDecorationLine: 'underline',
  },
  betAmountText: {
    color: colors.primary,
    fontSize: actuatedNormalize(12),
  },
  timeText: {
    ...textStyles.smallMedium,
    color: 'black',
    width: widthPercentageToDP(75),
  },
  challengeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  acceptButton: {
    borderRadius: 30,
    width: '47%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: heightPercentageToDP(0.2),
    marginHorizontal: '1.5%',
    backgroundColor: 'white',
  },
  acceptButtonText: {
    ...textStyles.normalSemiBold,
    color: 'black',
  },
  denyButton: {
    borderRadius: 30,
    width: '47%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: heightPercentageToDP(0.2),
    marginHorizontal: '1.5%',
    backgroundColor: 'black',
    borderColor: 'white',
  },
  denyButtonText: {
    ...textStyles.normalSemiBold,
    color: 'white',
  },
  cancelledButton: {
    borderRadius: 30,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: heightPercentageToDP(0.2),
    marginHorizontal: '1.5%',
    paddingHorizontal: '4%',
    backgroundColor: 'black',
    borderColor: 'white',
  },
  cancelledButtonText: {
    ...textStyles.normalSemiBold,
    color: 'white',
  },
})

export { NotificationBubbleBet }