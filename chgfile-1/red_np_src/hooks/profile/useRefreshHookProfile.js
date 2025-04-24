import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import {
  getAccountHistory,
  getAccountPortfolio,
  getAccountPositions,
  useAuthSelector,
} from '@store'
import { badgeLevels } from '@constants/badgeLevels'

function useRefreshHookProfile() {
  const [refreshing, setRefreshing] = useState(false)
  const dispatch = useDispatch()

  const { isLoggedIn, alpacaToken, userBio, userId } = useAuthSelector(state => state)

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

  const handleRefreshProfile = React.useCallback(async () => {
    setRefreshing(true)
    if (!isLoggedIn || !alpacaToken) {
      setRefreshing(false)

      return
    }
    dispatch(getAccountPortfolio())
    dispatch(getAccountHistory())
    dispatch(getAccountPositions())

    setRefreshing(false)
  }, [])

  return { refreshing, handleRefreshProfile }
}

export { useRefreshHookProfile }
