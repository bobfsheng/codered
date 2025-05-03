import React, { memo } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import moment from 'moment'
import {
  actuatedNormalize,
  colors,
  heightPercentageToDP,
  textStyles,
  widthPercentageToDP,
} from '@utils'
import { useNotifBet } from '@hooks'
import { capitalize } from 'lodash'

const NotificationBubbleBetResponse = memo(({ notification }) => {
  const { betAmount, timeline, challengeStatus, acceptedAt } = notification
  const { friendInfo } = useNotifBet(notification)
  const time = timeline === '1' ? '1 hour' : timeline === '24' ? '24 hours' : 'Week'
  const textWidth = widthPercentageToDP(75)

  return (
    <>
      <View style={styles.mainContainer}>
        <View style={styles.emojiContainer}>
          <View style={styles.emojiSubContainer}>
            <Text style={styles.emojiStyle}>{friendInfo?.userEmoji ?? '😊'}</Text>
          </View>
        </View>
        <View style={{ flex: 5, paddingLeft: '2%' }}>
          <Text
            style={[
              textStyles.smallBold,
              {
                color: 'black',
                width: textWidth,
                fontSize: actuatedNormalize(12),
                marginBottom: heightPercentageToDP(0.7),
              },
            ]}>
            <Text
              style={[
                textStyles.smallBold,
                {
                  color: colors.primary,
                  fontSize: actuatedNormalize(12),
                  textDecorationLine: 'underline',
                },
              ]}>
              {capitalize(friendInfo?.userName)}
            </Text>
            {` ${challengeStatus} your challenge for `}
            <Text
              style={[
                textStyles.smallBold,
                { color: colors.primary, fontSize: actuatedNormalize(12) },
              ]}>
              ${betAmount}.
            </Text>
          </Text>
          <Text style={[textStyles.smallMedium, { color: 'black', width: textWidth }]}>
            {challengeStatus === 'denied'
              ? 'Maybe some other time you can request again'
              : `Whomever makes more profit in the next ${time} wins! Challenged on ${moment(
                  acceptedAt,
                ).format('lll')}`}
          </Text>
        </View>
      </View>
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
})

export { NotificationBubbleBetResponse }
