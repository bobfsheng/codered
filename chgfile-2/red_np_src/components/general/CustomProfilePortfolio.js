import React, { memo, useState, useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import {
  actuatedNormalize,
  colors,
  heightPercentageToDP,
  textStyles,
  widthPercentageToDP,
  screenTitle,
  capitalize,
} from '@utils'
import { Icon } from '@components'
import { useAuthSelector } from '@store'
import { badgeLevels } from '@constants/badgeLevels'
import { NavigationService } from '@navigation'

const CustomProfilePortfolio = memo(({}) => {
  const { userBio, userId } = useAuthSelector(state => state)
  const [weeklyRank, setWeeklyRank] = useState('0')
  const [weeklyRanke, setWeeklyRanke] = useState('0')

  useEffect(() => {
    ;(async () => {
      try {
        const snapShot = await database().ref(`User/${userId}`).once('value')
        const { weeklyRank } = snapShot.val()
        setWeeklyRank(weeklyRank)
        setWeeklyRanke(weeklyRank)
        if (weeklyRank === 1) {
          setWeeklyRank('1st')
        } else if (weeklyRank === 2) {
          setWeeklyRank('2nd')
        } else if (weeklyRank === 3) {
          setWeeklyRank('3rd')
        } else {
          setWeeklyRank(`${weeklyRank}th`)
        }
      } catch (error) {}
    })()
  }, [userId])

  const getBadgeName = userRank => {
    const badge = badgeLevels.find(
      badge => badge.lowest <= userRank && badge.highest >= userRank,
    )
    return badge ? badge.name : ''
  }

  const getBadgeText = userRank => {
    const badge = badgeLevels.find(
      badge => badge.lowest <= userRank && badge.highest >= userRank,
    )
    return badge ? badge.percent : ''
  }

  const badgeText = getBadgeText(weeklyRanke)
  const badgeName = getBadgeName(weeklyRanke)

  return (
    <View>
      {/* BIO */}
      <View style={styles.overViewSubContainer}>
        <Text style={styles.profileBio}>
          {userBio !== undefined
            ? capitalize(userBio)
            : "You don't have a bio yet. Tap on the edit icon to the right, to add one"}{' '}
          <Icon
            type="Feather"
            name="edit"
            size={widthPercentageToDP(4)}
            style={{
              marginRight: widthPercentageToDP(3),
            }}
            onPress={() => NavigationService.navigate('BioEditorScreen', {})}
            color="gray"
          />
        </Text>
      </View>
      <View style={styles.overViewSubContainer}>
        <Text style={styles.profileInfo}>{badgeName} 🏆</Text>
        <Text style={[styles.profileInfo, { color: 'gray' }]}>{badgeText}</Text>
      </View>
      <View
        style={[styles.overViewSubContainer, { marginBottom: heightPercentageToDP(2) }]}>
        <Text style={styles.profileInfo}>Weekly Rank</Text>
        {/* <Text style={[styles.profileInfo, { color: colors.white }]}>
                {weeklyRank == 'undefinedth' ? '' : weeklyRank}
                </Text> */}
        <Text style={[styles.profileInfo, { color: 'gray' }]}>
          {weeklyRank == 'undefinedth' ? '' : weeklyRank}
        </Text>
      </View>
    </View>
  )
})

const styles = StyleSheet.create({
  mainContainer: { flex: 1, paddingTop: 25, backgroundColor: colors.darkBackground },
  scrollView: {
    backgroundColor: colors.darkBackground,
    marginBottom: heightPercentageToDP(0),
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
  overViewSubContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  overViewType: [
    screenTitle,
    textStyles.hugeRegular,
    {
      marginTop: heightPercentageToDP(1),
      fontSize: actuatedNormalize(14),
      color: 'white',
    },
  ],
  overViewType: [
    screenTitle,
    textStyles.hugeRegular,
    {
      marginTop: heightPercentageToDP(1),
      fontSize: actuatedNormalize(14),
      color: 'white',
    },
  ],
  profileBio: [
    screenTitle,
    textStyles.hugeRegular,
    {
      marginTop: heightPercentageToDP(1),
      fontSize: actuatedNormalize(15.3),
      color: 'white',
    },
  ],
  profileInfo: [
    screenTitle,
    textStyles.hugeBold,
    {
      marginTop: heightPercentageToDP(1),
      fontSize: actuatedNormalize(15),
      color: 'white',
    },
  ],
  selectedText: [
    textStyles.bigBold,
    {
      fontSize: actuatedNormalize(15),
      color: 'white',
    },
  ],
  buttonText: [
    textStyles.bigMedium,
    {
      fontSize: actuatedNormalize(15),
      color: 'black',
      marginTop: heightPercentageToDP(0.3),
    },
  ],
  unSelectedText: [
    textStyles.bigRegular,
    {
      fontSize: actuatedNormalize(15),
      color: 'gray',
    },
  ],
})
export { CustomProfilePortfolio }
