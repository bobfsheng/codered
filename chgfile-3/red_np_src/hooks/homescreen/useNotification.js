import { useState } from 'react'
import _ from 'lodash'
import firestore from '@react-native-firebase/firestore'
import { useAuthSelector, useReduxDispatch, useUserSelector, userActions } from '@store'
const LIMIT = 30
const useNotification = () => {
  const dispatch = useReduxDispatch()
  const { userId } = useAuthSelector(state => state)
  const { notificationList } = useUserSelector(state => state)
  const [refreshing, setRefresing] = useState(false)
  const handleInsertNewNotifications = newnNotifications => {
    const mergedNotifications = newnNotifications.concat(notificationList)
    const filtered = _.uniqBy(mergedNotifications, function (e) {
      return e.id
    })
    return filtered
  }
  const handleFilterNotifications = newnNotifications => {
    const mergedNotifications = notificationList.concat(newnNotifications)
    const filtered = _.uniqBy(mergedNotifications, function (e) {
      return e.id
    })
    return filtered
  }
  const handleDispatchNotifications = notificationList => {
    dispatch(userActions.setNotificationList({ notificationList }))
  }
  const collectionRef = firestore().collection('Notifications')
  const query = collectionRef
    .where('uid', '==', userId)
    .orderBy('createdAt', 'desc')
    .limit(LIMIT)
  const getNewNotifications = async () => {
    try {
      setRefresing(true)
      const snapshot = await query.get()
      const notifications = []
      snapshot.forEach(doc => {
        notifications.push({ ...doc.data(), id: doc.id })
      })
      const allNotifications = handleInsertNewNotifications(notifications)
      handleDispatchNotifications(allNotifications)
      setRefresing(false)
    } catch (error) {
      console.log('error getNewNotifications =>', error)
      setRefresing(false)
    }
  }
  const getInitNotifications = async () => {
    try {
      setRefresing(true)
      const snapshot = await query.get()
      const notifications = []
      snapshot.forEach(doc => {
        notifications.push({ ...doc.data(), id: doc.id })
      })
      handleDispatchNotifications(notifications)
      dispatch(
        userActions.setHaveNewNotification({
          check: notifications?.some(obj => obj?.seen === false),
        }),
      )
      setRefresing(false)
    } catch (error) {
      console.log('error getInitNotifications =>', error)
      setRefresing(false)
    }
  }
  const getOldNotifications = async () => {
    try {
      if (notificationList.length < LIMIT) {
        return
      }
      setRefresing(true)
      const snapshot = await collectionRef
        .where('uid', '==', userId)
        .orderBy('createdAt', 'desc')
        .startAfter(notificationList[notificationList.length - 1].createdAt)
        .limit(LIMIT)
        .get()
      const notifications = []
      snapshot.forEach(doc => {
        notifications.push({ ...doc.data(), id: doc.id })
      })
      const allNotifications = handleFilterNotifications(notifications)
      handleDispatchNotifications(allNotifications)
      setRefresing(false)
    } catch (error) {
      console.log('error getOldNotifications =>', error)
      setRefresing(false)
    }
  }
  return {
    refreshing,
    getInitNotifications,
    getNewNotifications,
    getOldNotifications,
  }
}

export { useNotification }
