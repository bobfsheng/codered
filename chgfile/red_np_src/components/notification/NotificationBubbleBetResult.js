import React, { memo } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import {
  actuatedNormalize,
  colors,
  heightPercentageToDP,
  textStyles,
  capitalize,
  widthPercentageToDP,
} from '@utils'
import { useNotifBet } from '@hooks'
import { useAuthSelector } from '@store'

const NotificationBubbleBetResult = memo(({ notification }) => {
  const { userId } = useAuthSelector(state => state)
  const { betAmount, winnerId } = notification
  const { friendInfo } = useNotifBet(notification)

  const winningStatement = '🏆 You made'
  const losingStatement = 'You lost'
  const tieStatement = 'Challenge them again another time!'
  const textWidth = widthPercentageToDP(75)

  return (
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
            {winnerId === '' ? '' : 'You'}
          </Text>
          {userId === winnerId
            ? ' won the challenge with '
            : winnerId === ''
            ? 'Challenge resulted in a tie with '
            : ' lost the challenge with '}
          <Text
            style={[
              textStyles.smallBold,
              { color: colors.primary, fontSize: actuatedNormalize(12) },
            ]}>
            {userId === winnerId
              ? friendInfo?.userName ?? ''
              : winnerId === ''
              ? friendInfo?.userName ?? ''
              : friendInfo?.userName ?? ''}
          </Text>
        </Text>
        <Text
          style={[
            textStyles.smallMedium,
            {
              color: 'black',
              width: textWidth,
              fontSize: actuatedNormalize(12),
            },
          ]}>
          {userId === winnerId
            ? winningStatement
            : winnerId === ''
            ? tieStatement
            : losingStatement}{' '}
          <Text
            style={[
              textStyles.smallBold,
              {
                color: userId === winnerId ? colors.primary : 'black',
                width: textWidth,
                fontSize: actuatedNormalize(12),
              },
            ]}>
            {winnerId === '' ? '' : `$ ${betAmount * 2 * 0.9}`}
          </Text>
        </Text>
      </View>
    </View>
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

export { NotificationBubbleBetResult }