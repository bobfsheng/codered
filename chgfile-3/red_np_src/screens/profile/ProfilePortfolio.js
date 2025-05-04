import React, { useEffect, useState } from 'react'
import {
  StyleSheet,
  Pressable,
  View,
  Text,
  ScrollView
} from 'react-native'
import database from '@react-native-firebase/database'
import {
  actuatedNormalize,
  heightPercentageToDP,
  textStyles,
  widthPercentageToDP,
  screenTitle,
} from '@utils'
import { useRefreshHookProfile, useRefreshHookExplore } from '@hooks'
import {
  CustomButton,
  HorizontalRule,
  Icon,
  ProfileChart
} from '@components'
import  {
  useAuthSelector,
  useUserSelector,
  useReduxDispatch,
  getAccountOrders,
  getAccountHistory,
  getAccountActivities,
} from '@store'
import { NavigationService } from '@navigation'
import { capitalize } from 'lodash'
import { badgeLevels } from '@constants/badgeLevels'

const ProfilePortfolio = () => {
  const dispatch = useReduxDispatch()
  const {
    positions,
    activities,
  } = useUserSelector(state => state)
  const { userId } = useAuthSelector(state => state)

  const { userBio } = useAuthSelector(state => state)


  const { positionsExplore, handleRefreshExplore } = useRefreshHookExplore()

  useEffect(() => {
    handleRefreshExplore()
  }, [])

  const { handleRefreshProfile, refreshing } = useRefreshHookProfile()


  // const [selectedBubbleButton, setSelectedBubbleButton] = useState(1)

  // const handleBubbleButtonPress = button => {
  //   setSelectedBubbleButton(button)
  // }

  const [weeklyRank, setWeeklyRank] = useState('0')

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

  const [weeklyRanke, setWeeklyRanke] = useState(10)

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

  useEffect(() => {
    handleRefreshProfile()
    dispatch(getAccountOrders())
    dispatch(getAccountHistory())
    dispatch(getAccountActivities()).catch(error => console.log(error))
  }, [])


  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <>
        {/* BIO */}
        <ProfileChart />
        <HorizontalRule />
        <View
          style={{
            marginHorizontal: widthPercentageToDP(3),
            marginBottom: heightPercentageToDP(6),
          }}>
          <View style={styles.overViewSubContainer}>
            <Text style={styles.profileBio}>
              {userBio 
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
          {/* RANKS */}
          <Pressable
            onPress={() =>
              NavigationService.navigate('Home', {
                screen: 'Leaderboard',
              })
            }>
            <View style={styles.overViewSubContainer}>
              <Text style={styles.profileInfo}>
                {weeklyRank == 'undefinedth' ? 'Trade to rank' : badgeName} 🏆
              </Text>
              <Text style={[styles.profileInfo, { color: 'gray' }]}>{badgeText}</Text>
            </View>
            <View
              style={[
                styles.overViewSubContainer,
                { marginBottom: heightPercentageToDP(2) },
              ]}>
              <Text style={styles.profileInfo}>
                {weeklyRank == 'undefinedth' ? '' : 'Weekly Rank'}
              </Text>
              <Text style={[styles.profileInfo, { color: 'gray' }]}>
                {weeklyRank == 'undefinedth' ? '' : weeklyRank}
              </Text>
            </View>
          </Pressable>
        </View>
      </>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
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
  buttonText: [
    textStyles.bigMedium,
    {
      fontSize: actuatedNormalize(15),
      color: 'black',
      marginTop: heightPercentageToDP(0.3),
    },
  ],
  selectedText: [
    textStyles.bigBold,
    {
      fontSize: actuatedNormalize(15),
      color: 'white',
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
export { ProfilePortfolio }