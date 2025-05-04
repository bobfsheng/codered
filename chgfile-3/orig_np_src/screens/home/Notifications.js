import React, { useEffect } from 'react'
import { FlatList, View, Text, RefreshControl } from 'react-native'
import {
  NotificationBubble,
  NotificationBubbleBet,
  NotificationBubbleBetResponse,
  NotificationBubbleBetResult,
} from '@components'
import { colors, heightPercentageToDP, textStyles } from '@utils'
import { useNotification } from '../../hooks/homescreen/useNotification'
import { useReduxDispatch, useUserSelector, userActions } from '@store'

const Notifications = () => {
  const dispatch = useReduxDispatch()
  const { notificationList } = useUserSelector(state => state)
  const { refreshing, getNewNotifications, getOldNotifications } = useNotification()

  useEffect(() => {
    dispatch(userActions.setHaveNewNotification({ check: false }))
    getNewNotifications()
  }, [])

  const renderItem = ({ item }) => {
    switch (item.notficationType) {
      case 'bettingRequest':
        return <NotificationBubbleBet notification={item} />
      case 'bettingResponse':
        return <NotificationBubbleBetResponse notification={item} />
      case 'bettingResult':
        return <NotificationBubbleBetResult notification={item} />
      default:
        return <NotificationBubble notification={item} />
    }
  }

  const onRefresh = () => {
    getNewNotifications()
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.darkBackground }}>
      <FlatList
        style={{ marginTop: heightPercentageToDP(3) }}
        data={notificationList.slice(0, 50)}
        renderItem={renderItem}
        extraData={notificationList}
        refreshControl={
          <RefreshControl
            colors={[colors.offWhite]}
            tintColor={colors.offWhite}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        refreshing={refreshing}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={() => (
          <View>
            <Text
              style={[textStyles.normalMedium, { color: 'white', textAlign: 'center' }]}>
              No Notifications Yet!
            </Text>
          </View>
        )}
      />
    </View>
  )
}

export { Notifications }